"use client"
import React, { useState } from 'react'
import AppSidebar from '../_components/AppSidebar'
import ProModeChat from './_components/ProModeChat'
import ProSearchBar from './_components/ProSearchBar'
import ProFlightCard from './_components/ProFlightCard'
import ProPriceGraph from './_components/ProPriceGraph'
import ProMiniMap from './_components/ProMiniMap'
import { Filter, ArrowUpDown } from 'lucide-react'

// Mock Data
const MOCK_FLIGHTS = [
    {
        id: '1',
        airline: 'Emirates',
        flightNumber: 'EK501',
        departure: { time: '14:35', city: 'Mumbai', code: 'BOM' },
        arrival: { time: '16:50', city: 'Dubai', code: 'DXB' },
        duration: '3h 45m',
        stops: 0,
        price: 340,
        emissions: 124
    },
    {
        id: '2',
        airline: 'Air India',
        flightNumber: 'AI984',
        departure: { time: '18:00', city: 'Mumbai', code: 'BOM' },
        arrival: { time: '20:10', city: 'Dubai', code: 'DXB' },
        duration: '3h 40m',
        stops: 0,
        price: 295,
        emissions: 130
    },
    {
        id: '3',
        airline: 'Indigo',
        flightNumber: '6E842',
        departure: { time: '02:15', city: 'Mumbai', code: 'BOM' },
        arrival: { time: '04:00', city: 'Dubai', code: 'DXB' },
        duration: '3h 15m',
        stops: 0,
        price: 210,
        emissions: 118
    },
    {
        id: '4',
        airline: 'British Airways',
        flightNumber: 'BA199',
        departure: { time: '08:45', city: 'Mumbai', code: 'BOM' },
        arrival: { time: '18:15', city: 'London', code: 'LHR' },
        duration: '9h 30m',
        stops: 0,
        price: 650,
        emissions: 450
    }
]

function ProMode() {
    const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null)

    return (
        <div className='flex h-screen overflow-hidden bg-gray-50 dark:bg-black font-sans'>
            {/* Main App Sidebar (Collapsed on mobile usually) */}
            <div className="hidden lg:block shrink-0">
                <AppSidebar />
            </div>

            {/* Content Area - 3 Panel Grid */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 flex overflow-hidden">

                    {/* LEFT PANEL: AI Chat (30%) */}
                    <div className="hidden xl:flex w-[28%] flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
                        <ProModeChat />
                    </div>

                    {/* CENTER PANEL: Flight Results (45%) */}
                    <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-black relative overflow-hidden">

                        {/* Search & Filter Header (Sticky) */}
                        <div className="p-4 space-y-4 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800">
                            <ProSearchBar />

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Found {MOCK_FLIGHTS.length} flights
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium hover:bg-gray-50">
                                        <ArrowUpDown className="w-3.5 h-3.5" /> Sort: Cheapest
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium hover:bg-gray-50">
                                        <Filter className="w-3.5 h-3.5" /> Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                            {MOCK_FLIGHTS.map((flight) => (
                                <ProFlightCard
                                    key={flight.id}
                                    flight={flight}
                                    isSelected={selectedFlightId === flight.id}
                                    onSelect={() => setSelectedFlightId(flight.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Insights (25%) */}
                    <div className="hidden 2xl:flex w-[25%] flex-col gap-4 p-4 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black overflow-y-auto">
                        <div className="h-[45%]">
                            <ProPriceGraph />
                        </div>
                        <div className="h-[55%]">
                            <ProMiniMap />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProMode
