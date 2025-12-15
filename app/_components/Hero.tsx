"use client"
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { ArrowDown, Globe2, Landmark, Plane, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useVoiceConversation } from '@/hooks/use-voice-conversation'
import { VoiceMicButton } from '@/components/ui/voice-components'


export const suggestions = [
    {
        title: 'Create New Trip',
        icon: <Globe2 className='text-blue-400 h-5 w-5' />
    },
    {
        title: 'Inspire me where to go',
        icon: <Plane className='text-green-500 h-5 w-5' />
    },
    {
        title: 'Discover Hidden gems',
        icon: <Landmark className='text-orange-500 h-5 w-5' />
    },
    {
        title: 'Adventure Destination',
        icon: <Globe2 className='text-yellow-600 h-5 w-5' />
    }
]

function Hero() {

    const { user } = useUser();
    const router = useRouter();
    const [userInput, setUserInput] = useState<string>('');

    // Voice Conversation Integration
    const [voiceState, voiceControls] = useVoiceConversation({
        continuous: true,
        interimResults: true,
        language: 'en-US',
        voiceEnabled: false,
        onResult: (transcript: string, confidence: number) => {
            if (transcript.length > 3) {
                setUserInput(transcript)
            }
        },
        onError: (error: string) => {
            if (error.includes('Failed to start') || error.includes('Speech recognition error')) {
                console.error('Voice AI Error:', error)
            }
        },
        maxDuration: 30000,
        autoSend: false
    })

    const onSend = () => {
        if (!user) {
            router.push('/sign-in')
            return;
        }
        // Navigate to Create Trip Planner with the user's input as query parameter
        if (userInput.trim()) {
            router.push(`/create-new-trip?query=${encodeURIComponent(userInput)}`)
        } else {
            router.push('/create-new-trip')
        }
    }

    return (
        <div className='mt-24 w-full flex justify-center bg-gradient-to-b from-background to-muted/20'>
            {/* Content  */}
            <div className='max-w-3xl w-full text-center space-y-6 px-4'>
                <h1 className='text-xl md:text-5xl font-bold text-foreground'>
                    Hey, I'm your personal <span className='text-primary'>Trip Planner</span>
                </h1>
                <p className='text-lg text-muted-foreground'>
                    Tell me what you want, and I'll handle the rest: Flights, Hotels, trip Planner - all in seconds
                </p>
                {/* Input Box  */}
                <div>
                    <div className='border border-border rounded-2xl p-4 relative bg-card shadow-sm hover:shadow-md transition-shadow'>
                        <Textarea 
                            placeholder={
                                voiceState.isListening 
                                    ? '🎤 Listening... Speak now or type your travel plans' 
                                    : 'Create a trip for Paris from New York'
                            }
                            className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-foreground placeholder:text-muted-foreground pr-24'
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            disabled={voiceState.isListening}
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
                        
                        <Button 
                            size={'icon'} 
                            className='absolute bottom-6 right-6' 
                            onClick={() => onSend()}
                            disabled={voiceState.isListening}
                        >
                            <Send className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
                {/* Suggestion list  */}
                <div className='flex flex-wrap gap-3 justify-center'>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className='flex items-center gap-2 border border-border
                        rounded-full p-3 cursor-pointer hover:bg-primary hover:text-primary-foreground 
                        bg-card text-card-foreground transition-all duration-200 hover:scale-105 
                        hover:shadow-md'>
                            {suggestion.icon}
                            <h2 className='text-sm font-medium'>{suggestion.title}</h2>
                        </div>
                    ))}
                </div>

                <div className='flex items-center justify-center flex-col'>
                    <h2 className='my-7 mt-14 flex gap-2 text-center text-foreground items-center'>
                        Not Sure where to start? 
                        <strong className='text-primary'>See how it works</strong> 
                        <ArrowDown className='h-5 w-5 text-muted-foreground animate-bounce' /> 
                    </h2>

                    {/* Video Section  */}
                    <HeroVideoDialog
                        className="rounded-xl shadow-lg border border-border"
                        animationStyle="from-center"
                        videoSrc="https://youtu.be/sXRDL-EPtrM"
                        thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
                        thumbnailAlt="Book With Ai Demo Video"
                    />
                </div>
            </div>
        </div>
    )
}

export default Hero