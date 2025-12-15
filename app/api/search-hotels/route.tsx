import { NextRequest, NextResponse } from "next/server";
import { searchPlacesWithSerpAPI } from "@/utils/serpapi";

export async function POST(req: NextRequest) {
  try {
    const { location, budget, checkIn, checkOut } = await req.json();

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    // Search for hotels using SerpAPI
    const searchQuery = `hotels in ${location}`;
    console.log('🔍 Searching hotels:', searchQuery);
    const hotelsData = await searchPlacesWithSerpAPI(searchQuery);
    console.log('📦 SerpAPI returned:', hotelsData.length, 'results');

    if (hotelsData.length > 0) {
      console.log('📝 Sample hotel data:', JSON.stringify(hotelsData[0], null, 2));
    }

    // Filter and format hotels based on budget
    const budgetRanges: Record<string, { min: number; max: number }> = {
      low: { min: 0, max: 3000 },
      medium: { min: 3000, max: 8000 },
      high: { min: 8000, max: 50000 },
      luxury: { min: 50000, max: 1000000 }
    };

    const budgetRange = budgetRanges[budget?.toLowerCase()] || budgetRanges.medium;

    // Format hotel results with proper data extraction
    const hotels = hotelsData
      .map((hotel: any) => {
        console.log('🏨 Processing hotel:', hotel.title);
        
        // Extract price
        let pricePerNight = 0;
        if (hotel.price) {
          const priceMatch = hotel.price.match(/[\d,]+/);
          if (priceMatch) {
            pricePerNight = parseInt(priceMatch[0].replace(/,/g, ''));
          }
        }
        
        // If no price, estimate based on rating
        if (pricePerNight === 0 && hotel.rating) {
          const basePrice = budgetRange.min + ((budgetRange.max - budgetRange.min) / 2);
          pricePerNight = Math.floor(basePrice * (hotel.rating / 4.5));
        }

        // Get amenities from extensions or service_options
        const amenities: string[] = [];
        if (hotel.extensions) {
          // Extensions is an array of objects, extract values properly
          hotel.extensions.forEach((ext: any) => {
            if (typeof ext === 'string') {
              amenities.push(ext);
            } else if (typeof ext === 'object') {
              // Extract values from object (e.g., {crowd: ["LGBTQ+ friendly"]})
              Object.values(ext).forEach((val: any) => {
                if (Array.isArray(val)) {
                  amenities.push(...val.filter((v: any) => typeof v === 'string'));
                } else if (typeof val === 'string') {
                  amenities.push(val);
                }
              });
            }
          });
        }
        if (hotel.service_options) {
          Object.keys(hotel.service_options).forEach(key => {
            if (hotel.service_options[key]) {
              amenities.push(key.replace(/_/g, ' '));
            }
          });
        }

        return {
          name: hotel.title || 'Hotel',
          address: hotel.address || `${location}, India`,
          price: pricePerNight > 0 ? `₹${pricePerNight.toLocaleString()}` : `₹${Math.floor(budgetRange.min + (budgetRange.max - budgetRange.min) / 2).toLocaleString()}`,
          image: hotel.thumbnail || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`,
          coordinates: {
            latitude: hotel.gps_coordinates?.latitude || 0,
            longitude: hotel.gps_coordinates?.longitude || 0
          },
          rating: hotel.rating || 4.0,
          amenities: amenities.slice(0, 5).length > 0 ? amenities.slice(0, 5) : ['WiFi', 'Parking', 'Restaurant'],
          reviews: hotel.reviews || 0,
          phone: hotel.phone || '',
          link: hotel.link || '#',
          description: hotel.description || hotel.snippet || `A hotel in ${location}`
        };
      })
      .filter((hotel: any) => {
        // Basic filtering for hotel-related results
        const title = hotel.name.toLowerCase();
        return title.includes('hotel') || 
               title.includes('resort') || 
               title.includes('inn') ||
               title.includes('lodge') ||
               hotel.rating > 0;
      })
      .slice(0, 12); // Return top 12 results

    console.log('✅ Formatted hotels:', hotels.length);

    // If no hotels found, return generated hotels with proper data
    if (hotels.length === 0) {
      console.log('⚠️ No real hotels found, generating defaults');
      return NextResponse.json({
        location,
        budget,
        hotels: generateDefaultHotels(location, budget, budgetRange),
        message: "Showing recommended hotels"
      });
    }

    return NextResponse.json({
      location,
      budget,
      hotels,
      count: hotels.length
    });

  } catch (error) {
    console.error('Hotel search error:', error);
    return NextResponse.json(
      { 
        error: "Failed to search hotels",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Generate default hotels when API fails or no results
function generateDefaultHotels(location: string, budget: string, budgetRange: { min: number; max: number }) {
  const avgPrice = Math.floor((budgetRange.min + budgetRange.max) / 2);
  
  const hotelsList = [
    { 
      name: `The Grand ${location} Hotel`, 
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Parking']
    },
    { 
      name: `${location} Luxury Resort`, 
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Bar', 'Gym']
    },
    { 
      name: `Comfort Inn ${location}`, 
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
      amenities: ['WiFi', 'Breakfast', 'Parking', '24/7 Service']
    },
    { 
      name: `${location} Business Lodge`, 
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      amenities: ['WiFi', 'Meeting Rooms', 'Restaurant', 'Parking']
    },
    { 
      name: `Boutique Stay ${location}`, 
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
      amenities: ['WiFi', 'Rooftop', 'Restaurant', 'Concierge', 'Spa']
    }
  ];

  return hotelsList.map((hotel, index) => ({
    name: hotel.name,
    address: `${location}, India`,
    price: `₹${(avgPrice + (index * 500)).toLocaleString()}`,
    image: hotel.image,
    coordinates: { latitude: 0, longitude: 0 },
    rating: hotel.rating,
    description: `Experience comfort and luxury at ${hotel.name}`,
    amenities: hotel.amenities,
    link: '#',
    reviews: Math.floor(Math.random() * 500) + 100
  }));
}
