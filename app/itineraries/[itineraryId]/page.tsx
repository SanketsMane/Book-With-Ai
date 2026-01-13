"use client"
import React, { use } from 'react'
import AppSidebar from '../../_components/AppSidebar'
import { Calendar, MapPin, Loader2, ArrowLeft, MoreHorizontal, Share } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ActivityCard from '../_components/ActivityCard'
import AddActivityModal from '../_components/AddActivityModal'

interface ItineraryDetailProps {
    params: Promise<{ itineraryId: string }>;
}

function ItineraryDetail({ params }: ItineraryDetailProps) {
    // Correctly unwrap params using React.use() or await in async component
    // Since this is client component, we should strictly use `use` hook for params if Next.js 15, or async/await if server. 
    // BUT given the user's environment, standard params prop access might be sufficient or `use` pattern.
    // Let's assume params is a Promise as per Next 15 changes, so I'll use `use(params)`.
    const resolvedParams = use(params);
    const itineraryId = resolvedParams.itineraryId as Id<"Itineraries">;

    const itinerary = useQuery(api.itineraries.getItinerary, { id: itineraryId });
    const deleteActivity = useMutation(api.itineraries.deleteActivity);

    if (itinerary === undefined) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        )
    }

    if (itinerary === null) {
        return <div className="p-10">Itinerary not found</div>
    }

    const handleDeleteActivity = async (dayIndex: number, activityId: string) => {
        if (confirm("Are you sure you want to delete this activity?")) {
            await deleteActivity({ itineraryId, dayIndex, activityId });
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen">
                {/* Hero Header */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-5xl mx-auto px-8 py-8">
                        <Link href="/itineraries" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Itineraries
                        </Link>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                                    {itinerary.title}
                                </h1>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {itinerary.destination.city}, {itinerary.destination.country}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="gap-2">
                                    <Share className="w-4 h-4" /> Share
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Content */}
                <div className="max-w-5xl mx-auto px-8 py-12">
                    <div className="space-y-12">
                        {itinerary.days.map((day, dayIndex) => (
                            <div key={day.day} className="relative">
                                {/* Day Header */}
                                <div className="flex items-center gap-4 mb-6 sticky top-0 bg-gray-50 dark:bg-black z-10 py-4">
                                    <div className="w-12 h-12 bg-teal-600 rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-lg shadow-teal-600/20">
                                        <span className="text-xs uppercase">Day</span>
                                        <span className="text-lg">{day.day}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {day.activities.length} Activities
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <AddActivityModal itineraryId={itinerary._id} dayIndex={dayIndex} />
                                    </div>
                                </div>

                                {/* Activities List */}
                                <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-800 pl-8 space-y-6 pb-4">
                                    {day.activities.length === 0 ? (
                                        <div className="text-gray-400 italic text-sm py-4">
                                            No activities planned for this day.
                                        </div>
                                    ) : (
                                        day.activities.map((activity) => (
                                            <ActivityCard
                                                key={activity.id}
                                                activity={activity}
                                                onDelete={() => handleDeleteActivity(dayIndex, activity.id)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItineraryDetail
