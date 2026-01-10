import { getJson } from 'serpapi';

const SERPAPI_KEY = process.env.SERPAPI_KEY;

export interface PlaceSearchResult {
  title: string;
  address: string;
  rating?: number;
  reviews?: number;
  phone?: string;
  website?: string;
  description?: string;
  images?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  place_id?: string;
}

// Search for places using SerpAPI Google Places
export async function searchPlaces(query: string, location?: string): Promise<PlaceSearchResult[]> {
  try {
    const searchQuery = location ? `${query} in ${location}` : query;

    const response = await getJson({
      engine: "google_maps",
      q: searchQuery,
      type: "search",
      api_key: SERPAPI_KEY
    });

    const places: PlaceSearchResult[] = (response.local_results || []).map((place: any) => ({
      title: place.title,
      address: place.address,
      rating: place.rating,
      reviews: place.reviews,
      phone: place.phone,
      website: place.website,
      description: place.description,
      coordinates: place.gps_coordinates ? {
        lat: place.gps_coordinates.latitude,
        lng: place.gps_coordinates.longitude
      } : undefined,
      place_id: place.place_id
    }));

    return places;
  } catch (error) {
    console.error('SerpAPI Places Search Error:', error);
    return [];
  }
}

// Search for travel information and images
export async function searchTravelInfo(destination: string): Promise<{
  attractions: PlaceSearchResult[];
  hotels: PlaceSearchResult[];
  restaurants: PlaceSearchResult[];
}> {
  try {
    const [attractions, hotels, restaurants] = await Promise.all([
      searchPlaces(`tourist attractions ${destination}`),
      searchPlaces(`hotels ${destination}`),
      searchPlaces(`restaurants ${destination}`)
    ]);

    return {
      attractions: attractions.slice(0, 10),
      hotels: hotels.slice(0, 8),
      restaurants: restaurants.slice(0, 6)
    };
  } catch (error) {
    console.error('SerpAPI Travel Info Error:', error);
    return {
      attractions: [],
      hotels: [],
      restaurants: []
    };
  }
}

// Get images for a specific place
export async function getPlaceImages(placeName: string): Promise<string[]> {
  try {
    const response = await getJson({
      engine: "google_images",
      q: `${placeName} travel destination`,
      num: 10,
      safe: "active",
      api_key: SERPAPI_KEY
    });

    const images = (response.images_results || [])
      .map((img: any) => img.original)
      .filter((url: string) => url && url.startsWith('http'))
      .slice(0, 5);

    return images;
  } catch (error) {
    console.error('SerpAPI Images Error:', error);
    return [];
  }
}

// Search places with detailed information (for hotels, restaurants, etc.)
export async function searchPlacesWithSerpAPI(query: string): Promise<any[]> {
  try {
    const response = await getJson({
      engine: "google_maps",
      q: query,
      type: "search",
      api_key: SERPAPI_KEY
    });

    return response.local_results || [];
  } catch (error) {
    console.error('SerpAPI Places Search Error:', error);
    return [];
  }
}

// Interface for our app's Flight model
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  currency: string;
  logo?: string;
  stops: number;
  aircraft?: string;
  baggage?: string;
  meals?: boolean;
  cancellation?: string;
}

// Search for flights using SerpAPI Google Flights
export async function searchFlights(fromCode: string, toCode: string, date: string, passengers: number = 1): Promise<Flight[]> {
  try {
    console.log(`✈️ Searching flights: ${fromCode} -> ${toCode} on ${date}`);
    const response = await getJson({
      engine: "google_flights",
      departure_id: fromCode,
      arrival_id: toCode,
      outbound_date: date,
      currency: "INR",
      hl: "en",
      adults: passengers,
      api_key: SERPAPI_KEY,
      type: "2" // One-way trip
    });

    if (!response.best_flights && !response.other_flights) {
      console.warn('⚠️ No flights found in SerpAPI response');
      return [];
    }

    const rawFlights = [...(response.best_flights || []), ...(response.other_flights || [])];

    return rawFlights.slice(0, 15).map((f: any, index: number) => {
      const leg = f.flights[0]; // Assuming first leg for now
      return {
        id: `FL-${index}-${fromCode}-${toCode}`,
        airline: leg.airline || 'Unknown Airline',
        flightNumber: leg.flight_number || '',
        from: leg.departure_airport?.name || fromCode,
        to: leg.arrival_airport?.name || toCode,
        departure: leg.departure_airport?.time?.split(' ')[1] || '00:00', // Extract HH:MM
        arrival: leg.arrival_airport?.time?.split(' ')[1] || '00:00',
        duration: `${Math.floor(f.total_duration / 60)}h ${f.total_duration % 60}m`,
        price: f.price || 0, // SerpAPI returns numerical price often, or need parsing if string
        currency: 'INR',
        logo: leg.airline_logo,
        stops: f.layovers ? f.layovers.length : 0,
        aircraft: leg.airplane,
        // Defaults for info not always in basic search
        baggage: 'Check with airline',
        cancellation: 'Check rules'
      };
    });

  } catch (error) {
    console.error('❌ SerpAPI Flight Search Error:', error);
    return [];
  }
}