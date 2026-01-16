"use client"
import React, { useEffect, useState, Suspense } from 'react'
import ChatBox from './_components/ChatBox'
import Itinerary from './_components/Itinerary'
import { useTripDetail } from '../provider';
import SmartMap from './_components/SmartMap';
import { Button } from '@/components/ui/button';
import { Globe, Globe2, Plane } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
function CreateNewTrip() {

    // @ts-ignore
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
    const [activeIndex, setActiveIndex] = useState(1);
    useEffect(() => {
        setTripDetailInfo(null)
    }, [])
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Mobile-first layout */}
            <div className='flex flex-col lg:flex-row h-screen'>
                {/* Chat Section */}
                <div className='lg:w-96 xl:w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col relative z-20 shadow-xl'>
                    <div className='p-6 pt-8'>
                        <div className='flex items-center gap-3 mb-1'>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <Globe2 className="w-5 h-5" />
                            </div>
                            <h1 className='font-bold text-2xl text-foreground tracking-tight'>Travel Agent</h1>
                        </div>
                        <p className='text-muted-foreground text-sm pl-1'>Chat with AI to find hotels, flights & plans.</p>
                    </div>


                    <div className='flex-1 overflow-hidden flex flex-col'>
                        <Suspense fallback={<div className="p-4">Loading chat...</div>}>
                            <ChatBox />
                        </Suspense>
                    </div>
                </div>

                {/* Content Section */}
                <div className='flex-1 relative bg-gray-50 dark:bg-gray-900'>
                    <div className='absolute inset-0'>
                        {activeIndex == 0 ? < Itinerary /> : <SmartMap />}
                    </div>

                    {/* Toggle Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size={'lg'}
                                className='absolute bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 z-10'
                                onClick={() => setActiveIndex(activeIndex == 0 ? 1 : 0)}
                            >
                                {activeIndex == 0 ? <Plane className='h-6 w-6' /> : <Globe2 className='h-6 w-6' />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            {activeIndex == 0 ? 'Show Map' : 'Show Itinerary'}
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default CreateNewTrip