import React from 'react'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Id } from '@/convex/_generated/dataModel'

interface GroupTripCardProps {
    trip: {
        _id: Id<"GroupTrips">;
        name: string;
        destination: { city: string; country: string };
        startDate: string;
        endDate: string;
        coverImage?: string;
        status: string;
        members: any[];
    }
}

function GroupTripCard({ trip }: GroupTripCardProps) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
            <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                {/* Placeholder for cover image */}
                {trip.coverImage ? (
                    <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pink-50 dark:bg-pink-900/20">
                        <Users className="w-12 h-12 text-pink-200 dark:text-pink-800" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm shadow-sm border-none capitalize">
                        {trip.status}
                    </Badge>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 transition-colors">
                    {trip.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {trip.destination.city}, {trip.destination.country}
                </p>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                        </div>

                        {/* Member Avatars */}
                        <div className="flex -space-x-2">
                            {trip.members.slice(0, 3).map((member, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-600 overflow-hidden">
                                    {member.avatar ? (
                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        member.name[0]
                                    )}
                                </div>
                            ))}
                            {trip.members.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[8px] font-bold text-gray-500">
                                    +{trip.members.length - 3}
                                </div>
                            )}
                        </div>
                    </div>

                    <Link href={`/group-planning/${trip._id}`} className="block">
                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
                            Enter Group Hub <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default GroupTripCard
