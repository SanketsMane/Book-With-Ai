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
        <div className='min-h-screen bg-gradient-to-br from-background to-muted/20'>
            <div className='grid grid-cols-1 md:grid-cols-5 gap-5 p-10'>
                <div className='col-span-2'>
                    <ChatBox />
                </div>
                <div className='col-span-3 relative'>
                    {activeIndex == 0 ? < Itinerary /> : <SmartMap />}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size={'lg'} 
                                className='absolute bg-primary hover:bg-primary/90 bottom-10 left-[50%] rounded-2xl shadow-lg border border-border'
                                onClick={() => setActiveIndex(activeIndex == 0 ? 1 : 0)}
                            >
                                {activeIndex == 0 ? <Plane /> : <Globe2 />} 
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Switch Between Map and Trip
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default CreateNewTrip