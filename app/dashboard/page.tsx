"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { Loader2 } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import ProfileHeader from './_components/ProfileHeader'
import PersonalInfo from './_components/PersonalInfo'
import TravelPreferences from './_components/TravelPreferences'
import NotificationSettings from './_components/NotificationSettings'
import DashboardSidebar from './_components/DashboardSidebar'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

function Dashboard() {
    const { user: clerkUser } = useUser();

    // We use email as the stable ID for now, as implemented in backend
    const dashboardData = useQuery(api.user_dashboard.getUserDashboard,
        clerkUser ? {} : "skip" // Wait for user
    );

    const updateProfile = useMutation(api.user_dashboard.updateProfile);
    const updatePreferences = useMutation(api.user_dashboard.updatePreferences); // Needs implementation details
    const updateNotifications = useMutation(api.user_dashboard.updateNotifications); // Needs implementation details
    const clearAiMemory = useMutation(api.user_dashboard.clearAiMemory);

    if (dashboardData === undefined || dashboardData === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
                <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
            </div>
        )
    }

    const handleProfileUpdate = async (data: any) => {
        if (!dashboardData.user?._id || !clerkUser?.primaryEmailAddress?.emailAddress) return;
        await updateProfile({
            data
        });
        toast.success("Profile updated successfully");
    }

    const handlePreferencesUpdate = async (data: any) => {
        // Need to pass userId (email) as per our backend logic
        if (!clerkUser?.primaryEmailAddress?.emailAddress) return;
        await updatePreferences({
            preferences: data
        });
        toast.success("Preferences saved");
    }

    const handleNotificationsUpdate = async (data: any) => {
        if (!clerkUser?.primaryEmailAddress?.emailAddress) return;
        await updateNotifications({
            settings: data
        });
        toast.success("Settings updated");
    }

    const handleClearMemory = async () => {
        if (!clerkUser?.primaryEmailAddress?.emailAddress) return;
        await clearAiMemory({});
        toast.success("AI Memory cleared");
    }

    return (
        <div className='min-h-screen bg-background font-sans relative overflow-x-hidden'>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-4 md:p-8 lg:p-12 relative">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="mb-8 relative z-10">
                        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-primary transition-colors w-fit cursor-pointer group">
                            <div className="p-1 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                            </div>
                            <span>Back to Home</span>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/5 to-blue-500/10 p-8 border border-white/20 shadow-xl backdrop-blur-3xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <ProfileHeader
                                    user={dashboardData.user}
                                    stats={dashboardData.stats}
                                    onUpdate={handleProfileUpdate}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6 relative z-10">
                        {/* Main Content Column - Bento Grid */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Personal Info & Preferences in a Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-card/50 backdrop-blur-md border border-white/10 p-1 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
                                    <PersonalInfo
                                        user={dashboardData.user}
                                        onUpdate={handleProfileUpdate}
                                    />
                                </div>
                                <div className="bg-card/50 backdrop-blur-md border border-white/10 p-1 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
                                    <NotificationSettings
                                        settings={dashboardData.notificationSettings}
                                        onUpdate={handleNotificationsUpdate}
                                        onClearMemory={handleClearMemory}
                                    />
                                </div>
                            </div>

                            {/* Full Width Section */}
                            <div className="bg-card/50 backdrop-blur-md border border-white/10 p-1 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
                                <TravelPreferences
                                    preferences={dashboardData.preferences}
                                    onUpdate={handlePreferencesUpdate}
                                />
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="sticky top-8">
                                <DashboardSidebar
                                    stats={dashboardData.stats}
                                    upcomingTrip={dashboardData.upcomingTrip}
                                    user={dashboardData.user}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Dashboard
