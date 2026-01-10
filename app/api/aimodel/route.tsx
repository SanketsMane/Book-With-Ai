import { NextRequest, NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { generateGeminiChat } from "@/utils/gemini";
import { aj } from "@/utils/arcjet";
import { searchTravelInfo } from "@/utils/serpapi";



const PROMPT = `You are a Book With Ai Agent. Your goal is to help the user with three main services:

## 1. TRIP PLANNING
If user wants to plan a trip asking for itinerary, ask these questions one at a time:
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
3. Check-in (optional)

## 3. FLIGHT SEARCH
If user wants to find or book flights (phrases like "flight to", "fly to", "flights from", "ticket to"), ask:
1. Departure City (From where?)
2. Destination City (Where to?)
3. Date of travel (When?)

IMPORTANT: Detect user intent first:
- Flight keywords: "flight", "fly", "plane", "ticket", "airfare"
- Hotel booking keywords: "book hotel", "find hotel", "hotel in", "need accommodation", "where to stay"
- Trip planning keywords: "plan trip", "going to", "travel to", "vacation", "itinerary"

Your response MUST be valid JSON only, no markdown formatting, no code blocks.
Return ONLY this exact JSON structure:
{"resp":"Your response text here","ui":"budget or groupSize or tripDuration or final or hotelBudget or hotelSearch or flightSearch or null","intent":"trip or hotel or flight or null"}

Valid ui values: 
- "flightSearch": Use when you have From, To, and Date for a flight.
- "hotelBudget": Use when asking hotel budget.
- "hotelSearch": Use when ready to search hotels (all hotel info collected).
- "final": Use when all trip planning info is collected.
- null: For all intermediate questions.

Example responses:
{"resp":"Where are you flying from?","ui":null,"intent":"flight"}
{"resp":"Searching for flights from Mumbai to Goa for tomorrow...","ui":"flightSearch","intent":"flight"}
{"resp":"Great! What is your budget for the hotel?","ui":"hotelBudget","intent":"hotel"}
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

      // 1. Detect Intent
      const lastAssistantMessage = messages.length > 1 && messages[messages.length - 1].role === 'assistant'
        ? messages[messages.length - 1].content.toLowerCase()
        : messages.length > 2 && messages[messages.length - 2].role === 'assistant'
          ? messages[messages.length - 2].content.toLowerCase()
          : '';

      const contextIsFlight = lastAssistantMessage.includes('flying from') ||
        lastAssistantMessage.includes('fly to') ||
        lastAssistantMessage.includes('travel?') ||
        lastAssistantMessage.includes('find flights');

      const isFlightSearch = userQuery.match(/flight|fly|plane|airfare|ticket/i) || contextIsFlight;
      const isHotelBooking = userQuery.match(/book hotel|find hotel|hotel in|need accommodation|where to stay|hotels? in/i);

      // --- FLIGHT SEARCH FLOW ---
      if (isFlightSearch) {
        const hasAskedFrom = conversationHistory.includes('flying from') || conversationHistory.includes('departure city');
        const hasAskedTo = conversationHistory.includes('where to') || conversationHistory.includes('destination city') || conversationHistory.includes('fly to');
        const hasAskedDate = conversationHistory.includes('when') || conversationHistory.includes('date');

        // Extract entities by replaying history to maintain context
        let from = null, to = null, date = null;
        let lastQuestion = null; // 'from', 'to', 'date'

        for (const msg of messages) {
          const content = msg.content.toLowerCase();

          if (msg.role === 'assistant') {
            // Determine what the assistant asked
            if (content.match(/flying from|departure city/)) lastQuestion = 'from';
            else if (content.match(/fly to|where to|destination/)) lastQuestion = 'to';
            else if (content.match(/when|date|traveling/)) lastQuestion = 'date';
            else lastQuestion = null;
          } else if (msg.role === 'user') {
            // 1. Explicit Regex Extraction (Strongest signal)
            const fromMatch = content.match(/(?:from)\s+([a-z\s]+)(?:to|$)/i);
            if (fromMatch) {
              from = fromMatch[1].trim().replace(/\b(to)\b/gi, '').trim();
              lastQuestion = null; // Reset context if explicit
            }

            const toMatch = content.match(/(?:to|fly to|going to)\s+([a-z\s]+)(?:from|$)/i);
            if (toMatch) {
              to = toMatch[1].trim().replace(/\b(from)\b/gi, '').trim();
              lastQuestion = null;
            }

            const dateMatch = content.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*|today|tomorrow|next\s+[a-z]+)/i);
            if (dateMatch) {
              date = dateMatch[0];
              lastQuestion = null;
            }

            // 2. Contextual Extraction (If no explicit regex matched)
            const cleanContent = content.replace(/\b(to|from|go|fly|flight|please|i|want|will|be)\b/gi, '').trim();

            if (lastQuestion === 'from' && !from && cleanContent.length > 2) {
              from = cleanContent;
            }
            else if (lastQuestion === 'to' && !to && cleanContent.length > 2) {
              to = cleanContent;
            }
            else if (lastQuestion === 'date' && !date && cleanContent.length > 2) {
              date = cleanContent;
            }
          }
        }

        console.log('✈️ Flight Params:', { from, to, date, hasAskedFrom, hasAskedTo });

        // Step 1: Ask From
        if (!from) {
          return NextResponse.json({
            resp: `I can find flights for you! ✈️\n\nWhere will you be flying from?`,
            ui: null,
            intent: 'flight'
          });
        }

        // Step 2: Ask To
        if (!to) {
          return NextResponse.json({
            resp: `Got it. Where would you like to fly to?`,
            ui: null,
            intent: 'flight'
          });
        }

        // Step 3: Ask Date
        if (!date) {
          // Also check history for date
          const historicDateMatch = conversationHistory.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*|today|tomorrow|next\s+[a-z]+)/i);

          // Note: date matching in history is risky as it might be old dates, but let's trust it if explicit
          if (!historicDateMatch) {
            return NextResponse.json({
              resp: `When are you planning to travel? (e.g., Tomorrow, Next Friday, or a specific date)`,
              ui: null,
              intent: 'flight'
            });
          }
        }

        // Ready to search
        return NextResponse.json({
          resp: `Searching for fastest flights... ✈️`,
          ui: 'flightSearch',
          intent: 'flight'
        });
      }

      // --- HOTEL BOOKING FLOW ---
      // --- HOTEL BOOKING FLOW ---
      if (isHotelBooking) {
        let city = null;
        let budget = null;
        let lastQuestion = null; // 'city', 'budget'

        const budgetKeywords = ['low', 'medium', 'high', 'luxury', 'cheap', 'expensive'];

        // Replay history to build state
        for (const msg of messages) {
          const content = msg.content.toLowerCase();

          if (msg.role === 'assistant') {
            if (content.includes('which city') || content.includes('where would you like')) lastQuestion = 'city';
            else if (content.includes('budget')) lastQuestion = 'budget';
            else lastQuestion = null;
          } else if (msg.role === 'user') {
            // 1. Explicit City Extraction
            const cityPatterns = [
              /(?:hotel in|find hotel in|book hotel in|hotels? in)\s+([a-z\s]+?)(?:\s|$|,|\.)/i,
              /(?:in|at)\s+([a-z\s]+?)(?:\s+hotel|\s+city|\s|$)/i
            ];
            for (const pattern of cityPatterns) {
              const match = content.match(pattern);
              if (match && match[1]) {
                const extracted = match[1].trim().replace(/\b(the|a|an|hotel|city|please|can|you|find|book)\b/gi, '').trim();
                if (extracted.length > 2) {
                  city = extracted;
                  lastQuestion = null;
                }
              }
            }

            // 2. Explicit Budget Extraction (Simple keyword match)
            for (const b of budgetKeywords) {
              if (content.includes(b)) {
                budget = b;
                lastQuestion = null;
              }
            }

            // 3. Contextual Answer Extraction
            const cleanContent = content.replace(/\b(hotel|city|please|thanks|okay|ok|i|want|to|book|in)\b/gi, '').trim();

            if (lastQuestion === 'city' && !city && cleanContent.length > 2) {
              // Check if it's not a budget word
              if (!budgetKeywords.some(b => cleanContent.includes(b))) {
                city = cleanContent;
              }
            }
            else if (lastQuestion === 'budget' && !budget) {
              budget = cleanContent;
            }
          }
        }

        console.log('🏨 Hotel State:', { city, budget });

        if (!city) {
          return NextResponse.json({
            resp: `I'd be happy to help you find a hotel! 🏨\n\nWhich city would you like to book a hotel in?`,
            ui: null,
            intent: 'hotel',
            needsLocation: true
          });
        }

        if (!budget) {
          return NextResponse.json({
            resp: `Great! I'll help you find hotels in ${city}.\n\nWhat is your budget for the hotel? (Low, Medium, High, Luxury)`,
            ui: 'hotelBudget',
            intent: 'hotel',
            location: city
          });
        }

        // Ready to search
        return NextResponse.json({
          resp: `Perfect! Searching for the best hotels in ${city} matching your ${budget} budget... 🔍`,
          ui: 'hotelSearch',
          intent: 'hotel',
          location: city
        });
      }

      // --- TRIP PLANNING FLOW ---

      // State Variables
      let destination = null;
      let source = null;
      let groupSize = null; // Solo, Couple, Family, Friends
      let budget = null;
      let duration = null; // days

      let lastTripQuestion = null; // 'dest', 'source', 'group', 'budget', 'duration'

      // Helper to identify group size from text
      const findGroupSize = (text: string) => {
        if (text.match(/solo|alone|one|myself/i)) return 'Solo';
        if (text.match(/couple|two|partner|wife|husband/i)) return 'Couple';
        if (text.match(/family|kids|children/i)) return 'Family';
        if (text.match(/friend|group|friends/i)) return 'Friends';
        return null;
      }

      // Replay History
      for (const msg of messages) {
        const content = msg.content.toLowerCase();

        if (msg.role === 'assistant') {
          if (content.includes('where would you like to go')) lastTripQuestion = 'dest';
          else if (content.includes('traveling from')) lastTripQuestion = 'source';
          else if (content.includes('how many people')) lastTripQuestion = 'group';
          else if (content.includes('budget')) lastTripQuestion = 'budget';
          else if (content.includes('how many days') || content.includes('select the duration')) lastTripQuestion = 'duration';
          else lastTripQuestion = null;
        } else if (msg.role === 'user') {
          const clean = content.replace(/\b(to|from|go|fly|flight|please|i|want|will|be|travel|trip|plan|a)\b/gi, '').trim();

          // 1. Explicit Extraction
          if (content.includes('solo') || content.includes('couple') || content.includes('family') || content.includes('friends')) {
            groupSize = findGroupSize(content);
          }
          if (content.match(/cheap|low|medium|high|luxury/)) {
            const bMatch = content.match(/cheap|low|medium|high|luxury/);
            if (bMatch) budget = bMatch[0];
          }
          if (content.match(/\d+\s*days?/)) {
            const dMatch = content.match(/(\d+)\s*days?/);
            if (dMatch) duration = dMatch[1] + ' Days';
          }

          // 2. Contextual Extraction based on last question
          if (lastTripQuestion === 'dest' && !destination) destination = clean;
          else if (lastTripQuestion === 'source' && !source) source = clean;
          else if (lastTripQuestion === 'group' && !groupSize) groupSize = findGroupSize(content) || (content.length < 10 ? content : null);
          else if (lastTripQuestion === 'budget' && !budget) budget = content;
          else if (lastTripQuestion === 'duration' && !duration) {
            const dMatch = content.match(/(\d+)/);
            if (dMatch) duration = dMatch[1] + ' Days';
          }
        }
      }

      if (!destination) {
        return NextResponse.json({
          resp: `Hello! 👋 I'm your AI travel assistant. I can help you:\n\n1. Find Flights ✈️\n2. Plan a complete trip 🗺️\n3. Book hotels 🏨\n\nWhere would you like to go for your trip?`,
          ui: null,
          intent: 'trip'
        });
      }

      if (!source) {
        return NextResponse.json({
          resp: `Great choice! ${destination} sounds amazing. 🌟\n\nWhere will you be traveling from?`,
          ui: null,
          intent: 'trip'
        });
      }

      if (!groupSize) {
        return NextResponse.json({
          resp: `Got it. Traveling from ${source} to ${destination}.\n\nHow many people will be traveling?`,
          ui: 'groupSize',
          intent: 'trip'
        });
      }

      if (!budget) {
        return NextResponse.json({
          resp: `Okay, ${groupSize} trip.\n\nWhat's your preferred budget?`,
          ui: 'budget',
          intent: 'trip'
        });
      }

      if (!duration) {
        return NextResponse.json({
          resp: `Understood. ${budget} budget.\n\nLast question - how many days will your trip be?`,
          ui: 'tripDuration',
          intent: 'trip'
        });
      }

      // If all data collected
      return NextResponse.json({
        resp: `🎉 Perfect! I have all the details.\n\nGenerating your ${duration} trip to ${destination} for ${groupSize} with ${budget} budget...`,
        ui: 'final',
        intent: 'trip'
      });

      /* 
       * FALLBACK INTENT
      */
      return NextResponse.json({
        resp: `Let's start planning your trip! Where would you like to go?`,
        ui: null,
        intent: 'trip'
      });
    }

    // Parse the JSON response from Gemini
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let jsonString = jsonMatch[0];
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        try {
          const parsedJson = JSON.parse(jsonString);
          return NextResponse.json(parsedJson);
        } catch (parseError) {
          console.log('JSON parse error, attempting to clean and retry:', parseError);
          const respMatch = jsonString.match(/"resp"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
          const uiMatch = jsonString.match(/"ui"\s*:\s*"([^"]*)"/) || jsonString.match(/"ui"\s*:\s*null/);

          if (respMatch) {
            return NextResponse.json({
              resp: respMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
              ui: uiMatch ? (uiMatch[1] || null) : null
            });
          }
          return NextResponse.json({
            resp: response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim(),
            ui: isFinal ? 'final' : null
          });
        }
      } else {
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