"use client"
import React, { useEffect, useState } from 'react'
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
                <div className='lg:w-96 xl:w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col'>
                    <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
                                <Globe2 className='h-5 w-5' />
                            </div>
                            <div>
                                <h1 className='font-semibold text-lg'>Travel Assistant</h1>
                                <p className='text-sm text-blue-100'>Plan your perfect trip</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <ChatBox />
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
                                className='absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 z-10'
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