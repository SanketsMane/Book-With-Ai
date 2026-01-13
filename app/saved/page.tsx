"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { Bookmark, Loader2 } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import FlightCard from './_components/FlightCard'
import EmptyState from './_components/EmptyState'
import AddFlightModal from './_components/AddFlightModal'

function SavedFlights() {
    const { user, isLoaded } = useUser();
    const savedFlights = useQuery(api.saved_flights.getSavedFlights,
        user ? { userId: user.id || "test_user_id" } : "skip"
    );

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-4 md:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Bookmark className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Flights</h1>
                                <p className="text-gray-500 dark:text-gray-400">Your bookmarked flight options.</p>
                            </div>
                        </div>
                        <AddFlightModal />
                    </div>

                    {/* Content */}
                    {!isLoaded || savedFlights === undefined ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                        <div className="h-3 w-32 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : savedFlights.length === 0 ? (
                        <EmptyState onAddClick={() => document.querySelector<HTMLElement>('[data-add-trigger]')?.click()} />
                    ) : (
                        <div className="space-y-4">
                            {savedFlights.map((flight) => (
                                <FlightCard key={flight._id} flight={flight} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SavedFlights
