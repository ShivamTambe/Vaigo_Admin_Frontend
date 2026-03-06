import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, Clock, Mail, Users, Building, Calendar, Tv, XCircle, X } from 'lucide-react';
import { cn } from './Sidebar';

const statusStyles = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    reviewed: 'bg-blue-50 text-blue-600 border-blue-200',
    resolved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    unsubscribed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const statusIcons = {
    pending: Clock,
    reviewed: Search,
    resolved: CheckCircle2,
    active: CheckCircle2,
    unsubscribed: XCircle,
};

export default function Submissions() {
    const [activeTab, setActiveTab] = useState('contacts');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingSubmission, setEditingSubmission] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [newAction, setNewAction] = useState('');
    const [pendingNotes, setPendingNotes] = useState([]);
    const [pendingActions, setPendingActions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleEditClick = (submission) => {
        setEditingSubmission(submission);
        setNewNote('');
        setNewAction('');
        setPendingNotes([]);
        setPendingActions([]);
    };

    const handleSaveStatus = async (newStatus) => {
        if (!editingSubmission) return;
        setIsSaving(true);
        try {
            const id = editingSubmission._id || editingSubmission.id;
            const res = await fetch(`https://vaigo-admin-backend.onrender.com/api/admin/${activeTab}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    pendingNotes,
                    pendingActions
                })
            });

            if (res.ok) {
                const updatedRecord = await res.json();

                // Update local state so UI updates
                setData(prev => ({
                    ...prev,
                    [activeTab]: prev[activeTab].map(item => {
                        const currentId = item._id || item.id;
                        const updatedId = updatedRecord._id || updatedRecord.id;
                        return String(currentId) === String(updatedId) ? updatedRecord : item;
                    })
                }));

                setEditingSubmission(null);
                setNewNote('');
                setNewAction('');
                setPendingNotes([]);
                setPendingActions([]);
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddPendingEntry = (type) => {
        const value = type === 'note' ? newNote : newAction;
        if (!value.trim()) return;

        if (type === 'note') {
            setPendingNotes(prev => [...prev, { text: newNote, date: new Date().toISOString() }]);
            setNewNote('');
        } else {
            setPendingActions(prev => [...prev, { action: newAction, timestamp: new Date().toISOString() }]);
            setNewAction('');
        }
    };

    const handleCloseModal = () => {
        if (!editingSubmission) return;

        const originalStatus = data[activeTab].find(item => {
            const currentId = item._id || item.id;
            const editId = editingSubmission._id || editingSubmission.id;
            return String(currentId) === String(editId);
        })?.status || 'pending';

        const hasUnsavedChanges =
            pendingNotes.length > 0 ||
            pendingActions.length > 0 ||
            newNote.trim() !== '' ||
            newAction.trim() !== '' ||
            editingSubmission.status !== originalStatus;

        if (hasUnsavedChanges) {
            if (!window.confirm("You have unsaved changes. Are you sure you want to exit without saving?")) {
                return;
            }
        }

        setEditingSubmission(null);
        setNewNote('');
        setNewAction('');
        setPendingNotes([]);
        setPendingActions([]);
    };

    const [data, setData] = useState({
        contacts: [],
        demos: [],
        schedules: [],
        partnerships: [],
        subscribers: []
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [contactsRes, schedulesRes, partnershipsRes, subscribersRes, demosRes] = await Promise.all([
                    fetch('https://vaigo-admin-backend.onrender.com/api/admin/contacts').catch(() => []),
                    fetch('https://vaigo-admin-backend.onrender.com/api/admin/schedules').catch(() => []),
                    fetch('https://vaigo-admin-backend.onrender.com/api/admin/partnerships').catch(() => []),
                    fetch('https://vaigo-admin-backend.onrender.com/api/admin/subscribers').catch(() => []),
                    fetch('https://vaigo-admin-backend.onrender.com/api/admin/demos').catch(() => []),
                ]);

                const parseData = async (res) => (res && res.json ? await res.json().catch(() => []) : []);

                setData({
                    contacts: await parseData(contactsRes),
                    schedules: await parseData(schedulesRes),
                    partnerships: await parseData(partnershipsRes),
                    subscribers: await parseData(subscribersRes),
                    demos: await parseData(demosRes),
                });
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const TABS = [
        { id: 'contacts', name: 'Contacts', icon: Users, data: data.contacts },
        { id: 'demos', name: 'Demos', icon: Tv, data: data.demos },
        { id: 'schedules', name: 'Schedules', icon: Calendar, data: data.schedules },
        { id: 'partnerships', name: 'Partnership', icon: Building, data: data.partnerships },
        { id: 'subscribers', name: 'Email Subscribers', icon: Mail, data: data.subscribers },
    ];

    const currentTabInfo = TABS.find(t => t.id === activeTab);
    const displayedData = currentTabInfo.data.filter(sub => {
        const searchString = JSON.stringify(sub).toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Form Submissions</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and respond to inquiries from the public website.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 overflow-x-auto border-b border-slate-200">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                isActive
                                    ? "border-primary-600 text-primary-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.name}
                            <span className={cn(
                                "ml-2 py-0.5 px-2 rounded-full text-xs",
                                isActive ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-600"
                            )}>
                                {tab.data.length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Inquiry Type
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Message Overview
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {displayedData.length > 0 ? (
                                displayedData.map((submission) => {
                                    const statusVal = submission.status || 'pending';
                                    const StatusIcon = statusIcons[statusVal] || Clock;
                                    return (
                                        <tr key={submission.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {submission.name || submission.fullName || submission.email}
                                                    </span>
                                                    {(submission.name || submission.fullName) && (
                                                        <span className="text-sm text-slate-500">{submission.email}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    {submission.inquiry || submission.meetingType || submission.partnershipType || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 truncate max-w-xs" title={submission.message || submission.callPurpose || 'N/A'}>
                                                    {submission.message || submission.callPurpose || 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {new Date(submission.date || submission.subscribedAt || submission.createdAt).toLocaleString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[statusVal] || statusStyles.pending}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    <span className="capitalize">{statusVal}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditClick(submission)}
                                                    className="text-slate-400 hover:text-primary-600 transition-colors p-1 rounded-md hover:bg-primary-50"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="w-8 h-8 text-slate-300 mb-3" />
                                            <p className="text-base font-medium text-slate-900">No submissions found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{displayedData.length}</span> of <span className="font-medium">{displayedData.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                    Previous
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingSubmission && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg mt-10 sm:mt-0">
                        {/* Outside Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute -top-12 right-0 sm:-right-12 sm:-top-2 text-white/80 hover:text-white hover:bg-white/10 transition-all p-2 rounded-full"
                        >
                            <X className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>

                        {/* Modal Box */}
                        <div className="bg-white rounded-xl shadow-2xl w-full flex flex-col max-h-[85vh]">
                            {/* Sticky Header */}
                            <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
                                <h2 className="text-xl font-bold text-slate-900">Edit Submission</h2>
                            </div>

                            {/* Scrollable Content (No Scrollbar) */}
                            <div className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                        value={editingSubmission.status || 'pending'}
                                        onChange={(e) => setEditingSubmission({ ...editingSubmission, status: e.target.value })}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="active">Active</option>
                                        <option value="unsubscribed">Unsubscribed</option>
                                    </select>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-200">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Add Note</label>
                                        <div className="flex flex-col gap-2">
                                            <textarea
                                                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                                rows={2}
                                                placeholder="Write an internal note..."
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                            ></textarea>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleAddPendingEntry('note')}
                                                    disabled={!newNote.trim()}
                                                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-md transition-colors border border-amber-200 disabled:opacity-50 flex items-center gap-1.5"
                                                >
                                                    Add Note
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Record Action in History</label>
                                        <div className="flex flex-col gap-2">
                                            <textarea
                                                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                rows={2}
                                                placeholder="Record an action taken with this contact..."
                                                value={newAction}
                                                onChange={(e) => setNewAction(e.target.value)}
                                            ></textarea>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleAddPendingEntry('action')}
                                                    disabled={!newAction.trim()}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors border border-slate-300 disabled:opacity-50 flex items-center gap-1.5"
                                                >
                                                    Add to list
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Details</h3>
                                    {Object.entries(editingSubmission).filter(([key]) => !['_id', '__v', 'id', 'status', 'history', 'notes'].includes(key)).map(([key, val]) => (
                                        <div key={key} className="flex flex-col">
                                            <span className="text-xs text-slate-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-sm text-slate-900 break-words whitespace-pre-wrap">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                                        </div>
                                    ))}
                                </div>

                                {editingSubmission.notes && editingSubmission.notes.length > 0 && (
                                    <div className="bg-amber-50 rounded-lg p-4 space-y-3 border border-amber-100">
                                        <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wider">Notes</h3>
                                        <div className="space-y-2">
                                            {editingSubmission.notes.map((note, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded border border-amber-200 text-sm shadow-sm">
                                                    <p className="text-slate-800">{typeof note === 'object' ? (note.text || note.note || note.message || JSON.stringify(note)) : note}</p>
                                                    {note.date && (
                                                        <span className="text-xs text-slate-400 mt-1 block">
                                                            {new Date(note.date).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {pendingNotes.length > 0 && (
                                    <div className="bg-amber-50/50 rounded-lg p-4 space-y-3 border border-amber-200 border-dashed">
                                        <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                                            Pending Notes <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full">Unsaved</span>
                                        </h3>
                                        <div className="space-y-2">
                                            {pendingNotes.map((note, idx) => (
                                                <div key={idx} className="bg-white/80 p-3 rounded border border-amber-200 text-sm shadow-sm md:opacity-75">
                                                    <p className="text-slate-800 italic">{note.text}</p>
                                                    <span className="text-xs text-amber-500 mt-1 block">
                                                        {new Date(note.date).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {editingSubmission.history && editingSubmission.history.length > 0 && (
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
                                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">History</h3>
                                        <div className="space-y-2 flex flex-col pt-2 relative border-l border-slate-300 ml-2 pl-4">
                                            {editingSubmission.history.map((h, idx) => (
                                                <div key={idx} className="relative mb-4 last:mb-0">
                                                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary-400 ring-4 ring-white"></span>
                                                    <div className="bg-white p-3 rounded border border-slate-200 text-sm shadow-sm flex flex-col gap-1.5">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                            <div className="flex-1">
                                                                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Action</span>
                                                                <p className="font-medium text-slate-800 break-words whitespace-pre-wrap mt-0.5">{h.action || h.note || h.msg || (h.status ? `Status changed to ${h.status}` : 'Updated')}</p>
                                                            </div>
                                                            <div className="text-left sm:text-right">
                                                                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider block">Timestamp</span>
                                                                <span className="text-xs text-slate-600 mt-0.5 block">{new Date(h.timestamp || h.date || h.createdAt).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {pendingActions.map((h, idx) => (
                                                <div key={`pending-${idx}`} className="relative mb-4 last:mb-0 opacity-70">
                                                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-slate-50"></span>
                                                    <div className="bg-slate-50 p-3 rounded border border-slate-300 border-dashed text-sm shadow-sm flex flex-col gap-1.5">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                            <div className="flex-1">
                                                                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Action (Unsaved)</span>
                                                                <p className="font-medium text-slate-600 italic break-words whitespace-pre-wrap mt-0.5">{h.action}</p>
                                                            </div>
                                                            <div className="text-left sm:text-right">
                                                                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">Timestamp</span>
                                                                <span className="text-xs text-slate-400 mt-0.5 block">{new Date(h.timestamp).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {editingSubmission.history && editingSubmission.history.length === 0 && pendingActions.length > 0 && (
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
                                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">History</h3>
                                        <div className="space-y-2 flex flex-col pt-2 relative border-l border-slate-300 ml-2 pl-4">
                                            {pendingActions.map((h, idx) => (
                                                <div key={`pending-${idx}`} className="relative mb-4 last:mb-0 opacity-70">
                                                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-slate-50"></span>
                                                    <div className="bg-slate-50 p-3 rounded border border-slate-300 border-dashed text-sm shadow-sm flex flex-col gap-1.5">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                            <div className="flex-1">
                                                                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Action (Unsaved)</span>
                                                                <p className="font-medium text-slate-600 italic break-words whitespace-pre-wrap mt-0.5">{h.action}</p>
                                                            </div>
                                                            <div className="text-left sm:text-right">
                                                                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">Timestamp</span>
                                                                <span className="text-xs text-slate-400 mt-0.5 block">{new Date(h.timestamp).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Sticky Footer */}
                            <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 flex-shrink-0 rounded-b-xl">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSaveStatus(editingSubmission.status)}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-slate-900 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                                >
                                    {isSaving ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Saving
                                        </div>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
