import React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CreditCard, Tag, Plane } from 'lucide-react'
import { Id } from '@/convex/_generated/dataModel'

interface FlightBookingCardProps {
    flight: {
        _id: Id<"FlightBookings">;
        airline: string;
        flightNumber: string;
        from: string;
        to: string;
        departure: string;
        arrival: string;
        date: string;
        status: string;
        passengerDetails: any; // Using any for flexible json structure access
        bookingId: string;
    }
}

function FlightBookingCard({ flight }: FlightBookingCardProps) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                {/* Icon Section */}
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                    <Plane className="w-8 h-8 text-white" />
                </div>

                {/* Main Info */}
                <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                                {flight.from.split('(')[0].trim()} <span className="text-gray-400">→</span> {flight.to.split('(')[0].trim()}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                {flight.airline} {flight.flightNumber.split(' ').pop()}
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-green-100 dark:border-green-900 self-start md:self-auto">
                            {flight.status}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 w-full">
                        <div className="flex gap-3 items-start">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">{flight.date}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">{flight.departure} - {flight.arrival}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Class</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">{flight.passengerDetails?.class || 'Economy'}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Booking Ref</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 font-mono">{flight.bookingId.substring(0, 6)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
                <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
                    View Details
                </Button>
                <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
                    Check-in
                </Button>
                <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
                    Manage Booking
                </Button>
            </div>
        </div>
    )
}

export default FlightBookingCard
