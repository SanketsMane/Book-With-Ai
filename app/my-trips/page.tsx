"use client"
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useUserDetail } from '../provider';
import { TripInfo } from '../create-new-trip/_components/ChatBox';
import { ArrowBigRightIcon } from 'lucide-react';
import Image from 'next/image';
import MyTripListItem from './_components/MyTripListItem';

export type Trip = {
    tripId: any,
    tripDetail: TripInfo,
    _id: string
}

function MyTrips() {

    const [myTrips, setMyTrips] = useState<Trip[]>([]);
    const { userDetail, setUserDetail } = useUserDetail();
    const convex = useConvex();

    useEffect(() => {
        userDetail && GetUserTrip();
    }, [userDetail])

    const GetUserTrip = async () => {
        const result = await convex.query(api.tripDetail.GetUserTrips, {
            uid: userDetail?._id
        });
        setMyTrips(result);
        console.log(result);
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen'>
            <div className="flex items-center gap-2 mb-8">
                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                <h2 className='font-bold text-3xl text-foreground tracking-tight'>My Trips</h2>
            </div>

            {myTrips?.length == 0 ? (
                <div className='p-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-6 mt-6 bg-gray-50/50 dark:bg-card/50'>
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <ArrowBigRightIcon className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-50" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">No trips planned yet</h2>
                        <p className="text-muted-foreground">Start a new chat to plan your first adventure!</p>
                    </div>
                    <Link href={'/create-new-trip'}>
                        <Button className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 h-10">Create New Trip</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-10 mt-6">
                    {/* Upcoming Trips Section */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Upcoming Trips</h3>
                        <div className='flex flex-col gap-6'>
                            {myTrips?.map((trip, index) => (
                                <MyTripListItem trip={trip} key={index} />
                            ))}
                        </div>
                    </div>

                    {/* Past Trips Section - Mock Empty for structure */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 opacity-50">Past Trips</h3>
                        <p className="text-sm text-gray-400 italic">No past trips to show.</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyTrips