"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { Map, Loader2, Plus } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import ItineraryCard from './_components/ItineraryCard'
import CreateItineraryModal from './_components/CreateItineraryModal'
import { Button } from '@/components/ui/button'

function Itineraries() {
    const { user, isLoaded } = useUser();
    const itineraries = useQuery(api.itineraries.getItineraries,
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
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <Map className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trip Itineraries</h1>
                                <p className="text-gray-500 dark:text-gray-400">Plan your day-by-day travel schedules.</p>
                            </div>
                        </div>
                        <CreateItineraryModal />
                    </div>

                    {/* Content */}
                    {!isLoaded || itineraries === undefined ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                        </div>
                    ) : itineraries.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <Map className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No itineraries yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Create your first detailed travel plan to organize your activities, hotels, and transport.
                            </p>
                            <CreateItineraryModal>
                                <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl mt-4 gap-2">
                                    <Plus className="w-4 h-4" /> Create Plan
                                </Button>
                            </CreateItineraryModal>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {itineraries.map((itinerary) => (
                                <ItineraryCard key={itinerary._id} itinerary={itinerary} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Itineraries
