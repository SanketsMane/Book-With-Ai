"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Plane,
    Bell,
    Map,
    Award,
    FileText,
    FolderClosed,
    Users,
    Zap,
    ArrowUpCircle,
    Bookmark,
    Navigation,
    MoreHorizontal
} from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'

const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
    { icon: <Plane className="w-5 h-5" />, label: 'My Trips', path: '/my-trips' },
    { icon: <Bell className="w-5 h-5" />, label: 'Price Alerts', path: '/price-alerts' },
    { icon: <Map className="w-5 h-5" />, label: 'Explore', path: '/explore' },
    { icon: <Award className="w-5 h-5" />, label: 'Loyalty & Miles', path: '/loyalty-program' },
    { icon: <FileText className="w-5 h-5" />, label: 'Itineraries', path: '/create-new-trip' },
    { icon: <FolderClosed className="w-5 h-5" />, label: 'Document Vault', path: '/documents' },
    { icon: <Users className="w-5 h-5" />, label: 'Group Trips', path: '/group-planning' },
    { icon: <Zap className="w-5 h-5" />, label: 'Pro Mode', path: '/pro-mode' },
    { icon: <ArrowUpCircle className="w-5 h-5" />, label: 'Upgrade Advisor', path: '/upgrades' },
    { icon: <Bookmark className="w-5 h-5" />, label: 'Saved Flights', path: '/saved' },
    { icon: <Navigation className="w-5 h-5" />, label: 'Airport Analyzer', path: '/airports' },
]

function AppSidebar() {
    const path = usePathname();
    const { user } = useUser();

    return (
        <div className="w-72 h-screen border-r border-border/50 bg-sidebar/80 backdrop-blur-xl flex flex-col fixed left-0 top-0 overflow-y-auto hidden lg:flex z-50 transition-all duration-300">
            {/* Logo Section */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        B
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">Book With Ai</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-1.5 mt-4">
                {sidebarItems.map((item, index) => {
                    const isActive = path === item.path;
                    return (
                        <Link key={index} href={item.path} className="block relative group">
                            {isActive && (
                                <div className="absolute left-0 w-1 h-2/3 top-1/6 bg-primary rounded-r-lg" />
                            )}
                            <div className={`flex items-center gap-3 px-4 py-3.5 mx-2 rounded-xl transition-all duration-200 relative overflow-hidden
                                ${isActive
                                    ? 'text-primary bg-primary/10 font-medium'
                                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                                }`}>
                                <div className="relative z-10 flex items-center gap-3">
                                    {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                                        className: `w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`
                                    })}
                                    <span className="text-sm">{item.label}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-6 border-t border-border/50 bg-sidebar/50 backdrop-blur-sm">
                {user ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-sidebar-accent cursor-pointer transition-colors border border-transparent hover:border-border/50 group">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 ring-2 ring-background group-hover:ring-primary/20 transition-all"
                                }
                            }}
                        />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {user.fullName || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                View Profile
                            </p>
                        </div>
                    </div>
                ) : (
                    <Link href="/sign-in" className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                        <span>Sign In</span>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default AppSidebar
