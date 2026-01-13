"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send, Volume2, Bot, FileText } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useVoiceConversation } from '@/hooks/use-voice-conversation'
import { VoiceMicButton, VoiceStatus } from '@/components/ui/voice-components'
import { SmartSuggestions, PersonalizedInput } from '@/components/ui/smart-suggestions'
import { usePersonalization } from '@/hooks/use-personalization'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUi'
import BudgetUi from './BudgetUi'
import SelectDays from './SelectDaysUi'
import FinalUi from './FinalUi'
import HotelBudgetUI from './HotelBudgetUI'
import HotelBookingUI from './HotelBookingUI'
import FlightBookingUI from './FlightBookingUI'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useTripDetail, useUserDetail } from '@/app/provider'
import { v4 as uuidv4 } from 'uuid'
import { usePathname, useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

type Message = {
    role: string
    content: string
    ui?: string | null
    intent?: string
    hotels?: any[]
    location?: string
    flights?: any[]
    route?: { from: string, to: string }
    budget?: number
}

export type TripInfo = {
    budget: string
    destination: string
    duration: string
    group_size: string
    origin: string
    hotels: Hotel[]
    itinerary: Itinerary[]
}

export type Hotel = {
    hotel_name: string
    hotel_address: string
    price_per_night: string
    hotel_image_url: string
    geo_coordinates: {
        latitude: number
        longitude: number
    }
    rating: number
    description: string
}

export type Activity = {
    place_name: string
    place_details: string
    place_image_url: string
    geo_coordinates: {
        latitude: number
        longitude: number
    }
    place_address: string
    ticket_pricing: string
    time_travel_each_location: string
    best_time_to_visit: string
}

export type Itinerary = {
    day: number
    day_plan: string
    best_time_to_visit_day: string
    activities: Activity[]
}

const ChatBox = React.forwardRef((props: { hideInput?: boolean }, ref) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [userInput, setUserInput] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [isFinal, setIsFinal] = useState(false)
    const [tripDetail, setTripDetail] = useState<TripInfo>()
    const [hotelSearchData, setHotelSearchData] = useState<{ location: string; budget: string } | null>(null)
    const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail)
    const { userDetail } = useUserDetail()
    const router = useRouter();
    const [_tripId, setTripId] = useState<string>();
    //@ts-ignore
    const { setTripDetailInfo } = useTripDetail()
    const path = usePathname()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const searchParams = useSearchParams()
    const [initialQueryProcessed, setInitialQueryProcessed] = useState(false)

    // Personalization Integration
    const { learnFromNewTrip, recordUserAction, hasData } = usePersonalization()
    const [currentTripData, setCurrentTripData] = useState({
        destination: '',
        budget: '',
        days: 0,
        groupSize: ''
    })

    // Expose sendMessage to parent
    React.useImperativeHandle(ref, () => ({
        sendMessage: (text: string) => {
            setUserInput(text);
            // We need to wait for state update before sending, or just pass text directly to a new internal send function
            // Best to refactor onSend to accept an argument
            triggerSend(text);
        }
    }));

    // Voice Conversation Integration (Speech Recognition + Text-to-Speech)
    const [voiceState, voiceControls] = useVoiceConversation({
        continuous: true,
        interimResults: true,
        language: 'en-US',
        voiceEnabled: false, // User can toggle this
        voiceRate: 1.1, // Slightly faster than normal
        voicePitch: 1.0,
        onResult: (transcript: string, confidence: number) => {
            // Set the input for any transcript with reasonable length
            if (transcript.length > 3) {
                setUserInput(transcript)

                // Auto-send if confidence is above 60%
                if (confidence > 0.6) {
                    // Stop listening immediately
                    voiceControls.stopListening()
                    // Use requestAnimationFrame to ensure state is updated before sending
                    requestAnimationFrame(() => {
                        triggerSend(transcript)
                    })
                }
            }
        },
        onError: (error: string) => {
            // Only log serious/unexpected errors that need developer attention
            if (error.includes('Failed to start') || error.includes('Speech recognition error')) {
                console.error('Voice AI Error:', error)
            } else if (error.includes('microphone') || error.includes('permissions')) {
                console.warn('Voice AI permissions:', error)
            } else {
                // For expected/handled errors, use info level or no logging
                console.info('Voice AI info:', error)
            }
        },
        maxDuration: 30000, // 30 seconds max
        autoSend: true
    })

    // Auto scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    // Process initial query from URL parameter (from home page)
    useEffect(() => {
        const query = searchParams.get('query')
        if (query && !initialQueryProcessed && messages.length === 0) {
            setInitialQueryProcessed(true)
            triggerSend(query)
        }
    }, [searchParams, initialQueryProcessed, messages.length])


    const triggerSend = async (text: string, isFinalOverride?: boolean) => {
        if (!text.trim()) return

        const newMsg: Message = {
            role: 'user',
            content: text
        }

        setMessages((prev) => [...prev, newMsg])
        setUserInput('')
        setLoading(true)

        try {
            const result = await axios.post('/api/aimodel', {
                messages: [...messages, newMsg],
                isFinal: isFinalOverride ?? isFinal
            })

            const { resp, ui, trip_plan, intent, location } = result.data || {}

            // Handle flight search flow
            if (intent === 'flight') {
                if (ui === 'flightSearch') {
                    setMessages((prev) => [...prev, {
                        role: 'assistant',
                        content: resp,
                        ui: 'loading', // Show loading while we fetch real flights
                        intent
                    }])

                    // Extract flight details from conversation
                    const fullHistory = [...messages, newMsg];
                    let from = '', to = '', date = '', budget = 0;
                    let lastQuestion = null;

                    for (const msg of fullHistory) {
                        const content = msg.content.toLowerCase();

                        if (msg.role === 'assistant') {
                            if (content.match(/flying from|departure city/)) lastQuestion = 'from';
                            else if (content.match(/fly to|where to|destination/)) lastQuestion = 'to';
                            else if (content.match(/when|date|traveling/)) lastQuestion = 'date';
                            else lastQuestion = null;
                        } else {
                            // 1. Explicit Regex
                            const fromMatch = content.match(/(?:from)\s+([a-z\s]+)(?:to|$)/i);
                            if (fromMatch) {
                                from = fromMatch[1].trim().replace(/\b(to)\b/gi, '').trim();
                                lastQuestion = null;
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

                            // Budget Extraction (Cumulative, take latest)
                            const budgetMatch = content.match(/(?:below|under|less than|budget|price)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:k)?)/i);
                            if (budgetMatch) {
                                let valRaw = budgetMatch[1].toLowerCase().replace(/,/g, '');
                                if (valRaw.includes('k')) valRaw = valRaw.replace('k', '000');
                                budget = parseInt(valRaw);
                            }

                            // 2. Contextual Extraction
                            const cleanContent = content.replace(/\b(to|from|go|fly|flight|please|i|want|will|be)\b/gi, '').trim();

                            if (lastQuestion === 'from' && !from && cleanContent.length > 2) from = cleanContent;
                            else if (lastQuestion === 'to' && !to && cleanContent.length > 2) to = cleanContent;
                            else if (lastQuestion === 'date' && !date && cleanContent.length > 2) date = cleanContent;
                        }
                    }

                    // Defaults if extraction fails (fallback to Pune -> Delhi tomorrow)
                    const searchPayload = {
                        from: from || 'Pune',
                        to: to || 'Delhi',
                        date: date || 'tomorrow',
                        passengers: 1,
                        budget // Pass budget to API too if needed later, but used in UI filtering for now
                    };

                    console.log('✈️ Searching flights:', searchPayload);

                    try {
                        const flightResult = await axios.post('/api/flights/search', searchPayload);
                        const flights = flightResult.data.flights || [];

                        setMessages((prev) => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                role: 'assistant',
                                content: `Here are the best flights from ${searchPayload.from} to ${searchPayload.to} for ${searchPayload.date}:`,
                                ui: 'flightResults',
                                intent: 'flight',
                                // Store flight data in message
                                // @ts-ignore
                                flights: flights,
                                route: { from: searchPayload.from, to: searchPayload.to },
                                budget: budget > 0 ? budget : undefined
                            };
                            return updated;
                        });

                        if (voiceState.voiceEnabled) {
                            voiceControls.speak(`I found ${flights.length} flights for you. ${budget > 0 ? 'Filtering by your budget of ' + budget : ''} The best option starts at ${flights[0]?.price || 'an unknown'} rupees.`).catch(() => { })
                        }

                    } catch (error) {
                        console.error('Flight search error:', error);
                        setMessages((prev) => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                role: 'assistant',
                                content: "Sorry, I couldn't find any flights at the moment. Please try again.",
                                ui: null,
                                intent: 'flight'
                            };
                            return updated;
                        });
                    }
                    setLoading(false);
                    return;
                }
            }

            // Handle hotel booking flow
            if (intent === 'hotel') {
                if (ui === 'hotelBudget') {
                    // Store location from API response
                    const hotelLocation = location || text.trim();

                    setMessages((prev) => [...prev, {
                        role: 'assistant',
                        content: resp,
                        ui,
                        intent,
                        location: hotelLocation
                    }])

                    if (voiceState.voiceEnabled && resp) {
                        voiceControls.speak(resp.replace(/\*\*/g, '').replace(/\*/g, '').trim()).catch(() => { })
                    }
                } else if (ui === 'hotelSearch') {
                    // Get location from the API response or find it in conversation
                    let searchLocation = location;

                    if (!searchLocation) {
                        // Find location from previous messages
                        const locationMsg = messages.slice().reverse().find(m => m.location);
                        searchLocation = locationMsg?.location;
                    }

                    if (!searchLocation) {
                        // Try to extract from user's messages
                        // Using passed text if recent
                        const cityMatch = text.match(/(?:hotel in|find hotel in|book hotel in|in)\s+([a-z\s]+)/i);
                        if (cityMatch) {
                            searchLocation = cityMatch[1].trim();
                        } else {
                            // Fallback to history
                            const userMessages = messages.filter(m => m.role === 'user');
                            for (const msg of userMessages.reverse()) {
                                const cityMatch = msg.content.match(/(?:hotel in|find hotel in|book hotel in|in)\s+([a-z\s]+)/i);
                                if (cityMatch) {
                                    searchLocation = cityMatch[1].trim();
                                    break;
                                }
                            }
                        }
                    }

                    const finalLocation = searchLocation || 'Pune';
                    console.log('🔍 Searching hotels in:', finalLocation);

                    const budget = text.toLowerCase();

                    setMessages((prev) => [...prev, {
                        role: 'assistant',
                        content: `Searching for hotels in ${finalLocation}...`,
                        ui: 'loading',
                        intent
                    }])

                    try {
                        // Call hotel search API
                        const hotelResult = await axios.post('/api/search-hotels', {
                            location: finalLocation,
                            budget: budget,
                            checkIn: new Date().toISOString().split('T')[0],
                            checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
                        })

                        console.log('📦 Hotel API response:', hotelResult.data);
                        const hotels = hotelResult.data.hotels || []

                        // Update the loading message with actual results
                        setMessages((prev) => {
                            const updated = [...prev]
                            updated[updated.length - 1] = {
                                role: 'assistant',
                                content: `✅ Found ${hotels.length} hotels in ${finalLocation}! Here are your options:`,
                                ui: 'hotelResults',
                                intent: 'hotel',
                                hotels,
                                location: finalLocation
                            }
                            return updated
                        })

                        if (voiceState.voiceEnabled) {
                            voiceControls.speak(`Found ${hotels.length} hotels in ${finalLocation} within your budget`).catch(() => { })
                        }
                    } catch (error) {
                        console.error('Hotel search error:', error)
                        setMessages((prev) => {
                            const updated = [...prev]
                            updated[updated.length - 1] = {
                                role: 'assistant',
                                content: '❌ Sorry, there was an error searching for hotels. Please try again.',
                                ui: null,
                                intent: 'hotel'
                            }
                            return updated
                        })
                    }
                } else {
                    setMessages((prev) => [...prev, {
                        role: 'assistant',
                        content: resp,
                        ui,
                        intent
                    }])

                    if (voiceState.voiceEnabled && resp) {
                        voiceControls.speak(resp.replace(/\*\*/g, '').replace(/\*/g, '').trim()).catch(() => { })
                    }
                }

                setLoading(false)
                return
            }

            // Handle trip planning flow (existing code)
            if (!isFinal && resp) {
                setMessages((prev) => [...prev, { role: 'assistant', content: resp, ui }])

                // Speak the AI response if voice is enabled
                if (voiceState.voiceEnabled && resp) {
                    // Clean up the response for better speech output
                    const cleanedResp = resp
                        .replace(/\*\*/g, '') // Remove markdown bold
                        .replace(/\*/g, '') // Remove markdown italic
                        .replace(/`/g, '') // Remove code markers
                        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
                        .trim()

                    // Speak the response
                    voiceControls.speak(cleanedResp).catch(err => {
                        console.error('Text-to-speech error:', err)
                    })
                }
            }

            if (trip_plan) {
                const tripId = uuidv4()
                await SaveTripDetail({
                    tripDetail: trip_plan,
                    tripId,
                    uid: userDetail?._id
                })
                setTripId(tripId)
                setTripDetail(trip_plan)
                setTripDetailInfo(trip_plan)
                setIsFinal(false)

                // Learn from this trip for personalization
                try {
                    await learnFromNewTrip(trip_plan)
                    console.log('✅ Trip data learned for personalization')
                } catch (error) {
                    console.error('❌ Error learning from trip:', error)
                }
            }
        } catch (error) {
            console.error('Error fetching AI response:', error)
            setMessages((prev) => [...prev, { role: 'assistant', content: '❌ Something went wrong. Please try again.' }])
        } finally {
            setLoading(false)
        }
    }

    // Keep original onSend for internal input usage
    const onSend = () => triggerSend(userInput);

    const RenderGenerativeUi = (ui?: string | null) => {
        if (!ui) return null;

        switch (ui) {
            case 'budget':
                return <BudgetUi onSelectedOption={(v: string) => { setUserInput(v); triggerSend(v) }} />
            case 'groupSize':
                return <GroupSizeUi onSelectedOption={(v: string) => { setUserInput(v); triggerSend(v) }} />
            case 'tripDuration':
                return <SelectDays onSelectedOption={(v: string) => { setUserInput(v); triggerSend(v) }} />
            case 'hotelBudget':
                return <HotelBudgetUI onSelectedOption={(v: string) => { setUserInput(v); triggerSend(v) }} />
            case 'flightResults':
                // @ts-ignore
                // We don't render it here, we render it in the map loop for full width
                return null;
            case 'final':
                return <FinalUi viewTrip={() => router.push('/view-trip/' + _tripId)} disable={!tripDetail} />
            default:
                return null
        }
    }

    // Detect final step and trigger response once
    useEffect(() => {
        const lastMsg = messages[messages.length - 1]
        if (lastMsg?.ui === 'final' && !isFinal) {
            setIsFinal(true)
            triggerSend('Ok, Great!', true)
        }
    }, [messages, isFinal])

    return (
        <div className='h-full flex flex-col bg-white dark:bg-gray-800'>
            {messages.length === 0 && (
                <div className='flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500'>
                    <div className="max-w-2xl w-full text-center space-y-8">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="bg-blue-600 rounded-2xl p-3 shadow-lg shadow-blue-600/20">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Itinerary Generator</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Let AI create personalized day-by-day travel plans</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-card border border-gray-100 dark:border-gray-800 rounded-[32px] p-10 shadow-xl shadow-blue-900/5">
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mb-2">
                                    <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="space-y-3 max-w-lg">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Your Perfect Itinerary</h2>
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                        Tell us about your trip and we'll generate a detailed day-by-day itinerary with activities, dining, and budget planning
                                    </p>
                                </div>
                                <Button
                                    className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg hover:translate-y-0.5 transition-all shadow-lg shadow-blue-600/20 mt-2"
                                    onClick={() => setUserInput("Help me plan a trip")}
                                >
                                    Start Planning with AI
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <section className='flex-1 overflow-y-auto px-4 py-6 space-y-6'>
                {messages.map((msg, index) => (
                    <React.Fragment key={index}>
                        {/* Regular Message */}
                        {msg.ui !== 'hotelResults' && msg.ui !== 'flightResults' && (
                            <div className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {/* Avatar for AI */}
                                {msg.role === 'assistant' && (
                                    <div className='w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1 border border-blue-200 dark:border-blue-800'>
                                        <Bot className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                                    </div>
                                )}

                                <div className={`max-w-xs lg:max-w-md px-5 py-3.5 shadow-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-white dark:bg-card border border-border/50 text-foreground rounded-2xl rounded-tl-sm'
                                    }`}>
                                    <div className="text-[15px] leading-relaxed">{msg.content}</div>
                                    {RenderGenerativeUi(msg.ui)}
                                </div>

                                {/* Avatar for User */}
                                {msg.role === 'user' && (
                                    <div className='w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1 border border-border'>
                                        <span className='text-xs font-bold text-gray-600 dark:text-gray-300'>YOU</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Hotel Results Display - Full Width */}
                        {msg.ui === 'hotelResults' && msg.hotels && msg.location && (
                            <div className='w-full pl-12 pr-4'>
                                <div className='mb-4 max-w-lg'>
                                    <div className='bg-white dark:bg-card px-5 py-3.5 rounded-2xl rounded-tl-sm border border-border/50 shadow-sm text-foreground'>
                                        <div className="text-[15px] leading-relaxed">{msg.content}</div>
                                    </div>
                                </div>
                                <HotelBookingUI hotels={msg.hotels} location={msg.location} />
                            </div>
                        )}

                        {/* Flight Results Display - Full Width */}
                        {msg.ui === 'flightResults' && msg.flights && (
                            <div className='w-full pl-12 pr-4'>
                                <div className='mb-4 max-w-lg'>
                                    <div className='bg-white dark:bg-card px-5 py-3.5 rounded-2xl rounded-tl-sm border border-border/50 shadow-sm text-foreground'>
                                        <div className="text-[15px] leading-relaxed">{msg.content}</div>
                                    </div>
                                </div>
                                <div className='w-full'>
                                    {/* @ts-ignore */}
                                    <FlightBookingUI flights={msg.flights} route={msg.route || { from: '', to: '' }} budget={msg.budget} />
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}

                {loading && (
                    <div className='flex gap-4 justify-start'>
                        <div className='w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1 border border-blue-200 dark:border-blue-800'>
                            <Bot className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                        </div>
                        <div className='bg-white dark:bg-card text-foreground px-5 py-3.5 rounded-2xl rounded-tl-sm border border-border/50 flex items-center gap-3 shadow-sm'>
                            <Loader className='animate-spin h-4 w-4 text-blue-600' />
                            <span className="text-sm font-medium text-muted-foreground">
                                {userInput.toLowerCase().includes('hotel') ? 'Searching best hotels...' :
                                    userInput.toLowerCase().includes('flight') ? 'Finding live flights...' :
                                        isFinal ? 'Generating your itinerary...' : 'Thinking...'}
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </section>

            {/* Voice Status */}
            {(voiceState.isListening || voiceState.transcript || voiceState.error) && (
                <VoiceStatus
                    isListening={voiceState.isListening}
                    isProcessing={voiceState.isProcessing}
                    transcript={voiceState.transcript}
                    confidence={voiceState.confidence}
                    error={voiceState.error}
                    className="px-4"
                />
            )}

            {/* Input - Conditionally Rendered */}
            {!props.hideInput && (
                <section className='p-4 pb-6 bg-transparent'>
                    <div className='relative bg-white dark:bg-card rounded-2xl shadow-lg border border-border/50 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30'>
                        {/* Voice Response Toggle & Stop Button */}
                        {voiceState.isSupported && (
                            <div className="absolute -top-10 right-0 flex items-center justify-end gap-2 mb-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2 bg-white/80 dark:bg-card/80 backdrop-blur p-1 rounded-full border border-border/50 shadow-sm">
                                    <button
                                        onClick={voiceControls.toggleVoice}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${voiceState.voiceEnabled
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        title={voiceState.voiceEnabled ? 'AI voice replies enabled' : 'Click to enable AI voice replies'}
                                    >
                                        <Volume2 className="h-3.5 w-3.5" />
                                        <span className="font-medium text-[11px]">
                                            {voiceState.voiceEnabled ? 'Voice ON' : 'Voice OFF'}
                                        </span>
                                    </button>
                                    {voiceState.isSpeaking && (
                                        <span className="flex items-center gap-1.5 px-2 text-green-600 dark:text-green-400 font-medium text-[11px]">
                                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                                            Speaking...
                                        </span>
                                    )}
                                </div>

                                {/* Stop Speaking Button */}
                                {voiceState.isSpeaking && (
                                    <button
                                        onClick={voiceControls.stopSpeaking}
                                        className="flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-card border border-red-200 text-red-600 hover:bg-red-50 shadow-sm transition-colors"
                                        title="Stop AI from speaking"
                                    >
                                        <div className="h-2.5 w-2.5 bg-red-500 rounded-[1px]" />
                                    </button>
                                )}
                            </div>
                        )}

                        <Textarea
                            placeholder={
                                voiceState.isListening
                                    ? '🎤 Listening... (Speak now)'
                                    : voiceState.voiceEnabled
                                        ? 'Type or say your plan...'
                                        : 'Ask me anything about your trip...'
                            }
                            className='w-full min-h-[60px] h-16 max-h-40 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-base text-foreground placeholder:text-muted-foreground/50 py-4 pl-4 pr-24 rounded-2xl'
                            onChange={(e) => setUserInput(e.target.value)}
                            value={userInput}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
                            disabled={voiceState.isListening || voiceState.isSpeaking}
                        />

                        {/* Controls Container */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-2">
                            {/* Voice Input Button */}
                            <VoiceMicButton
                                isListening={voiceState.isListening}
                                isProcessing={voiceState.isProcessing}
                                isSupported={voiceState.isSupported}
                                error={voiceState.error}
                                onClick={voiceControls.toggleListening}
                                className=""
                                size="sm"
                                variant="ghost"
                            />

                            {/* Send Button */}
                            <Button
                                size='icon'
                                className={`h-10 w-10 rounded-xl shadow-sm transition-all duration-200 ${!userInput.trim() && !loading
                                    ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                                    }`}
                                onClick={onSend}
                                disabled={loading || voiceState.isListening || voiceState.isSpeaking || (!userInput.trim() && !loading)}
                            >
                                {loading ? <Loader className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
})

ChatBox.displayName = 'ChatBox';
export default ChatBox
