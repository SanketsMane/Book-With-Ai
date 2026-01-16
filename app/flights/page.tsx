"use client"
import React, { useState } from 'react'
import AppSidebar from '../_components/AppSidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plane, Calendar, TrendingUp, Map, Mic, Send, Lightbulb, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useUser } from '@clerk/nextjs'

// We will keep the ChatBox for future logic integration, 
// but for the UI redesign, we'll build the visual shell first.
const DynamicChatBox = dynamic(() => import('../create-new-trip/_components/ChatBox'), { ssr: false })

function Flights() {
    const { user } = useUser();
    const [inputValue, setInputValue] = useState("");
    const [chatStarted, setChatStarted] = useState(false);
    const chatRef = React.useRef<any>(null);

    const handleSend = (text: string = inputValue) => {
        if (!text.trim()) return;
        setChatStarted(true);
        // Small delay to ensure ChatBox is mounted if it wasn't
        setTimeout(() => {
            chatRef.current?.sendMessage(text);
        }, 100);
        setInputValue("");
    };

    const actionChips = [
        { icon: <Plane className="w-4 h-4" />, label: "Find Flights", query: "Find me flights from Mumbai to Delhi" },
        { icon: <Calendar className="w-4 h-4" />, label: "Plan Trip", query: "Plan a 3 day trip to Goa" },
        { icon: <TrendingUp className="w-4 h-4" />, label: "Track Prices", query: "Track flight prices for New York" },
        { icon: <Map className="w-4 h-4" />, label: "Explore Destinations", query: "Suggest best places to visit in December" },
    ]

    return (
        <div className='min-h-screen bg-white dark:bg-black font-sans'>
            <AppSidebar />

            {/* Main Content Area */}
            <div className="lg:ml-72 min-h-screen relative flex flex-col">

                {/* Mobile Header Placeholder */}
                <div className="lg:hidden p-4 flex items-center gap-2 border-b">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                    <span className="font-bold">Book With Ai</span>
                </div>

                {/* Content Wrapper */}
                <div className="flex-1 flex flex-col overflow-hidden relative">

                    {/* HERO SECTION (Shown when chat hasn't started) */}
                    {!chatStarted && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full space-y-12 transition-opacity duration-500">
                            {/* Brand / Hero Section */}
                            <div className="text-center space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
                                <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 mb-6">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    Your AI Travel Assistant
                                </h1>

                                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                                    Ask anything to find flights, plan trips, or track prices.
                                </p>
                            </div>

                            {/* Travel Tip */}
                            <div className="animate-in fade-in duration-1000 slide-in-from-bottom-8 delay-150">
                                <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3 hover:scale-105 transition-transform cursor-default">
                                    <Lightbulb className="w-5 h-5" />
                                    <span className="font-medium text-sm tracking-wide uppercase">Travel Tip</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl text-center max-w-xl mx-auto shadow-sm hover:shadow-md transition-all">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Travel hack: Incognito mode can sometimes show lower flight prices.</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything to get help with your travel-related query.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CHAT INTERFACE (Shown when chat starts) */}
                    <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-500 ${chatStarted ? 'opacity-100 z-10' : 'opacity-0 absolute inset-0 -z-10'}`}>
                        {/* We use a key to force re-render if needed, but display none/block logic via state is safer for layout */}
                        <DynamicChatBox ref={chatRef} hideInput={true} />
                    </div>

                </div>

                {/* Bottom Input Section */}
                <div className="p-6 md:p-10 w-full max-w-4xl mx-auto mt-auto shrink-0 z-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">

                    {/* Action Chips */}
                    {!chatStarted && (
                        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-in fade-in duration-700 delay-300">
                            {actionChips.map((chip, index) => (
                                <button key={index}
                                    onClick={() => handleSend(chip.query)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all shadow-sm hover:shadow-md">
                                    {chip.icon}
                                    <span>{chip.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Bar */}
                    <div className="relative group animate-in fade-in duration-700 delay-500">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-25 group-hover:opacity-50 blur transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 p-2 pl-6 transition-all focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/30">
                            <span className="text-gray-400 mr-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Message Book With Ai..."
                                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 h-12 text-lg"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <div className="flex items-center gap-2 pr-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                    <Mic className="w-5 h-5" />
                                </button>
                                <Button size="icon" onClick={() => handleSend()} className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Send className="w-4 h-4 ml-0.5" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-center mt-4 text-xs text-gray-400 dark:text-gray-500">
                            By messaging Book With Ai, you agree to our <a href="#" className="underline hover:text-gray-600">Terms</a> and have read our <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
                        </div>
                    </div>
                </div>

                {/* Floating Feedback Button */}
                <div className="fixed bottom-6 right-6 z-50">
                    <button className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                        <span className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center text-[10px] font-bold">!</span>
                        Report Issue
                    </button>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">?</button>
                </div>

            </div>
        </div>
    )
}

export default Flights
