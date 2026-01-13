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
        clerkUser?.primaryEmailAddress?.emailAddress ? { userId: clerkUser.primaryEmailAddress.emailAddress } : "skip" // Wait for email
    );

    const updateProfile = useMutation(api.user_dashboard.updateProfile);
    const updatePreferences = useMutation(api.user_dashboard.updatePreferences); // Needs implementation details
    const updateNotifications = useMutation(api.user_dashboard.updateNotifications); // Needs implementation details
    const clearAiMemory = useMutation(api.user_dashboard.clearAiMemory);

    if (dashboardData === undefined) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-black">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        )
    }

    const handleProfileUpdate = async (data: any) => {
        if (!dashboardData.user?._id || !clerkUser?.primaryEmailAddress?.emailAddress) return;
        await updateProfile({
            docId: dashboardData.user._id,
            userId: clerkUser.primaryEmailAddress.emailAddress,
            data
        });
        toast.success("Profile updated successfully");
    }

    const handlePreferencesUpdate = async (data: any) => {
        // Need to pass userId (email) as per our backend logic
        if (!clerkUser?.primaryEmailAddress?.emailAddress) return;
        await updatePreferences({
            userId: clerkUser.primaryEmailAddress.emailAddress,
            preferences: data
        });
        toast.success("Preferences saved");
    }

    const handleNotificationsUpdate = async (data: any) => {
        if (!clerkUser?.primaryEmailAddress?.emailAddress) return;
        await updateNotifications({
            userId: clerkUser.primaryEmailAddress.emailAddress,
            settings: data
        });
        toast.success("Settings updated");
    }

    const handleClearMemory = async () => {
        if (!clerkUser?.primaryEmailAddress?.emailAddress) return;
        await clearAiMemory({ userId: clerkUser.primaryEmailAddress.emailAddress });
        toast.success("AI Memory cleared");
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-4 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                            <span>Back to Home</span>
                        </div>
                        <ProfileHeader
                            user={dashboardData.user}
                            stats={dashboardData.stats}
                            onUpdate={handleProfileUpdate}
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <PersonalInfo
                                user={dashboardData.user}
                                onUpdate={handleProfileUpdate}
                            />

                            <TravelPreferences
                                preferences={dashboardData.preferences}
                                onUpdate={handlePreferencesUpdate}
                            />

                            <NotificationSettings
                                settings={dashboardData.notificationSettings}
                                onUpdate={handleNotificationsUpdate}
                                onClearMemory={handleClearMemory}
                            />
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-1">
                            <DashboardSidebar
                                stats={dashboardData.stats}
                                upcomingTrip={dashboardData.upcomingTrip}
                                user={dashboardData.user}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Dashboard
