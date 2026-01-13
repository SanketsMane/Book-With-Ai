import React from 'react'
import { Plane, Trash2, Bell, BellOff, Tag, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface FlightCardProps {
    flight: {
        _id: Id<"SavedFlights">;
        flightDetails: any;
        pricing: any;
        title?: string;
        isPriceTracked: boolean;
        savedAt: string;
        searchParams: any;
    }
}

function FlightCard({ flight }: FlightCardProps) {
    const deleteFlight = useMutation(api.saved_flights.deleteSavedFlight);
    const updateFlight = useMutation(api.saved_flights.updateSavedFlight);

    const handleDelete = async () => {
        await deleteFlight({ id: flight._id });
    }

    const toggleTracking = async () => {
        await updateFlight({
            id: flight._id,
            updates: { isPriceTracked: !flight.isPriceTracked }
        });
    }

    const { outbound } = flight.flightDetails;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row justify-between gap-6">

                {/* Flight Info */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                            <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                {outbound.airline}
                            </h3>
                            <p className="text-sm text-gray-500">{outbound.flightNumber} • {flight.title}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{outbound.departure}</p>
                            <p className="text-sm text-gray-500">{flight.searchParams?.from || 'Origin'}</p>
                        </div>

                        <div className="flex flex-col items-center flex-1 max-w-[120px]">
                            <p className="text-xs text-gray-400 font-medium mb-1">{outbound.duration}</p>
                            <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-700 relative">
                                <div className="absolute w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 left-0 -top-[3px]"></div>
                                <div className="absolute w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 right-0 -top-[3px]"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{outbound.stops} Stop(s)</p>
                        </div>

                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{outbound.arrival}</p>
                            <p className="text-sm text-gray-500">{flight.searchParams?.to || 'Dest'}</p>
                        </div>
                    </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col items-end justify-between gap-4 border-l pl-6 border-gray-100 dark:border-gray-800">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Price</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {flight.pricing.currency} {flight.pricing.amount.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className={`gap-2 rounded-lg ${flight.isPriceTracked ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}`}
                            onClick={toggleTracking}
                        >
                            {flight.isPriceTracked ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                            {flight.isPriceTracked ? 'Tracking' : 'Track Price'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FlightCard
