"use client"
import React, { useState } from 'react'
import { Plane, ChevronDown, Clock, MoveRight, Wifi, Utensils, Luggage, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface Flight {
    id: string
    airline: string
    flightNumber: string
    departure: { time: string, city: string, code: string }
    arrival: { time: string, city: string, code: string }
    duration: string
    stops: number
    price: number
    emissions: number
}

interface ProFlightCardProps {
    flight: Flight
    isSelected?: boolean
    onSelect?: () => void
}

export default function ProFlightCard({ flight, isSelected, onSelect }: ProFlightCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <motion.div
            layout
            className={cn(
                "bg-white dark:bg-gray-900 rounded-xl border transition-all duration-200 overflow-hidden group",
                isSelected
                    ? "border-blue-500 shadow-md ring-1 ring-blue-500/20"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 hover:shadow-sm"
            )}
        >
            {/* Main Card Content */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 cursor-pointer"
            >
                <div className="flex items-center justify-between gap-4">
                    {/* Airline Logo Placeholder */}
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                        <Plane className="w-5 h-5 text-gray-500" />
                    </div>

                    {/* Flight Route & Times */}
                    <div className="flex-1 min-w-0 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                        <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white leading-none">{flight.departure.time}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">{flight.departure.code}</div>
                        </div>

                        <div className="flex flex-col items-center w-24">
                            <div className="text-[10px] text-gray-400 font-medium mb-1">{flight.duration}</div>
                            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center">
                                <div className="absolute w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 left-0" />
                                <Plane className="w-3 h-3 text-gray-300 dark:text-gray-600 rotate-90" />
                                <div className="absolute w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 right-0" />
                            </div>
                            <div className="text-[10px] text-green-600 font-medium mt-1">
                                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                            </div>
                        </div>

                        <div className="text-left">
                            <div className="font-bold text-gray-900 dark:text-white leading-none">{flight.arrival.time}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">{flight.arrival.code}</div>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right flex flex-col items-end gap-2 pl-4 border-l border-gray-100 dark:border-gray-800">
                        <div className="font-bold text-lg text-gray-900 dark:text-white">
                            ${flight.price}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onSelect?.()
                            }}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200",
                                isSelected
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                            )}
                        >
                            {isSelected ? 'Selected' : 'Select'}
                        </button>
                    </div>

                    <div className="pl-2">
                        <ChevronDown className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200",
                            isExpanded && "rotate-180"
                        )} />
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Plane className="w-3.5 h-3.5" /> Aircraft
                                </span>
                                <div className="text-sm font-medium">Boeing 787-9</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Leaf className="w-3.5 h-3.5 text-green-500" /> Emissions
                                </span>
                                <div className="text-sm font-medium">{flight.emissions} kg CO2</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Wifi className="w-3.5 h-3.5" /> Wi-Fi
                                </span>
                                <div className="text-sm font-medium text-green-600">Available</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Luggage className="w-3.5 h-3.5" /> Allowances
                                </span>
                                <div className="text-sm font-medium">23kg Check-in</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
