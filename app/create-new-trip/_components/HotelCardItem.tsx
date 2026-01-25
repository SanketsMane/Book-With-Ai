"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Hotel } from './ChatBox'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, Wallet } from 'lucide-react'
import axios from 'axios'

type Props = {
    hotel: Hotel
}

function HotelCardItem({ hotel }: Props) {

    const [photoUrl, setPhotoUrl] = useState<string>();
    useEffect(() => {
        hotel && GetGooglePlaceDetail();
    }, [hotel])

    const GetGooglePlaceDetail = async () => {
        const result = await axios.post('/api/google-place-detail', {
            placeName: hotel?.hotel_name
        });
        if (result?.data?.e) {
            return;
        }
        setPhotoUrl(result?.data);
    }

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Image Section */}
            <div className="relative w-full h-48">
                <Image
                    src={photoUrl ? photoUrl : '/placeholder.jpg'}
                    alt={hotel?.hotel_name || 'Hotel Image'}
                    fill
                    className="object-cover"
                    unoptimized={true}
                />
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col gap-2">
                {/* Hotel Name */}
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {hotel?.hotel_name}
                </h2>

                {/* Address */}
                <p className="text-gray-500 text-sm line-clamp-2">
                    {hotel?.hotel_address}
                </p>

                {/* Price & Rating */}
                <div className="flex justify-between items-center mt-1">
                    <p className="flex items-center gap-1 text-green-600 font-medium text-sm">
                        <Wallet className="w-4 h-4" /> {hotel?.price_per_night}
                    </p>
                    <p className="flex items-center gap-1 text-yellow-500 font-medium text-sm">
                        <Star className="w-4 h-4" /> {hotel?.rating}
                    </p>
                </div>

                {/* View on Map Button */}
                <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotel_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-0 font-medium rounded-xl h-10 shadow-none transition-colors"
                    >
                        View on Map
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default HotelCardItem
