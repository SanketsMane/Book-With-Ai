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
    { icon: <FileText className="w-5 h-5" />, label: 'Itineraries', path: '/create-new-trip' }, // Assuming this maps here or new route
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
        <div className="w-72 h-screen border-r bg-white dark:bg-gray-900 flex flex-col fixed left-0 top-0 overflow-y-auto hidden lg:flex">
            {/* Logo Section */}
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        B
                    </div>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">Book With Ai</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-1 mt-4">
                {sidebarItems.map((item, index) => (
                    <Link key={index} href={item.path}>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                            ${path === item.path
                                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 font-medium'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}>
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            {/* User Profile Section */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                {user ? (
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                        <UserButton />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {user.fullName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                View Profile
                            </p>
                        </div>
                    </div>
                ) : (
                    <Link href="/sign-in" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <span>Sign In</span>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default AppSidebar
