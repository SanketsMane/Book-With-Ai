"use client"
import React, { useState } from 'react'
import { Users, Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface ProTravelersSelectorProps {
    isOpen: boolean
    onClose: () => void
}

export default function ProTravelersSelector({ isOpen, onClose }: ProTravelersSelectorProps) {
    const [travelers, setTravelers] = useState({
        adults: 1,
        children: 0,
        infants: 0
    })

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-transparent"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 p-4"
                    >
                        <div className="space-y-4">
                            {/* Adults */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-sm">Adults</div>
                                    <div className="text-xs text-muted-foreground">Age 12+</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setTravelers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                                        className={cn("p-1.5 rounded-lg border", travelers.adults <= 1 ? "opacity-50" : "hover:bg-gray-50")}
                                        disabled={travelers.adults <= 1}
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-4 text-center text-sm font-medium">{travelers.adults}</span>
                                    <button
                                        onClick={() => setTravelers(p => ({ ...p, adults: Math.min(9, p.adults + 1) }))}
                                        className="p-1.5 rounded-lg border hover:bg-gray-50"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-sm">Children</div>
                                    <div className="text-xs text-muted-foreground">Age 2-12</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setTravelers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                                        className={cn("p-1.5 rounded-lg border", travelers.children <= 0 ? "opacity-50" : "hover:bg-gray-50")}
                                        disabled={travelers.children <= 0}
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-4 text-center text-sm font-medium">{travelers.children}</span>
                                    <button
                                        onClick={() => setTravelers(p => ({ ...p, children: Math.min(9, p.children + 1) }))}
                                        className="p-1.5 rounded-lg border hover:bg-gray-50"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 border rounded-lg text-center text-sm font-medium cursor-pointer hover:bg-gray-50 active:bg-blue-50 active:border-blue-500 transition-colors">
                                    Economy
                                </div>
                                <div className="p-2 border rounded-lg text-center text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors">
                                    Business
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
