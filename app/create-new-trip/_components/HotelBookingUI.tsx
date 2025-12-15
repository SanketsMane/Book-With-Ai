'use client';

import React, { useState } from 'react';
import { MapPin, Star, DollarSign, Phone, ExternalLink } from 'lucide-react';

interface Hotel {
  name: string;
  address: string;
  price: string;
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  amenities: string[];
  reviews?: number;
  phone?: string;
  link?: string;
}

interface HotelBookingUIProps {
  hotels: Hotel[];
  location: string;
}

export default function HotelBookingUI({ hotels, location }: HotelBookingUIProps) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!hotels || hotels.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">No hotels found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  // Show only first 3 hotels initially in chat view
  const displayedHotels = showAll ? hotels : hotels.slice(0, 3);

  return (
    <>
      <div className="w-full max-w-4xl mt-3">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800">
            Hotels in {location}
          </h3>
          <p className="text-sm text-gray-600">Found {hotels.length} hotels matching your budget</p>
        </div>

        <div className="space-y-3">
          {displayedHotels.map((hotel, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer border border-gray-200"
            onClick={() => setSelectedHotel(hotel)}
          >
            <div className="flex gap-3 p-3">
              {/* Hotel Image - Compact */}
              <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={hotel.image || '/placeholder-hotel.jpg'}
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
                  }}
                />
                <div className="absolute top-1 right-1 bg-white px-2 py-0.5 rounded-full shadow-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-xs">{hotel.rating}</span>
                  </div>
                </div>
              </div>

              {/* Hotel Details - Compact */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-800 mb-1 line-clamp-1">
                  {hotel.name}
                </h4>

                <div className="flex items-start gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 line-clamp-1">{hotel.address}</p>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">{hotel.price}</span>
                  <span className="text-xs text-gray-500">per night</span>
                </div>

                {/* Amenities - Compact */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        +{hotel.amenities.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Button - Compact */}
                <button
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-md transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${hotel.coordinates.latitude},${hotel.coordinates.longitude}`,
                      '_blank'
                    );
                  }}
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* Show More/Less Button */}
        {hotels.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-3 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 text-sm"
          >
            {showAll ? `Show Less` : `Show All ${hotels.length} Hotels`}
          </button>
        )}
      </div>

      {/* Hotel Detail Modal */}
      {selectedHotel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedHotel(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative h-64">
              <img
                src={selectedHotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                alt={selectedHotel.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
                }}
              />
              <button
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedHotel.name}</h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{selectedHotel.rating}</span>
                    {selectedHotel.reviews && (
                      <span className="text-gray-500">({selectedHotel.reviews.toLocaleString()} reviews)</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">{selectedHotel.price}</p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <p className="text-gray-700">{selectedHotel.address}</p>
                </div>

                {selectedHotel.phone && (
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${selectedHotel.phone}`} className="text-blue-600 hover:underline">
                      {selectedHotel.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* All Amenities */}
              {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${selectedHotel.coordinates.latitude},${selectedHotel.coordinates.longitude}`,
                      '_blank'
                    );
                  }}
                >
                  View on Map
                </button>
                {selectedHotel.link && (
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      window.open(selectedHotel.link, '_blank');
                    }}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
