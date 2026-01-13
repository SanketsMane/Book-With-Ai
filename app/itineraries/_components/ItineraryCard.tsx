import React from 'react'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Id } from '@/convex/_generated/dataModel'

interface ItineraryCardProps {
    itinerary: {
        _id: Id<"Itineraries">;
        title: string;
        destination: { city: string; country: string };
        startDate: string;
        endDate: string;
        coverImage?: string;
        status: string;
        collaborators: any[];
    }
}

function ItineraryCard({ itinerary }: ItineraryCardProps) {
    // Format dates (simple)
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Status colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
            case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
            <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                {/* Placeholder for cover image if not provided */}
                {itinerary.coverImage ? (
                    <img src={itinerary.coverImage} alt={itinerary.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-50 dark:bg-teal-900/20">
                        <MapPin className="w-12 h-12 text-teal-200 dark:text-teal-800" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge className={`${getStatusColor(itinerary.status)} border-none capitalize`}>
                        {itinerary.status}
                    </Badge>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 transition-colors">
                    {itinerary.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {itinerary.destination.city}, {itinerary.destination.country}
                </p>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}</span>
                        </div>
                    </div>

                    <Link href={`/itineraries/${itinerary._id}`} className="block">
                        <Button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl">
                            View Plan <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ItineraryCard
