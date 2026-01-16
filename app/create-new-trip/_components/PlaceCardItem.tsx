"use client"
import { Button } from '@/components/ui/button'
import { Clock, ExternalLink, Ticket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Activity } from './ChatBox'
import axios from 'axios'

type Props = {
    activity: Activity
}

function PlaceCardItem({ activity }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>();
    useEffect(() => {
        activity && GetGooglePlaceDetail();
    }, [activity])

    const GetGooglePlaceDetail = async () => {
        const result = await axios.post('/api/google-place-detail', {
            placeName: activity?.place_name + ":" + activity?.place_address
        });
        if (result?.data?.e) {
            return;
        }
        setPhotoUrl(result?.data);
    }
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative w-full h-48">
                <Image
                    src={photoUrl ? photoUrl : '/placeholder.jpg'}
                    alt={activity.place_name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col gap-2">
                {/* Title */}
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {activity?.place_name}
                </h2>

                {/* Details */}
                <p className="text-gray-500 text-sm line-clamp-2">
                    {activity?.place_details}
                </p>

                {/* Pricing */}
                {activity?.ticket_pricing && (
                    <div className="flex items-center gap-2 text-blue-600 text-sm">
                        <Ticket className="w-4 h-4" />
                        <span>{activity?.ticket_pricing}</span>
                    </div>
                )}

                {/* Best Time */}
                {activity?.best_time_to_visit && (
                    <div className="flex items-center gap-2 text-orange-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{activity?.best_time_to_visit}</span>
                    </div>
                )}

                {/* View Button */}
                <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${activity?.place_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block"
                >
                    <Button
                        size="sm"
                        className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-0 font-medium rounded-xl h-9 shadow-none transition-colors"
                    >
                        View on Map <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default PlaceCardItem
