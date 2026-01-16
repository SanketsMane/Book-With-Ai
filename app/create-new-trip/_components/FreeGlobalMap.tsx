'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Activity, Itinerary } from './ChatBox'
import { useTripDetail } from '@/app/provider'

// Loading component for when map is being loaded
const MapLoading = () => (
  <div className="w-[95%] h-[85vh] rounded-[20px] border flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p>Loading Map...</p>
    </div>
  </div>
)

// Dynamic import for the actual map component to prevent SSR issues
const DynamicMapComponent = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <MapLoading />
})

function FreeGlobalMap() {
  //@ts-ignore
  const { tripDetailInfo } = useTripDetail()
  const [coordinates, setCoordinates] = useState<[number, number][]>([])
  const [defaultCenter, setDefaultCenter] = useState<[number, number]>([20, 0])
  const [mapKey, setMapKey] = useState(0)

  // Extract coordinates from trip data
  useEffect(() => {
    if (tripDetailInfo?.itinerary) {
      const coords: [number, number][] = []

      tripDetailInfo.itinerary.forEach((day: Itinerary) => {
        day.activities?.forEach((activity: Activity) => {
          if (activity.geo_coordinates?.latitude && activity.geo_coordinates?.longitude) {
            coords.push([activity.geo_coordinates.latitude, activity.geo_coordinates.longitude])
          }
        })
      })

      // Add hotel coordinates if available
      if (tripDetailInfo.hotels) {
        tripDetailInfo.hotels.forEach((hotel: any) => {
          if (hotel.geo_coordinates?.latitude && hotel.geo_coordinates?.longitude) {
            coords.push([hotel.geo_coordinates.latitude, hotel.geo_coordinates.longitude])
          }
        })
      }

      setCoordinates(coords)

      // Set center to first coordinate if available
      if (coords.length > 0) {
        setDefaultCenter(coords[0])
      }
    }
  }, [tripDetailInfo])

  return (
    <div className="w-[95%] h-[85vh] rounded-[20px] overflow-hidden border">
      <DynamicMapComponent
        coordinates={coordinates}
        defaultCenter={defaultCenter}
        tripData={tripDetailInfo}
      />
    </div>
  )
}

export default FreeGlobalMap