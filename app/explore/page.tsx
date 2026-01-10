"use client"
import React, { useState } from 'react'
import ChatBox from '../create-new-trip/_components/ChatBox'
import SmartMap from '../create-new-trip/_components/SmartMap'
import { Plane, Map as MapIcon, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip"
import dynamic from 'next/dynamic'

// Dynamically import ChatBox to avoid hydration issues if any
const DynamicChatBox = dynamic(() => import('../create-new-trip/_components/ChatBox'), { ssr: false })

function Explore() {
    const [activeIndex, setActiveIndex] = useState(0); // 0 = Chat, 1 = Map (for mobile toggle)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Mobile-first layout */}
            <div className='flex flex-col lg:flex-row h-[calc(100vh-64px)]'> {/* Adjust height for navbar */}

                {/* Chat Section */}
                <div className={`lg:w-96 xl:w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
                    ${activeIndex === 0 ? 'flex' : 'hidden lg:flex'} h-full`}>

                    {/* Header */}
                    <div className='bg-gradient-to-r from-sky-500 to-blue-600 p-4 text-white shrink-0'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
                                <Plane className='h-5 w-5' />
                            </div>
                            <div>
                                <h1 className='font-semibold text-lg'>Flight Assistant</h1>
                                <p className='text-sm text-sky-100'>Find the best flight deals</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className='flex-1 overflow-hidden relative'>
                        <DynamicChatBox />
                    </div>
                </div>

                {/* Map/Content Section */}
                <div className={`flex-1 relative bg-gray-50 dark:bg-gray-900 
                    ${activeIndex === 1 ? 'flex' : 'hidden lg:flex'} h-full`}>
                    <div className='absolute inset-0'>
                        <SmartMap />

                        {/* Overlay for "Live Flights" simulation */}
                        <div className="absolute top-4 left-4 right-4 z-[400] pointer-events-none">
                            <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 inline-block">
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Live Flight Radar
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Toggle Button */}
                <div className="lg:hidden fixed bottom-20 right-4 z-50">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={'lg'}
                                    className='w-14 h-14 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-xl border-0'
                                    onClick={() => setActiveIndex(activeIndex === 0 ? 1 : 0)}
                                >
                                    {activeIndex === 0 ? <MapIcon className='h-6 w-6' /> : <Plane className='h-6 w-6' />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                {activeIndex === 0 ? 'Show Map' : 'Show Chat'}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}

export default Explore
