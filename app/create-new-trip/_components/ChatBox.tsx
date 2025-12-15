"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send, Volume2 } from 'lucide-react'
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

function ChatBox() {
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
                        onSend()
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
            setUserInput(query)
            // Auto-send after a short delay to ensure component is ready
            setTimeout(() => {
                const newMsg: Message = {
                    role: 'user',
                    content: query
                }
                setMessages([newMsg])
                setLoading(true)
                
                axios.post('/api/aimodel', {
                    messages: [newMsg],
                    isFinal: false
                }).then((result) => {
                    const { resp, ui, intent } = result.data || {}
                    setMessages((prev) => [...prev, { 
                        role: 'assistant', 
                        content: resp, 
                        ui,
                        intent 
                    }])
                    
                    if (voiceState.voiceEnabled && resp) {
                        voiceControls.speak(resp.replace(/\*\*/g, '').replace(/\*/g, '').trim()).catch(() => {})
                    }
                }).catch((error) => {
                    console.error('Error:', error)
                    setMessages((prev) => [...prev, { 
                        role: 'assistant', 
                        content: '❌ Something went wrong. Please try again.' 
                    }])
                }).finally(() => {
                    setLoading(false)
                    setUserInput('')
                })
            }, 500)
        }
    }, [searchParams, initialQueryProcessed, messages.length, voiceState.voiceEnabled, voiceControls])

    const onSend = async () => {
        if (!userInput.trim()) return

        const newMsg: Message = {
            role: 'user',
            content: userInput
        }

        setMessages((prev) => [...prev, newMsg])
        setUserInput('')
        setLoading(true)

        try {
            const result = await axios.post('/api/aimodel', {
                messages: [...messages, newMsg],
                isFinal
            })

            const { resp, ui, trip_plan, intent, location } = result.data || {}

            // Handle hotel booking flow
            if (intent === 'hotel') {
                if (ui === 'hotelBudget') {
                    // Store location from API response
                    const hotelLocation = location || userInput.trim();
                    
                    setMessages((prev) => [...prev, { 
                        role: 'assistant', 
                        content: resp, 
                        ui,
                        intent,
                        location: hotelLocation
                    }])
                    
                    if (voiceState.voiceEnabled && resp) {
                        voiceControls.speak(resp.replace(/\*\*/g, '').replace(/\*/g, '').trim()).catch(() => {})
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
                        const userMessages = messages.filter(m => m.role === 'user');
                        for (const msg of userMessages.reverse()) {
                            const cityMatch = msg.content.match(/(?:hotel in|find hotel in|book hotel in|in)\s+([a-z\s]+)/i);
                            if (cityMatch) {
                                searchLocation = cityMatch[1].trim();
                                break;
                            }
                        }
                    }
                    
                    const finalLocation = searchLocation || 'Pune';
                    console.log('🔍 Searching hotels in:', finalLocation);
                    
                    const budget = userInput.toLowerCase();
                    
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
                            voiceControls.speak(`Found ${hotels.length} hotels in ${finalLocation} within your budget`).catch(() => {})
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
                        voiceControls.speak(resp.replace(/\*\*/g, '').replace(/\*/g, '').trim()).catch(() => {})
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

    const RenderGenerativeUi = (ui?: string | null) => {
        if (!ui) return null;
        
        switch (ui) {
            case 'budget':
                return <BudgetUi onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
            case 'groupSize':
                return <GroupSizeUi onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
            case 'tripDuration':
                return <SelectDays onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
            case 'hotelBudget':
                return <HotelBudgetUI onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
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
            setUserInput('Ok, Great!')
        }
    }, [messages, isFinal])

    // Auto-send confirmation message only once
    useEffect(() => {
        if (isFinal && userInput) {
            const timeout = setTimeout(onSend, 300) // debounce to avoid duplicate call
            return () => clearTimeout(timeout)
        }
    }, [isFinal, userInput])

    return (
        <div className='h-[85vh] flex flex-col border border-border shadow-lg rounded-2xl p-5 bg-card'>
            {messages.length === 0 && (
                <EmptyBoxState onSelectOption={(v: string) => { setUserInput(v); onSend() }} />
            )}

            {/* Messages */}
            <section className='flex-1 overflow-y-auto p-4 space-y-3'>
                {messages.map((msg, index) => (
                    <React.Fragment key={index}>
                        {/* Regular Message */}
                        {msg.ui !== 'hotelResults' && (
                            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-lg px-4 py-3 rounded-lg shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-muted text-muted-foreground border border-border'
                                }`}>
                                    <div className="text-sm leading-relaxed">{msg.content}</div>
                                    {RenderGenerativeUi(msg.ui)}
                                </div>
                            </div>
                        )}

                        {/* Hotel Results Display - Full Width */}
                        {msg.ui === 'hotelResults' && msg.hotels && msg.location && (
                            <div className='w-full'>
                                <div className='flex justify-start mb-2'>
                                    <div className='max-w-lg px-4 py-3 rounded-lg shadow-sm bg-muted text-muted-foreground border border-border'>
                                        <div className="text-sm leading-relaxed">{msg.content}</div>
                                    </div>
                                </div>
                                <HotelBookingUI hotels={msg.hotels} location={msg.location} />
                            </div>
                        )}
                    </React.Fragment>
                ))}

                {loading && (
                    <div className='flex justify-start'>
                        <div className='max-w-lg bg-muted text-muted-foreground px-4 py-3 rounded-lg flex items-center gap-2 border border-border shadow-sm'>
                            <Loader className='animate-spin h-4 w-4 text-primary' /> 
                            <span className="text-sm">
                              {userInput.toLowerCase().includes('hotel') ? 'Searching real-time hotels...' :
                               userInput.toLowerCase().includes('flight') ? 'Finding live flights...' :
                               isFinal ? 'Generating your trip plan...' : 'Thinking...'}
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

            {/* Smart Suggestions - Only show when starting a new conversation */}
            {messages.length === 0 && hasData && (
                <div className="px-4 pb-4">
                    <SmartSuggestions
                        currentDestination={currentTripData.destination}
                        currentBudget={currentTripData.budget}
                        currentDays={currentTripData.days}
                        currentGroupSize={currentTripData.groupSize}
                        onSuggestionApply={(type, value) => {
                            if (type === 'destination') {
                                setCurrentTripData(prev => ({ ...prev, destination: value }))
                                setUserInput(`I want to travel to ${value}`)
                            } else if (type === 'budget') {
                                setCurrentTripData(prev => ({ ...prev, budget: value }))
                                setUserInput(`My budget is $${value}`)
                            } else if (type === 'groupSize') {
                                setCurrentTripData(prev => ({ ...prev, groupSize: value }))
                                setUserInput(`Group size: ${value}`)
                            }
                        }}
                    />
                </div>
            )}

            {/* Input */}
            <section>
                <div className='border border-border rounded-2xl p-4 relative bg-background shadow-sm'>
                    {/* Voice Response Toggle & Stop Button */}
                    {voiceState.isSupported && (
                        <div className="flex items-center justify-between gap-2 mb-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={voiceControls.toggleVoice}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                                        voiceState.voiceEnabled 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                                            : 'bg-muted hover:bg-muted/80'
                                    }`}
                                    title={voiceState.voiceEnabled ? 'AI voice replies enabled' : 'Click to enable AI voice replies'}
                                >
                                    <Volume2 className="h-3 w-3" />
                                    <span className="font-medium">
                                        {voiceState.voiceEnabled ? '🔊 AI Voice ON' : '🔇 AI Voice OFF'}
                                    </span>
                                </button>
                                {voiceState.isSpeaking && (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                        Speaking...
                                    </span>
                                )}
                            </div>
                            
                            {/* Stop Speaking Button */}
                            {voiceState.isSpeaking && (
                                <button
                                    onClick={voiceControls.stopSpeaking}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors font-medium"
                                    title="Stop AI from speaking"
                                >
                                    <Volume2 className="h-4 w-4" />
                                    Stop
                                </button>
                            )}
                        </div>
                    )}
                    
                    <Textarea
                        placeholder={
                            voiceState.isListening 
                                ? '🎤 Listening... Speak now or type your message' 
                                : voiceState.error && voiceState.error.includes('network')
                                ? 'Voice temporarily unavailable - please type your travel plans here...'
                                : voiceState.error
                                ? 'Type your travel plans here (voice input unavailable)...'
                                : voiceState.voiceEnabled
                                ? '🎤 Speak or type your dream trip... (AI will reply with voice)'
                                : '✍️ Describe your dream trip or use the voice button...'
                        }
                        className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-foreground placeholder:text-muted-foreground pr-20'
                        onChange={(e) => setUserInput(e.target.value)}
                        value={userInput}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
                        disabled={voiceState.isListening || voiceState.isSpeaking}
                    />
                    
                    {/* Voice Input Button */}
                    <VoiceMicButton
                        isListening={voiceState.isListening}
                        isProcessing={voiceState.isProcessing}
                        isSupported={voiceState.isSupported}
                        error={voiceState.error}
                        onClick={voiceControls.toggleListening}
                        className="absolute bottom-6 right-16"
                        size="md"
                        variant="ghost"
                    />
                    
                    {/* Send Button */}
                    <Button 
                        size='icon' 
                        className='absolute bottom-6 right-6 shadow-md' 
                        onClick={onSend} 
                        disabled={loading || voiceState.isListening || voiceState.isSpeaking}
                    >
                        <Send className='h-4 w-4' />
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default ChatBox
