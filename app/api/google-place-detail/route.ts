import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getPlaceImages } from "@/utils/serpapi";

export async function POST(req: NextRequest) {
    const { placeName } = await req.json();
    const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process?.env?.GOOGLE_PLACE_API_KEY,
            'X-Goog-FieldMask': [
                'places.photos',
                'places.displayName',
                'places.id'
            ]
        }
    };

    try {
        // Try Google Places API first (if API key exists)
        if (process.env.GOOGLE_PLACE_API_KEY) {
            const result = await axios.post(BASE_URL, {
                textQuery: placeName
            }, config);

            const placeRefName = result?.data?.places[0]?.photos[0]?.name;
            const PhotoRefUrl = `https://places.googleapis.com/v1/${placeRefName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${process?.env.GOOGLE_PLACE_API_KEY}`;
            return NextResponse.json(PhotoRefUrl);
        } else {
            // Fallback to SerpAPI for images
            console.log('Using SerpAPI fallback for place images');
            const images = await getPlaceImages(placeName);
            return NextResponse.json(images[0] || '/placeholder-image.jpg');
        }
    }
    catch (e) {
        console.log('Google Places API failed, falling back to SerpAPI');
        try {
            // Fallback to SerpAPI
            const images = await getPlaceImages(placeName);
            return NextResponse.json(images[0] || '/placeholder-image.jpg');
        } catch (serpError) {
            console.error('SerpAPI also failed:', serpError);
            return NextResponse.json('/placeholder-image.jpg');
        }
    }
}