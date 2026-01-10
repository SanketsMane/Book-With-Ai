"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { Bookmark } from 'lucide-react'

function SavedFlights() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-8 md:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Bookmark className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Flights</h1>
                            <p className="text-gray-500 dark:text-gray-400">Your bookmarked flight options.</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 h-64 flex items-center justify-center">
                        <span className="text-muted-foreground">Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SavedFlights
