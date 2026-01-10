"use client"
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Sparkles, Map, TrendingUp, Ticket, Plane, Bell, Award, FileText, Folder, Users, Zap, ArrowUpCircle, Bookmark, MapPin, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Input } from '@/components/ui/input'

export const suggestions = [
    { icon: <Ticket className="w-3 h-3 text-red-500" />, text: "Weekend deals from Delhi" },
    { icon: <TrendingUp className="w-3 h-3 text-yellow-500" />, text: "High-value flights for mile earning" },
    { icon: <Map className="w-3 h-3 text-blue-500" />, text: "Visa-free destinations for Indian passport holders" },
    { icon: <Sparkles className="w-3 h-3 text-purple-500" />, text: "Best time to fly to Dubai" },
    { icon: <Plane className="w-3 h-3 text-sky-500" />, text: "Premium cabin upgrade opportunities" },
]

function Hero() {
    const router = useRouter();

    const onStartPlanning = () => {
        router.push('/create-new-trip')
    }

    const features = [
        {
            title: "My Trips",
            desc: "View upcoming bookings",
            icon: <Plane className="w-6 h-6 text-white" />,
            color: "bg-blue-500",
            path: "/my-trips"
        },
        {
            title: "Price Alerts",
            desc: "Track flight prices",
            icon: <Bell className="w-6 h-6 text-white" />,
            color: "bg-orange-500",
            path: "/price-alerts"
        },
        {
            title: "Explore",
            desc: "Discover destinations",
            icon: <Map className="w-6 h-6 text-white" />,
            color: "bg-green-500",
            path: "/explore"
        },
        {
            title: "Loyalty & Miles",
            desc: "Manage rewards",
            icon: <Award className="w-6 h-6 text-white" />,
            color: "bg-purple-500",
            path: "/loyalty-program"
        },
        {
            title: "Itineraries",
            desc: "AI trip planning",
            icon: <FileText className="w-6 h-6 text-white" />,
            color: "bg-pink-500",
            path: "/create-new-trip"
        },
        {
            title: "Document Vault",
            desc: "Secure storage",
            icon: <Folder className="w-6 h-6 text-white" />,
            color: "bg-cyan-500",
            path: "/documents"
        },
        {
            title: "Group Trips",
            desc: "Plan together",
            icon: <Users className="w-6 h-6 text-white" />,
            color: "bg-orange-600",
            path: "/group-planning"
        },
        {
            title: "Pro Mode",
            desc: "Advanced tools",
            icon: <Zap className="w-6 h-6 text-white" />,
            color: "bg-indigo-500",
            path: "/pro-mode"
        },
        {
            title: "Upgrade Advisor",
            desc: "Smart upgrades",
            icon: <ArrowUpCircle className="w-6 h-6 text-white" />,
            color: "bg-teal-500",
            path: "/upgrades"
        },
        {
            title: "Saved Flights",
            desc: "Your favorites",
            icon: <Bookmark className="w-6 h-6 text-white" />,
            color: "bg-red-500",
            path: "/saved"
        },
        {
            title: "Airport Analyzer",
            desc: "Compare airports",
            icon: <MapPin className="w-6 h-6 text-white" />,
            color: "bg-purple-600",
            path: "/airports"
        },
        {
            title: "AI Memory",
            desc: "Personalization",
            icon: <Brain className="w-6 h-6 text-white" />,
            color: "bg-blue-600",
            path: "/personalization"
        }
    ]

    return (
        <div className='min-h-screen bg-background flex flex-col items-center pt-20 px-4 pb-20'>
            <div className='max-w-6xl w-full text-center space-y-8'>

                {/* Header Section */}
                <div className='space-y-4'>
                    <div className="flex justify-center">
                        <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-sm font-medium gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            AI-Powered Trip Planner v2.0
                        </Badge>
                    </div>

                    <h1 className='text-5xl md:text-7xl font-bold text-foreground tracking-tight'>
                        Your AI Travel Assistant
                    </h1>
                    <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                        Find flights, cruises, and cars with intelligent recommendations
                    </p>
                </div>

                {/* Search Interaction */}
                <div className='max-w-2xl mx-auto relative group'>
                    <div className='absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500'></div>
                    <div className='relative bg-card rounded-2xl shadow-lg border border-border flex items-center p-2'>
                        <Search className='w-6 h-6 text-muted-foreground ml-4' />
                        <Input
                            placeholder='Ask anything: Find flights from Delhi to Dubai next weekend'
                            className='border-none text-lg shadow-none focus-visible:ring-0 h-14 bg-transparent'
                            onClick={onStartPlanning}
                            readOnly
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap items-center justify-center gap-4 pt-4'>
                    <Button size='lg' className='bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 text-base' onClick={onStartPlanning}>
                        <Sparkles className='w-4 h-4 mr-2' />
                        Start with AI
                    </Button>
                    <Button size='lg' variant='outline' className='rounded-full px-8 h-12 text-base' onClick={() => router.push('/explore')}>
                        <Map className='w-4 h-4 mr-2' />
                        Explore Destinations
                    </Button>
                    <Button variant='ghost' className='text-muted-foreground hover:text-foreground' onClick={() => router.push('/price-alerts')}>
                        <TrendingUp className='w-4 h-4 mr-2' />
                        Track Prices
                    </Button>
                </div>

                {/* AI Suggestions Chips */}
                <div className='pt-8 space-y-4'>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        AI-Powered Suggestions
                    </div>
                    <div className='flex flex-wrap justify-center gap-3 max-w-4xl mx-auto'>
                        {suggestions.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border/50 rounded-full text-sm text-muted-foreground transition-colors cursor-pointer border-dashed'>
                                {item.icon}
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <div className='pt-16'>
                    <h2 className='text-2xl font-bold text-foreground mb-8'>Explore All Features</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {features.map((feature, index) => (
                            <div key={index}
                                className='group p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center space-y-4'
                                onClick={() => router.push(feature.path)}
                            >
                                <div className={`p-4 rounded-2xl ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className='font-bold text-lg text-card-foreground'>{feature.title}</h3>
                                    <p className='text-sm text-muted-foreground'>{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero