import { NextRequest, NextResponse } from 'next/server';

// Real-time flight search API
export async function POST(request: NextRequest) {
  try {
    const { from, to, date, passengers = 1 } = await request.json();
    
    // Validate input
    if (!from || !to || !date) {
      return NextResponse.json({ 
        error: 'Missing required fields: from, to, date' 
      }, { status: 400 });
    }

    // Airport codes mapping
    const airportCodes: { [key: string]: string } = {
      'pune': 'PNQ', 'mumbai': 'BOM', 'delhi': 'DEL', 'bangalore': 'BLR',
      'dubai': 'DXB', 'singapore': 'SIN', 'london': 'LHR', 'paris': 'CDG'
    };

    const fromCode = airportCodes[from.toLowerCase()] || from.toUpperCase();
    const toCode = airportCodes[to.toLowerCase()] || to.toUpperCase();

    // Real-time flight data simulation (replace with actual API)
    const flights = await searchFlights(fromCode, toCode, date, passengers);
    
    return NextResponse.json({
      success: true,
      route: `${fromCode} → ${toCode}`,
      date,
      passengers,
      flights,
      searchTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Flight search error:', error);
    return NextResponse.json({ 
      error: 'Failed to search flights' 
    }, { status: 500 });
  }
}

async function searchFlights(from: string, to: string, date: string, passengers: number) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Dynamic pricing based on route and date
  const basePrice = getBasePriceByRoute(from, to);
  const dateMultiplier = getDynamicPricing(date);
  
  return [
    {
      id: `FL001-${from}-${to}`,
      airline: 'Emirates',
      flightNumber: 'EK-505',
      from,
      to,
      departure: '14:30',
      arrival: getArrivalTime(from, to, '14:30'),
      duration: getFlightDuration(from, to),
      price: Math.round(basePrice * dateMultiplier),
      currency: 'INR',
      stops: from === 'PNQ' && to === 'DXB' ? 0 : 1,
      aircraft: 'Boeing 777',
      baggage: '30kg',
      meals: true,
      cancellation: 'Free cancellation up to 24h',
      availability: Math.floor(Math.random() * 20) + 5
    },
    {
      id: `FL002-${from}-${to}`,
      airline: 'IndiGo',
      flightNumber: '6E-1405',
      from,
      to,
      departure: '10:15',
      arrival: getArrivalTime(from, to, '10:15'),
      duration: getFlightDuration(from, to, true),
      price: Math.round(basePrice * 0.85 * dateMultiplier),
      currency: 'INR',
      stops: 1,
      aircraft: 'Airbus A320',
      baggage: '20kg',
      meals: true,
      cancellation: 'Paid cancellation only',
      availability: Math.floor(Math.random() * 15) + 3
    },
    {
      id: `FL003-${from}-${to}`,
      airline: 'Air India',
      flightNumber: 'AI-131',
      from,
      to,
      departure: '21:20',
      arrival: getArrivalTime(from, to, '21:20'),
      duration: getFlightDuration(from, to),
      price: Math.round(basePrice * 0.92 * dateMultiplier),
      currency: 'INR',
      stops: 0,
      aircraft: 'Boeing 787',
      baggage: '25kg',
      meals: true,
      cancellation: 'Free cancellation up to 12h',
      availability: Math.floor(Math.random() * 25) + 8
    }
  ];
}

function getBasePriceByRoute(from: string, to: string): number {
  const routes: { [key: string]: number } = {
    'PNQ-DXB': 45000, 'BOM-DXB': 42000, 'DEL-DXB': 38000,
    'PNQ-BOM': 8000, 'PNQ-DEL': 12000, 'PNQ-BLR': 6000,
    'BOM-DEL': 10000, 'BOM-BLR': 7000, 'DEL-BLR': 8500
  };
  
  const routeKey = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;
  
  return routes[routeKey] || routes[reverseKey] || 15000;
}

function getDynamicPricing(date: string): number {
  const searchDate = new Date(date);
  const today = new Date();
  const daysAhead = Math.ceil((searchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysAhead < 7) return 1.4; // Last minute booking
  if (daysAhead < 14) return 1.2;
  if (daysAhead < 30) return 1.0;
  if (daysAhead < 60) return 0.9; // Early bird discount
  return 0.85;
}

function getFlightDuration(from: string, to: string, withStop: boolean = false): string {
  const directTimes: { [key: string]: string } = {
    'PNQ-DXB': '4h 30m', 'BOM-DXB': '4h 15m', 'DEL-DXB': '4h 45m',
    'PNQ-BOM': '1h 30m', 'PNQ-DEL': '2h 15m', 'PNQ-BLR': '1h 45m'
  };
  
  const routeKey = `${from}-${to}`;
  const baseTime = directTimes[routeKey] || '3h 00m';
  
  if (withStop) {
    const hours = parseInt(baseTime) + 2;
    const minutes = baseTime.includes('30m') ? '45m' : '15m';
    return `${hours}h ${minutes}`;
  }
  
  return baseTime;
}

function getArrivalTime(from: string, to: string, departure: string): string {
  const duration = getFlightDuration(from, to);
  const durationMinutes = parseDuration(duration);
  
  const [hours, minutes] = departure.split(':').map(Number);
  const departureTime = new Date();
  departureTime.setHours(hours, minutes, 0, 0);
  
  const arrivalTime = new Date(departureTime.getTime() + durationMinutes * 60000);
  
  // Handle timezone differences (simplified)
  if (to === 'DXB') {
    arrivalTime.setHours(arrivalTime.getHours() + 1.5); // Dubai is +1.5 hours ahead
  }
  
  const nextDay = arrivalTime.getDate() > departureTime.getDate();
  const timeStr = arrivalTime.toTimeString().substring(0, 5);
  
  return nextDay ? `${timeStr}+1` : timeStr;
}

function parseDuration(duration: string): number {
  const hours = duration.match(/(\d+)h/)?.[1] || '0';
  const minutes = duration.match(/(\d+)m/)?.[1] || '0';
  return parseInt(hours) * 60 + parseInt(minutes);
}