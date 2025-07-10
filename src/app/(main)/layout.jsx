"use client";
import { Sidebar } from "../components/sidebar/Sidebar";
import TopBar from "../components/sidebar/TopBar";
import { AuthProvider } from "../context/AuthContext";
import { ClinicProvider } from "../context/ClinicContext";
import React, { useState } from "react";
import { cn } from "../lib/utils";

const Layout = ({ children }) => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <AuthProvider>
            <ClinicProvider>
                <div className="flex h-screen bg-gray-50">
                    <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
                    {/* Overlay for mobile drawer */}
                    {mobileSidebarOpen && (
                        <div
                            className="fixed inset-0 z-40 bg-gray-400 bg-opacity-30 sm:hidden transition-colors duration-300"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                    )}
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
                        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                            {children}
                        </main>
                    </div>
                </div>
            </ClinicProvider>
        </AuthProvider>
    );
};

export default Layout;
