'use client'
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Activity, Itinerary } from './ChatBox'

// Fix for default markers in Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

// Custom hook to update map view when markers change
function MapUpdater({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap()
  
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates.map(coord => [coord[0], coord[1]]))
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [coordinates, map])
  
  return null
}

interface LeafletMapProps {
  coordinates: [number, number][]
  defaultCenter: [number, number]
  tripData: any
}

function LeafletMap({ coordinates, defaultCenter, tripData }: LeafletMapProps) {
  return (
    <MapContainer
      center={defaultCenter}
      zoom={coordinates.length > 0 ? 10 : 2}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      {/* Free OpenStreetMap tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater coordinates={coordinates} />
      
      {/* Add markers for activities */}
      {tripData?.itinerary?.map((day: Itinerary, dayIndex: number) =>
        day.activities?.map((activity: Activity, actIndex: number) => {
          if (!activity.geo_coordinates?.latitude || !activity.geo_coordinates?.longitude) return null
          
          return (
            <Marker
              key={`activity-${dayIndex}-${actIndex}`}
              position={[activity.geo_coordinates.latitude, activity.geo_coordinates.longitude]}
            >
              <Popup>
                <div className="max-w-sm">
                  <h3 className="font-semibold text-lg mb-2">{activity.place_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activity.place_details}</p>
                  <p className="text-sm"><strong>Address:</strong> {activity.place_address}</p>
                  <p className="text-sm"><strong>Best Time:</strong> {activity.best_time_to_visit}</p>
                  {activity.ticket_pricing && (
                    <p className="text-sm"><strong>Price:</strong> {activity.ticket_pricing}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })
      )}

      {/* Add markers for hotels */}
      {tripData?.hotels?.map((hotel: any, index: number) => {
        if (!hotel.geo_coordinates?.latitude || !hotel.geo_coordinates?.longitude) return null
        
        // Create a custom hotel icon
        const hotelIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })

        return (
          <Marker
            key={`hotel-${index}`}
            position={[hotel.geo_coordinates.latitude, hotel.geo_coordinates.longitude]}
            icon={hotelIcon}
          >
            <Popup>
              <div className="max-w-sm">
                <h3 className="font-semibold text-lg mb-2">{hotel.hotel_name}</h3>
                <p className="text-sm text-gray-600 mb-2">{hotel.description}</p>
                <p className="text-sm"><strong>Address:</strong> {hotel.hotel_address}</p>
                <p className="text-sm"><strong>Price:</strong> {hotel.price_per_night}/night</p>
                <p className="text-sm"><strong>Rating:</strong> ⭐ {hotel.rating}/5</p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default LeafletMap