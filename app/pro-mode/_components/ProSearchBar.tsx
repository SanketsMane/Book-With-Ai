"use client"
import React, { useState } from 'react'
import { PlaneTakeoff, PlaneLanding, ArrowRightLeft, Calendar as CalendarIcon, User, Plus, Trash2, Check, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import ProDatePicker from './ProDatePicker'
import ProTravelersSelector from './ProTravelersSelector'

export default function ProSearchBar() {
    const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip')
    const [isTripTypeOpen, setIsTripTypeOpen] = useState(false)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [isTravelersOpen, setIsTravelersOpen] = useState(false)

    // Form State
    const [from, setFrom] = useState('New Delhi (DEL)')
    const [to, setTo] = useState('Dubai (DXB)')
    const [dates, setDates] = useState({ start: new Date(), end: undefined as Date | undefined })
    const [legs, setLegs] = useState([
        { id: 1, from: 'London (LHR)', to: 'Paris (CDG)', date: new Date() },
        { id: 2, from: 'Paris (CDG)', to: 'Berlin (BER)', date: new Date() }
    ])

    const handleSwap = () => {
        setFrom(to)
        setTo(from)
    }

    const addLeg = () => {
        if (legs.length >= 6) return
        const lastLeg = legs[legs.length - 1]
        setLegs([...legs, {
            id: Date.now(),
            from: lastLeg.to,
            to: '',
            date: new Date()
        }])
    }

    const removeLeg = (id: number) => {
        if (legs.length <= 2) return
        setLegs(legs.filter(l => l.id !== id))
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-2 relative z-20">
            <div className="flex flex-col lg:flex-row gap-2">
                {/* 1. Trip Type & Swap Group */}
                <div className="flex items-center gap-2 flex-1">
                    {/* Trip Type Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsTripTypeOpen(!isTripTypeOpen)}
                            className="flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                            {tripType === 'round-trip' && 'Round trip'}
                            {tripType === 'one-way' && 'One-way'}
                            {tripType === 'multi-city' && 'Multi-city'}
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        <AnimatePresence>
                            {isTripTypeOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsTripTypeOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden py-1"
                                    >
                                        {['round-trip', 'one-way', 'multi-city'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    setTripType(type as any)
                                                    setIsTripTypeOpen(false)
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between group"
                                            >
                                                <span className="capitalize">{type.replace('-', ' ')}</span>
                                                {tripType === type && <Check className="w-4 h-4 text-blue-500" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-px h-8 bg-gray-100 dark:bg-gray-800 mx-1" />

                    {/* From Input */}
                    <div className="flex-1 relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <PlaneTakeoff className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 text-sm font-medium"
                        />
                    </div>

                    {/* Swap Button */}
                    <button
                        onClick={handleSwap}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm z-10 -ml-3 -mr-3"
                    >
                        <ArrowRightLeft className="w-4 h-4" />
                    </button>

                    {/* To Input */}
                    <div className="flex-1 relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <PlaneLanding className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 text-sm font-medium"
                        />
                    </div>
                </div>

                {/* 2. Date & Travelers Group */}
                <div className="flex items-center gap-2">
                    <div className="w-px h-8 bg-gray-100 dark:bg-gray-800 lg:mx-1 hidden lg:block" />

                    {/* Date Picker Trigger */}
                    <button
                        onClick={() => setIsDatePickerOpen(true)}
                        className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 rounded-xl text-left min-w-[140px] group transition-colors"
                    >
                        <CalendarIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <div className="flex flex-col leading-none">
                            <span className="text-xs text-gray-500 font-medium">Departure</span>
                            <span className="text-sm font-semibold truncate">{dates.start.toLocaleDateString()}</span>
                        </div>
                    </button>

                    {/* Travelers Trigger */}
                    <div className="relative">
                        <button
                            onClick={() => setIsTravelersOpen(!isTravelersOpen)}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 rounded-xl text-left transition-colors"
                        >
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-semibold whitespace-nowrap">1 Adult</span>
                        </button>
                        <ProTravelersSelector
                            isOpen={isTravelersOpen}
                            onClose={() => setIsTravelersOpen(false)}
                        />
                    </div>
                </div>
            </div>

            {/* Multi-City Builder */}
            <AnimatePresence>
                {tripType === 'multi-city' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-3 px-1">
                            {legs.map((leg, index) => (
                                <motion.div
                                    layout
                                    key={leg.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex flex-col md:flex-row gap-3 items-center bg-gray-50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800"
                                >
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-bold text-gray-500">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                                        <input
                                            value={leg.from}
                                            onChange={(e) => {
                                                const newLegs = [...legs]
                                                newLegs[index].from = e.target.value
                                                setLegs(newLegs)
                                            }}
                                            placeholder="From"
                                            className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-900 border border-transparent focus:border-blue-500 outline-none"
                                        />
                                        <input
                                            value={leg.to}
                                            onChange={(e) => {
                                                const newLegs = [...legs]
                                                newLegs[index].to = e.target.value
                                                setLegs(newLegs)
                                            }}
                                            placeholder="To"
                                            className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-900 border border-transparent focus:border-blue-500 outline-none"
                                        />
                                        <button className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-900 border border-transparent hover:border-blue-500 text-left">
                                            {leg.date.toLocaleDateString()}
                                        </button>
                                    </div>

                                    {legs.length > 2 && (
                                        <button
                                            onClick={() => removeLeg(leg.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </motion.div>
                            ))}

                            {legs.length < 6 && (
                                <button
                                    onClick={addLeg}
                                    className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium text-sm"
                                >
                                    <Plus className="w-4 h-4" /> Add another flight
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProDatePicker
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onSelect={(start, end) => {
                    setDates({ start, end })
                    setIsDatePickerOpen(false)
                }}
                mode={tripType === 'one-way' ? 'one-way' : 'round-trip'}
                startDate={dates.start}
                endDate={dates.end}
            />
        </div>
    )
}
