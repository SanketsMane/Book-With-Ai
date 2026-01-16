"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter, MapIcon, Search } from 'lucide-react'
import React from 'react'

function Explore() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Header Section */}
            <div className='max-w-7xl mx-auto px-6 py-10 space-y-8'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Explore Destinations</h1>
                    <p className='text-gray-500 dark:text-gray-400 mt-1'>Discover amazing places and find the best flight deals</p>
                </div>

                {/* Search Bar */}
                <div className='flex gap-4'>
                    <div className='flex-1 relative'>
                        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                        <Input
                            placeholder='Search destinations...'
                            className='w-full h-12 pl-12 rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow'
                        />
                    </div>
                    <Button variant="outline" className='h-12 px-6 rounded-xl border-gray-200 dark:border-gray-800 gap-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800'>
                        <Filter className='w-4 h-4' />
                        Filters
                    </Button>
                </div>

                {/* Map Container */}
                <div className='w-full h-[600px] bg-white dark:bg-card border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden group'>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>

                    <div className='relative z-10 flex flex-col items-center gap-4 text-center p-6'>
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                            <MapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>Interactive Map View</h3>
                            <p className='text-gray-500 dark:text-gray-400 max-w-md mx-auto'>
                                Explore destinations on an interactive world map with live pricing
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Explore
