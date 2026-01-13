import React from 'react'
import { Calendar, MapPin, ArrowRight, Plane, Globe, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function DashboardSidebar({ stats, upcomingTrip, user }: any) {
    return (
        <div className="space-y-6">
            {/* Upcoming Trip Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold">
                    <Calendar className="w-5 h-5" />
                    <h3>Upcoming Trip</h3>
                </div>

                {upcomingTrip ? (
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{upcomingTrip.destination.city}</h4>
                                <p className="text-sm text-gray-500">{upcomingTrip.destination.country}</p>
                            </div>
                            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-blue-600">
                                <Plane className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(upcomingTrip.startDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                Flight confirmed • 3 days left
                            </div>
                        </div>

                        <Link href={`/itineraries/${upcomingTrip._id}`}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                                View Details
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <p>No upcoming trips.</p>
                        <Link href="/create-new-trip">
                            <Button variant="link" className="text-blue-600">Plan one now</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-green-500" /> Travel Stats</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                        <p className="text-xs text-gray-500 mb-1">Countries</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.countriesVisited || 0}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                        <p className="text-xs text-gray-500 mb-1">Flights</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.savedFlights || 0}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                    <Link href="/saved">
                        <Button variant="outline" className="w-full justify-start gap-2 h-12 rounded-xl">
                            <Plane className="w-4 h-4 text-blue-500" /> View Saved Flights
                        </Button>
                    </Link>
                    <Link href="/documents">
                        <Button variant="outline" className="w-full justify-start gap-2 h-12 rounded-xl">
                            <Paperclip className="w-4 h-4 text-orange-500" /> Manage Documents
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DashboardSidebar
