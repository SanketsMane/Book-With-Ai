"use client"
import React from 'react'
import AppSidebar from '../_components/AppSidebar'
import { Award } from 'lucide-react'

function LoyaltyProgram() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen p-8 md:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loyalty & Miles</h1>
                            <p className="text-gray-500 dark:text-gray-400">Manage your frequent flyer programs and maximise rewards.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none grayscale">
                        {/* Mock Content */}
                        <div className="h-40 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"></div>
                        <div className="h-40 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"></div>
                        <div className="h-40 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoyaltyProgram
