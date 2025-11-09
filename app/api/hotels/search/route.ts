import { NextRequest, NextResponse } from 'next/server';

// Real-time hotel search API
export async function POST(request: NextRequest) {
  try {
    const { city, checkIn, checkOut, guests = 1, budget } = await request.json();
    
    // Validate input
    if (!city || !checkIn || !checkOut) {
      return NextResponse.json({ 
        error: 'Missing required fields: city, checkIn, checkOut' 
      }, { status: 400 });
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      return NextResponse.json({ 
        error: 'Check-out date must be after check-in date' 
      }, { status: 400 });
    }

    // Real-time hotel data simulation (replace with actual API)
    const hotels = await searchHotels(city, checkInDate, checkOutDate, guests, budget);
    
    return NextResponse.json({
      success: true,
      city: city.charAt(0).toUpperCase() + city.slice(1),
      checkIn,
      checkOut,
      nights,
      guests,
      budget,
      hotels,
      searchTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Hotel search error:', error);
    return NextResponse.json({ 
      error: 'Failed to search hotels' 
    }, { status: 500 });
  }
}

async function searchHotels(city: string, checkIn: Date, checkOut: Date, guests: number, budget?: number) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const basePrices = getBasePricesByCity(city.toLowerCase());
  const seasonMultiplier = getSeasonalPricing(checkIn);
  const demandMultiplier = getDemandPricing(checkIn);
  
  const allHotels = [
    {
      id: `HTL001-${city}`,
      name: `Grand ${city.charAt(0).toUpperCase() + city.slice(1)} Palace`,
      category: 'luxury',
      rating: 4.8,
      reviews: 2150,
      pricePerNight: Math.round(basePrices.luxury * seasonMultiplier * demandMultiplier),
      totalPrice: 0, // Will be calculated
      currency: 'INR',
      location: 'City Center',
      distance: '0.5 km from center',
      image: '/api/placeholder/300/200',
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service', 'Concierge', 'Valet Parking'],
      roomType: 'Deluxe Room',
      breakfast: 'Included',
      cancellation: 'Free cancellation until 24h before',
      availability: Math.floor(Math.random() * 8) + 3
    },
    {
      id: `HTL002-${city}`,
      name: `${city} Business Hotel`,
      category: 'business',
      rating: 4.5,
      reviews: 1820,
      pricePerNight: Math.round(basePrices.business * seasonMultiplier * demandMultiplier),
      totalPrice: 0,
      currency: 'INR',
      location: 'Business District',
      distance: '1.2 km from center',
      image: '/api/placeholder/300/200',
      amenities: ['Free WiFi', 'Business Center', 'Gym', 'Restaurant', 'Conference Rooms', 'Airport Shuttle'],
      roomType: 'Executive Room',
      breakfast: 'Continental Breakfast',
      cancellation: 'Free cancellation until 48h before',
      availability: Math.floor(Math.random() * 12) + 5
    },
    {
      id: `HTL003-${city}`,
      name: `Comfort Inn ${city}`,
      category: 'mid-range',
      rating: 4.2,
      reviews: 980,
      pricePerNight: Math.round(basePrices.midRange * seasonMultiplier * demandMultiplier),
      totalPrice: 0,
      currency: 'INR',
      location: 'Near Airport',
      distance: '3.8 km from center',
      image: '/api/placeholder/300/200',
      amenities: ['Free WiFi', 'Restaurant', 'Airport Shuttle', 'Parking', 'AC', '24/7 Front Desk'],
      roomType: 'Standard Room',
      breakfast: 'Buffet Breakfast',
      cancellation: 'Free cancellation until 72h before',
      availability: Math.floor(Math.random() * 15) + 8
    },
    {
      id: `HTL004-${city}`,
      name: `Budget Stay ${city}`,
      category: 'budget',
      rating: 3.8,
      reviews: 650,
      pricePerNight: Math.round(basePrices.budget * seasonMultiplier * demandMultiplier),
      totalPrice: 0,
      currency: 'INR',
      location: 'Suburban Area',
      distance: '5.2 km from center',
      image: '/api/placeholder/300/200',
      amenities: ['Free WiFi', 'AC', 'TV', 'Parking', 'Reception'],
      roomType: 'Economy Room',
      breakfast: 'Not Included',
      cancellation: 'Non-refundable',
      availability: Math.floor(Math.random() * 20) + 10
    },
    {
      id: `HTL005-${city}`,
      name: `Heritage Hotel ${city}`,
      category: 'heritage',
      rating: 4.6,
      reviews: 1200,
      pricePerNight: Math.round(basePrices.heritage * seasonMultiplier * demandMultiplier),
      totalPrice: 0,
      currency: 'INR',
      location: 'Heritage District',
      distance: '2.1 km from center',
      image: '/api/placeholder/300/200',
      amenities: ['Free WiFi', 'Heritage Tours', 'Restaurant', 'Garden', 'Cultural Shows', 'Library'],
      roomType: 'Heritage Suite',
      breakfast: 'Traditional Breakfast',
      cancellation: 'Free cancellation until 24h before',
      availability: Math.floor(Math.random() * 6) + 2
    }
  ];

  // Calculate total prices
  allHotels.forEach(hotel => {
    hotel.totalPrice = hotel.pricePerNight * nights;
  });

  // Filter by budget if specified
  let filteredHotels = allHotels;
  if (budget) {
    filteredHotels = allHotels.filter(hotel => hotel.totalPrice <= budget);
  }

  // Sort by rating and price
  filteredHotels.sort((a, b) => {
    if (budget) {
      // If budget specified, prioritize value for money
      const aValue = a.rating / (a.pricePerNight / 1000);
      const bValue = b.rating / (b.pricePerNight / 1000);
      return bValue - aValue;
    }
    return b.rating - a.rating;
  });

  return filteredHotels.slice(0, 5);
}

function getBasePricesByCity(city: string): { [key: string]: number } {
  const cityPrices: { [key: string]: { [key: string]: number } } = {
    'dubai': { luxury: 15000, business: 8000, midRange: 5000, budget: 2500, heritage: 12000 },
    'mumbai': { luxury: 12000, business: 6500, midRange: 4000, budget: 2000, heritage: 9000 },
    'delhi': { luxury: 10000, business: 5500, midRange: 3500, budget: 1800, heritage: 8000 },
    'pune': { luxury: 8000, business: 4500, midRange: 3000, budget: 1500, heritage: 6000 },
    'bangalore': { luxury: 9000, business: 5000, midRange: 3200, budget: 1600, heritage: 7000 },
    'goa': { luxury: 11000, business: 6000, midRange: 3800, budget: 2200, heritage: 8500 }
  };

  return cityPrices[city] || cityPrices['pune'];
}

function getSeasonalPricing(date: Date): number {
  const month = date.getMonth();
  
  // Peak season (Dec-Jan, Mar-Apr): Higher prices
  if (month === 11 || month === 0 || month === 2 || month === 3) {
    return 1.3;
  }
  
  // Monsoon season (Jun-Sep): Lower prices
  if (month >= 5 && month <= 8) {
    return 0.8;
  }
  
  // Regular season
  return 1.0;
}

function getDemandPricing(date: Date): number {
  const today = new Date();
  const daysAhead = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Last minute booking (high demand)
  if (daysAhead < 3) return 1.4;
  if (daysAhead < 7) return 1.2;
  
  // Early booking (lower demand)
  if (daysAhead > 60) return 0.85;
  if (daysAhead > 30) return 0.9;
  
  return 1.0;
}