'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Plane, Clock, IndianRupee, Calendar } from 'lucide-react'

interface Flight {
  airline: string
  from: string
  to: string
  price: number
  duration: string
  departure: string
  arrival: string
  stops: number
  baggage: string
}

interface FlightSearchResultsProps {
  flights?: Flight[]
  onBookFlight?: (flight: Flight) => void
}

const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({ 
  flights = [],
  onBookFlight 
}) => {
  const sampleFlights: Flight[] = [
    {
      airline: "Emirates",
      from: "PNQ",
      to: "DXB", 
      price: 45000,
      duration: "4h 30m",
      departure: "14:30",
      arrival: "17:00",
      stops: 0,
      baggage: "30kg"
    },
    {
      airline: "IndiGo",
      from: "PNQ", 
      to: "DXB",
      price: 38000,
      duration: "7h 15m", 
      departure: "10:15",
      arrival: "19:30",
      stops: 1,
      baggage: "20kg"
    },
    {
      airline: "Air India",
      from: "PNQ",
      to: "DXB",
      price: 42000,
      duration: "4h 45m",
      departure: "21:20", 
      arrival: "01:05+1",
      stops: 0,
      baggage: "25kg"
    }
  ]

  const displayFlights = flights.length > 0 ? flights : sampleFlights

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Plane className="h-6 w-6" />
          Available Flights
        </h2>
        <p className="text-muted-foreground mt-2">
          Choose the best flight for your journey
        </p>
      </div>

      <div className="grid gap-4">
        {displayFlights.map((flight, index) => (
          <div 
            key={index}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Flight Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{flight.airline}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-lg font-mono font-semibold">{flight.departure}</div>
                    <div className="text-sm text-muted-foreground">{flight.from}</div>
                  </div>
                  
                  <div className="flex flex-col items-center px-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{flight.duration}</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-mono font-semibold">{flight.arrival}</div>
                    <div className="text-sm text-muted-foreground">{flight.to}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    📋 {flight.baggage} baggage
                  </span>
                  <span>✅ Meals included</span>
                </div>
              </div>

              {/* Price & Book Button */}
              <div className="lg:text-right space-y-3">
                <div className="text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-end gap-1">
                    <IndianRupee className="h-5 w-5" />
                    <span className="text-2xl font-bold">{flight.price.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
                
                <Button 
                  onClick={() => onBookFlight?.(flight)}
                  className="w-full lg:w-auto min-w-[120px]"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground mt-6 p-4 bg-muted/20 rounded-lg">
        💡 <strong>Pro Tip:</strong> Prices may vary based on dates and availability. 
        Book early for better deals!
      </div>
    </div>
  )
}

export default FlightSearchResults