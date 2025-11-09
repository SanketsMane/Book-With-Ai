'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Star, Wifi, Car, UtensilsCrossed, Dumbbell, IndianRupee } from 'lucide-react'

interface Hotel {
  name: string
  location: string
  price: number
  rating: number
  image?: string
  amenities: string[]
  description: string
}

interface HotelSearchResultsProps {
  hotels?: Hotel[]
  onBookHotel?: (hotel: Hotel) => void
}

const HotelSearchResults: React.FC<HotelSearchResultsProps> = ({ 
  hotels = [],
  onBookHotel 
}) => {
  const sampleHotels: Hotel[] = [
    {
      name: "Premium Hotel Dubai",
      location: "Dubai Marina",
      price: 12000,
      rating: 4.5,
      amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Spa"],
      description: "Luxury hotel with stunning marina views and world-class amenities."
    },
    {
      name: "Business Hotel Dubai", 
      location: "DIFC - Financial District",
      price: 8500,
      rating: 4.2,
      amenities: ["Free WiFi", "Business Center", "Gym", "Restaurant"],
      description: "Perfect for business travelers with modern facilities and great location."
    },
    {
      name: "Budget Stay Dubai",
      location: "Near Dubai Airport", 
      price: 6000,
      rating: 4.0,
      amenities: ["Free WiFi", "Airport Shuttle", "Restaurant", "AC"],
      description: "Comfortable and affordable with convenient airport access."
    }
  ]

  const displayHotels = hotels.length > 0 ? hotels : sampleHotels

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase()
    if (lower.includes('wifi')) return <Wifi className="h-4 w-4" />
    if (lower.includes('gym')) return <Dumbbell className="h-4 w-4" />
    if (lower.includes('restaurant')) return <UtensilsCrossed className="h-4 w-4" />
    if (lower.includes('parking') || lower.includes('car')) return <Car className="h-4 w-4" />
    return <span className="text-sm">✅</span>
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          🏨 Available Hotels
        </h2>
        <p className="text-muted-foreground mt-2">
          Find the perfect stay for your trip
        </p>
      </div>

      <div className="grid gap-4">
        {displayHotels.map((hotel, index) => (
          <div 
            key={index}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Hotel Image Placeholder */}
                <div className="lg:w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {hotel.name.split(' ').map(w => w[0]).join('')}
                </div>

                {/* Hotel Details */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold">{hotel.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{hotel.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{hotel.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Amenities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Book Button */}
                <div className="lg:text-right space-y-4 lg:min-w-[150px]">
                  <div className="text-center lg:text-right">
                    <div className="flex items-center justify-center lg:justify-end gap-1">
                      <IndianRupee className="h-5 w-5" />
                      <span className="text-2xl font-bold">{hotel.price.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">per night</div>
                  </div>
                  
                  <Button 
                    onClick={() => onBookHotel?.(hotel)}
                    className="w-full"
                    size="lg"
                  >
                    Book Now
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground mt-6 p-4 bg-muted/20 rounded-lg">
        💡 <strong>Booking Tips:</strong> Prices include taxes. Free cancellation available. 
        Best rate guarantee!
      </div>
    </div>
  )
}

export default HotelSearchResults