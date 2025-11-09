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