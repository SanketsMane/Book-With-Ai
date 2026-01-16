import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/utils/serpapi';

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

    // Airport codes mapping (Expansion needed for production, but good start)
    const airportCodes: { [key: string]: string } = {
      'pune': 'PNQ', 'mumbai': 'BOM', 'delhi': 'DEL', 'bangalore': 'BLR',
      'dubai': 'DXB', 'singapore': 'SIN', 'london': 'LHR', 'paris': 'CDG',
      'new york': 'JFK', 'tokyo': 'HND', 'goa': 'GOI', 'chennai': 'MAA',
      'kolkata': 'CCU', 'hyderabad': 'HYD', 'ahmedabad': 'AMD'
    };

    const fromCode = airportCodes[from.toLowerCase()] || from.toUpperCase();
    const toCode = airportCodes[to.toLowerCase()] || to.toUpperCase();

    // Fetch Real Flights from SerpAPI (Google Flights)
    const flights = await searchFlights(fromCode, toCode, date, passengers);

    // Fallback if API fails or returns no results (avoid breaking demo)
    if (flights.length === 0) {
      console.warn('⚠️ No real flights found, returning empty list (client should handle empty state)');
    }

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