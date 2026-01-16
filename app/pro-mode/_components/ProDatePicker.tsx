"use client"
import React from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface ProDatePickerProps {
    isOpen: boolean
    onClose: () => void
    startDate?: Date
    endDate?: Date
    onSelect: (start: Date, end?: Date) => void
    mode: 'round-trip' | 'one-way'
}

export default function ProDatePicker({ isOpen, onClose, startDate, endDate, onSelect, mode }: ProDatePickerProps) {
    // Simple mock implementation of a dual-calendar picker
    // In a real app, use a library like 'date-fns' and 'react-day-picker'

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-full mt-2 left-0 right-0 mx-auto w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg">Select Dates</h3>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-4 h-4" /></button>
                                <span className="font-medium text-sm">January 2026</span>
                                <span className="text-gray-300 mx-2">|</span>
                                <span className="font-medium text-sm">February 2026</span>
                                <button className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Placeholder for calendar grid - visuals only for this demo */}
                        <div className="grid grid-cols-2 gap-8 h-64 border-b border-gray-100 dark:border-gray-800 mb-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                Calendar 1 (Current Month)
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                Calendar 2 (Next Month)
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
