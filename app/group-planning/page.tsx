"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { Users, Loader2, Plus } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import GroupTripCard from './_components/GroupTripCard'
import CreateGroupTripModal from './_components/CreateGroupTripModal'
import { Button } from '@/components/ui/button'

function GroupPlanning() {
    const { user, isLoaded } = useUser();
    const groupTrips = useQuery(api.group_trips.getGroupTrips,
        user ? { userId: user.id || "test_user_id" } : "skip"
    );

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-8 md:p-12">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Group Trips</h1>
                                <p className="text-gray-500 dark:text-gray-400">Plan together with friends and family.</p>
                            </div>
                        </div>
                        <CreateGroupTripModal />
                    </div>

                    {/* Content */}
                    {!isLoaded || groupTrips === undefined ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
                        </div>
                    ) : groupTrips.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No group trips yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Create a shared workspace for your next group adventure. Chat, vote on ideas, and split expenses.
                            </p>
                            <CreateGroupTripModal>
                                <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl mt-4 gap-2">
                                    <Plus className="w-4 h-4" /> Start Planning
                                </Button>
                            </CreateGroupTripModal>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupTrips.map((trip) => (
                                <GroupTripCard key={trip._id} trip={trip} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GroupPlanning
