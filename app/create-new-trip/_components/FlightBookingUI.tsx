import React from 'react'
import { Plane, Clock, ArrowRight, Briefcase, Utensils, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type Flight = {
    id: string
    airline: string
    flightNumber: string
    from: string
    to: string
    departure: string
    arrival: string
    duration: string
    price: number
    currency: string
    stops: number
    aircraft: string
    baggage: string
    meals: boolean
    cancellation: string
    availability: number
}

type FlightBookingUIProps = {
    flights: Flight[]
    route: { from: string, to: string }
    budget?: number
}

function FlightBookingUI({ flights, route, budget }: FlightBookingUIProps) {
    const handleBook = (flightId: string) => {
        // Construct a real Skyscanner search URL (approximate)
        // Format: https://www.skyscanner.co.in/transport/flights/pnq/del/241220
        // We'll use a generic search link for now or specific if possible
        const url = `https://www.skyscanner.co.in/transport/flights/${route.from.toLowerCase().substring(0, 3)}/${route.to.toLowerCase().substring(0, 3)}`;
        window.open(url, '_blank');
    }

    const filteredFlights = budget
        ? flights.filter(f => f.price <= budget)
        : flights;

    if (!filteredFlights || filteredFlights.length === 0) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-500">No flights found {budget ? `within ₹${budget}` : 'for this route'}.</p>
                {/* Show expensive ones if budget filter was too strict */}
                {budget && flights.length > 0 && (
                    <div className="mt-2 text-xs text-indigo-600 cursor-pointer" onClick={() => handleBook('')}>
                        View {flights.length} flights outside budget
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-indigo-500" />
                    Flights to {route.to} {budget && <span className="text-xs font-normal text-gray-500">(Max ₹{budget.toLocaleString()})</span>}
                </h3>
            </div>

            <div className="grid gap-3">
                {filteredFlights.map((flight) => (
                    <div key={flight.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm group">

                        {/* Header: Airline & Price */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-gray-300">
                                    {flight.airline.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{flight.airline}</h4>
                                    <p className="text-xs text-gray-500">{flight.flightNumber} • {flight.aircraft}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {flight.currency === 'INR' ? '₹' : '$'}{flight.price.toLocaleString()}
                                </div>
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    {flight.availability} seats left
                                </p>
                            </div>
                        </div>

                        {/* Flight Route Visual */}
                        <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{flight.departure}</p>
                                <p className="text-xs font-medium text-gray-500 uppercase">{flight.from}</p>
                            </div>

                            <div className="flex-1 px-4 flex flex-col items-center">
                                <p className="text-xs text-gray-400 mb-1">{flight.duration}</p>
                                <div className="w-full flex items-center gap-2">
                                    <div className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600 relative">
                                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                    </div>
                                    {flight.stops === 0 ? (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium whitespace-nowrap">
                                            Non-stop
                                        </span>
                                    ) : (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-medium whitespace-nowrap">
                                            {flight.stops} Stop
                                        </span>
                                    )}
                                    <div className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600 relative"></div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{flight.arrival}</p>
                                <p className="text-xs font-medium text-gray-500 uppercase">{flight.to}</p>
                            </div>
                        </div>

                        {/* Amenities & Action */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1" title={flight.baggage}>
                                    <Briefcase className="w-3 h-3" />
                                    <span>{flight.baggage}</span>
                                </div>
                                {flight.meals && (
                                    <div className="flex items-center gap-1">
                                        <Utensils className="w-3 h-3" />
                                        <span>Meals</span>
                                    </div>
                                )}
                            </div>
                            <Button size="sm" onClick={() => handleBook(flight.id)} className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                                Book Flight
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-2">
                <Button variant="ghost" size="sm" onClick={() => handleBook('')} className="text-xs text-gray-500">
                    View all flights on Skyscanner <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
            </div>
        </div>
    )
}

export default FlightBookingUI
