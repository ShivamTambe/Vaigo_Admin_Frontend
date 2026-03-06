import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Submissions from './components/Submissions';

function App() {
    return (
        <Router>
            <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
                <Sidebar />

                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/submissions" element={<Submissions />} />
                            <Route path="*" element={<div className="flex h-full items-center justify-center text-slate-500">Page not found or under construction</div>} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
