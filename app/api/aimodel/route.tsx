import { NextRequest, NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { generateGeminiChat } from "@/utils/gemini";
import { aj } from "@/utils/arcjet";
import { searchTravelInfo } from "@/utils/serpapi";



const PROMPT = `You are a Book With Ai Agent. Your goal is to help the user with two main services:

## 1. TRIP PLANNING
If user wants to plan a trip, ask these questions one at a time:
1. Starting location (source) 
2. Destination city or country 
3. Group size (Solo, Couple, Family, Friends) 
4. Budget (Low, Medium, High) 
5. Trip duration (number of days)  
6. Special requirements or preferences (if any)

## 2. HOTEL BOOKING
If user wants to book a hotel (phrases like "book hotel", "find hotel", "hotel in [city]"), ask:
1. Location/City for hotel
2. Budget preference (Low: ₹0-3000, Medium: ₹3000-8000, High: ₹8000-50000, Luxury: ₹50000+)
3. Check-in and check-out dates (optional)

IMPORTANT: Detect user intent first:
- Hotel booking keywords: "book hotel", "find hotel", "hotel in", "need accommodation", "where to stay"
- Trip planning keywords: "plan trip", "going to", "travel to", "vacation"

Your response MUST be valid JSON only, no markdown formatting, no code blocks.
Return ONLY this exact JSON structure:
{"resp":"Your response text here","ui":"budget or groupSize or tripDuration or final or hotelBudget or hotelSearch or null","intent":"trip or hotel or null"}

Valid ui values: "budget", "groupSize", "tripDuration", "final", "hotelBudget", "hotelSearch", null
- Use "hotelBudget" when asking hotel budget
- Use "hotelSearch" when ready to search hotels (all hotel info collected)
- Use "final" when all trip planning info is collected
- Use null when asking for source/destination/location

Example responses:
{"resp":"Great! What is your budget for the hotel?","ui":"hotelBudget","intent":"hotel"}
{"resp":"Perfect! Searching for hotels in Pune now...","ui":"hotelSearch","intent":"hotel"}
{"resp":"Excellent! Generating your trip plan...","ui":"final","intent":"trip"}
`

const FINAL_PROMPT = `Generate Travel Plan fwith give details, give me Hotels options list with HotelName, 
Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and  suggest itinerary with placeName, Place Details, Place Image Url,
 Geo Coordinates,Place address, ticket Pricing, Time travel each of the location , with each day plan with best time to visit in JSON format.
 Output Schema:
 {
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },
        "rating": "number",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}`


export async function POST(req: NextRequest) {
  const { messages, isFinal } = await req.json();
  const user = await currentUser();
  const { has } = await auth();
  const hasPremiumAccess = has({ plan: 'monthly' });
  
  // Premium bypass for account owner
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? '';
  const isPremiumUser = hasPremiumAccess || userEmail === 'contactsanket1@gmail.com';
  
  console.log("hasPremiumAccess", hasPremiumAccess, "userEmail", userEmail, "isPremiumUser", isPremiumUser)
  const decision = await aj.protect(req, { userId: userEmail, requested: isFinal ? 5 : 0 }); // Deduct 5 tokens from the bucket

  //@ts-ignore
  if (decision?.reason?.remaining == 0 && !isPremiumUser) {
    return NextResponse.json({
      resp: 'No Free Credit Remaining',
      ui: 'limit'
    })
  }

  try {
    let enhancedPrompt = isFinal ? FINAL_PROMPT : PROMPT;
    
    // If this is the final trip generation, enhance with real data from SerpAPI
    if (isFinal) {
      try {
        // Extract destination from messages for real data lookup
        const lastUserMessage = messages[messages.length - 1]?.content || '';
        const destinationMatch = lastUserMessage.match(/(?:going to|visiting|destination|trip to)\s+([^,.\n]+)/i);
        const destination = destinationMatch ? destinationMatch[1].trim() : null;
        
        if (destination) {
          console.log('Fetching real data for:', destination);
          const realData = await searchTravelInfo(destination);
          
          // Enhance the prompt with real data
          enhancedPrompt += `\n\nIMPORTANT: Use this real data when generating the trip plan for ${destination}:\n`;
          
          if (realData.attractions.length > 0) {
            enhancedPrompt += `\nReal Attractions:\n${realData.attractions.map(a => 
              `- ${a.title}: ${a.address}, Rating: ${a.rating}/5, ${a.description || 'Popular attraction'}`
            ).join('\n')}`;
          }
          
          if (realData.hotels.length > 0) {
            enhancedPrompt += `\nReal Hotels:\n${realData.hotels.map(h => 
              `- ${h.title}: ${h.address}, Rating: ${h.rating}/5`
            ).join('\n')}`;
          }
          
          enhancedPrompt += `\nUse these real places in your itinerary with accurate addresses and ratings.`;
        }
      } catch (searchError) {
        console.log('SerpAPI search failed, using AI-only generation:', searchError);
      }
    }

    let response;
    try {
      response = await generateGeminiChat(messages, enhancedPrompt);
      console.log('✅ Gemini Response received successfully');
    } catch (geminiError) {
      console.error('❌ Gemini API failed:', geminiError);
      
      // CLEAN CONVERSATION FLOW - Simple state machine
      const userQuery = messages[messages.length - 1]?.content?.toLowerCase() || '';
      const conversationHistory = messages.map((m: any) => m.content?.toLowerCase() || '').join(' ');
      
      console.log('💬 User query:', userQuery);
      console.log('📜 Conversation history:', conversationHistory);
      
      // Detect intent - Hotel booking or Trip planning
      const isHotelBooking = userQuery.match(/book hotel|find hotel|hotel in|need accommodation|where to stay|hotels? in/i);
      
      if (isHotelBooking) {
        // HOTEL BOOKING FLOW
        const hasAskedHotelLocation = conversationHistory.includes('which city') || conversationHistory.includes('where would you like to book');
        const hasAskedHotelBudget = conversationHistory.includes('budget for the hotel');
        
        // Extract location from user query - improved regex
        let city = null;
        const cityPatterns = [
          /(?:hotel in|find hotel in|book hotel in|hotels? in)\s+([a-z\s]+?)(?:\s|$|,|\.)/i,
          /(?:in|at)\s+([a-z\s]+?)(?:\s+hotel|\s+city|\s|$)/i,
          /^([a-z\s]+?)(?:\s+hotel)/i
        ];
        
        for (const pattern of cityPatterns) {
          const match = userQuery.match(pattern);
          if (match && match[1]) {
            city = match[1].trim();
            // Remove common words
            city = city.replace(/\b(the|a|an|hotel|city|please|can|you|find|book)\b/gi, '').trim();
            if (city.length > 2) break;
          }
        }
        
        // Also check if user just typed a city name in response to location question
        if (!city && hasAskedHotelLocation && userQuery.length < 30) {
          // User likely just typed city name
          city = userQuery.replace(/\b(hotel|city|please|thanks|okay|ok)\b/gi, '').trim();
        }
        
        console.log('🏙️ Extracted city:', city, 'from query:', userQuery);
        
        // Step 1: Ask for location if not provided
        if (!hasAskedHotelLocation && !city) {
          return NextResponse.json({ 
            resp: `I'd be happy to help you find a hotel! 🏨\n\nWhich city would you like to book a hotel in?`,
            ui: null,
            intent: 'hotel',
            needsLocation: true
          });
        }
        
        // Step 2: Ask for budget - store the city in response
        if (!hasAskedHotelBudget && city) {
          return NextResponse.json({ 
            resp: `Great! I'll help you find hotels in ${city}.\n\nWhat is your budget for the hotel?`,
            ui: 'hotelBudget',
            intent: 'hotel',
            location: city
          });
        }
        
        // Step 2b: User provided location, now ask budget
        if (hasAskedHotelLocation && !hasAskedHotelBudget) {
          const extractedCity = city || userQuery.trim();
          return NextResponse.json({ 
            resp: `Perfect! Looking for hotels in ${extractedCity}.\n\nWhat is your budget for the hotel?`,
            ui: 'hotelBudget',
            intent: 'hotel',
            location: extractedCity
          });
        }
        
        // Step 3: Ready to search hotels - get city from entire conversation
        let locationFromHistory = city;
        
        if (!locationFromHistory) {
          // Check all user messages for city names
          for (const msg of messages.reverse()) {
            if (msg.role === 'user') {
              const content = msg.content.toLowerCase();
              // Skip if it's a budget selection
              if (content.match(/low|medium|high|luxury|budget/)) continue;
              
              // Try to extract city name
              const patterns = [
                /(?:hotel in|find hotel in|book hotel in|in)\s+([a-z\s]+?)(?:\s|$|,|\.)/i,
                /^([a-z\s]{3,20})$/i  // Just a city name
              ];
              
              for (const pattern of patterns) {
                const match = msg.content.match(pattern);
                if (match && match[1]) {
                  const extracted = match[1].trim().replace(/\b(hotel|city|please|the)\b/gi, '').trim();
                  if (extracted.length >= 3) {
                    locationFromHistory = extracted;
                    break;
                  }
                }
              }
              
              if (locationFromHistory) break;
            }
          }
        }
        
        const finalLocation = locationFromHistory || 'Pune';
        console.log('📍 Final location for search:', finalLocation);
        
        return NextResponse.json({ 
          resp: `Perfect! Searching for the best hotels in ${finalLocation} within your budget... 🔍`,
          ui: 'hotelSearch',
          intent: 'hotel',
          location: finalLocation
        });
      }
      
      // TRIP PLANNING FLOW (existing code)
      // Track what has been asked by checking conversation history
      const hasAskedDestination = conversationHistory.includes('where would you like to travel');
      const hasAskedSource = conversationHistory.includes('where will you be traveling from');
      const hasAskedGroupSize = conversationHistory.includes('how many people will be traveling');
      const hasAskedBudget = conversationHistory.includes('budget');
      const hasAskedDuration = conversationHistory.includes('how many days');
      
      // Step 1: Initial greeting - Ask for destination
      if (!hasAskedDestination) {
        return NextResponse.json({ 
          resp: `Hello! 👋 I'm your AI travel assistant. I can help you:\n\n1. Plan a complete trip 🗺️\n2. Book hotels 🏨\n\nWhat would you like to do today?`,
          ui: null,
          intent: 'trip'
        });
      }
      
      // Step 2: User provided destination - Ask for source
      if (hasAskedDestination && !hasAskedSource) {
        const destination = userQuery.includes('dubai') ? 'Dubai' :
                          userQuery.includes('usa') ? 'USA' :
                          userQuery.includes('vegas') ? 'Las Vegas' :
                          userQuery.includes('mumbai') ? 'Mumbai' :
                          userQuery.includes('delhi') ? 'Delhi' : 'your destination';
        
        return NextResponse.json({ 
          resp: `Excellent choice! ${destination} is amazing! 🌟\n\nNow, where will you be traveling from?`,
          ui: null,
          intent: 'trip'
        });
      }
      
      // Step 3: User provided source - Ask for group size
      if (hasAskedSource && !hasAskedGroupSize) {
        return NextResponse.json({ 
          resp: `Perfect! Now let me know - how many people will be traveling?\n\nChoose from the options below:`,
          ui: 'groupSize',
          intent: 'trip'
        });
      }
      
      // Step 4: User provided group size - Ask for budget
      if (hasAskedGroupSize && !hasAskedBudget) {
        return NextResponse.json({ 
          resp: `Great! Now, what's your preferred budget for this trip?\n\nSelect from the options below:`,
          ui: 'budget',
          intent: 'trip'
        });
      }
      
      // Step 5: User provided budget - Ask for duration
      if (hasAskedBudget && !hasAskedDuration) {
        return NextResponse.json({ 
          resp: `Perfect! Last question - how many days will your trip be?\n\nSelect the duration:`,
          ui: 'tripDuration',
          intent: 'trip'
        });
      }
      
      // Step 6: All info collected - Generate trip
      if (hasAskedDuration) {
        return NextResponse.json({ 
          resp: `🎉 Perfect! I have all the information I need.\n\nGenerating your personalized trip plan now... This will take just a moment!`,
          ui: 'final',
          intent: 'trip'
        });
      }
      
      // Fallback
      return NextResponse.json({ 
        resp: `Let's start planning your trip! Where would you like to go?`,
        ui: null,
        intent: 'trip'
      });
    }
    
    // Parse the JSON response from Gemini with proper error handling
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        // Clean up the JSON string by removing control characters and fixing formatting
        let jsonString = jsonMatch[0];
        
        // Remove markdown code blocks if present
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        // Try to parse the JSON
        try {
          const parsedJson = JSON.parse(jsonString);
          return NextResponse.json(parsedJson);
        } catch (parseError) {
          console.log('JSON parse error, attempting to clean and retry:', parseError);
          
          // If parsing fails, try to extract just the resp and ui fields manually
          const respMatch = jsonString.match(/"resp"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
          const uiMatch = jsonString.match(/"ui"\s*:\s*"([^"]*)"/) || jsonString.match(/"ui"\s*:\s*null/);
          
          if (respMatch) {
            return NextResponse.json({
              resp: respMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
              ui: uiMatch ? (uiMatch[1] || null) : null
            });
          }
          
          // If still can't parse, return the raw response
          return NextResponse.json({
            resp: response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim(),
            ui: isFinal ? 'final' : null
          });
        }
      } else {
        // If no JSON found, create a structured response
        return NextResponse.json({
          resp: response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim(),
          ui: isFinal ? 'final' : null
        });
      }
    } catch (extractError) {
      console.error('Error extracting JSON from Gemini response:', extractError);
      return NextResponse.json({
        resp: 'I received your input. Let me help you plan your trip. Could you provide more details?',
        ui: null
      });
    }
  }
  catch (e) {
    console.error('Gemini API Error:', e);
    return NextResponse.json({
      resp: 'Sorry, there was an error processing your request. Please try again.',
      ui: 'error'
    });
  }
}