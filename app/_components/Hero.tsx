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
        <div className='min-h-screen bg-transparent flex flex-col items-center pt-16 px-4 pb-20'>
            <div className='max-w-7xl w-full text-center space-y-10'>

                {/* Header Section */}
                <div className='space-y-6'>
                    <div className="flex justify-center">
                        <Badge variant="secondary" className="px-5 py-2 rounded-full text-sm font-medium gap-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                            </span>
                            AI-Powered Trip Planner v2.0
                        </Badge>
                    </div>

                    <h1 className='text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight'>
                        Your AI Travel Assistant
                    </h1>
                    <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                        Find flights, hotels, and plan entire trips in seconds doing nothing but chatting.
                    </p>
                </div>

                {/* Search Interaction */}
                <div className='max-w-3xl mx-auto relative group'>
                    <div className='absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500'></div>
                    <div className='relative bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 flex items-center p-3 transition-transform hover:scale-[1.01] duration-300'>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Search className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                        </div>
                        <Input
                            placeholder='Ask anything: "Find 3-day trip in Goa under ₹20k"'
                            className='border-none text-lg shadow-none focus-visible:ring-0 h-14 bg-transparent px-4 placeholder:text-muted-foreground/50'
                            onClick={onStartPlanning}
                            readOnly
                        />
                        <Button size="icon" className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={onStartPlanning}>
                            <Sparkles className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap items-center justify-center gap-4 pt-4'>
                    <Button size='lg' className='bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 text-base shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5' onClick={onStartPlanning}>
                        Start Planning
                    </Button>
                    <Button size='lg' variant='outline' className='rounded-full px-8 h-12 text-base border-2 hover:bg-muted/50' onClick={() => router.push('/explore')}>
                        Explore Destinations
                    </Button>
                </div>

                {/* AI Suggestions Chips */}
                <div className='pt-8 space-y-4'>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground/80 lowercase">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                        Suggested Prompts
                    </div>
                    <div className='flex flex-wrap justify-center gap-3 max-w-4xl mx-auto'>
                        {suggestions.map((item, index) => (
                            <div key={index}
                                onClick={onStartPlanning}
                                className='flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-card hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-border rounded-full text-sm font-medium text-muted-foreground hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer shadow-sm hover:shadow'
                            >
                                {item.icon}
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <div className='pt-20 pb-10'>
                    <div className="flex flex-col items-center mb-12">
                        <h2 className='text-3xl font-bold text-foreground mb-4'>Explore All Features</h2>
                        <p className="text-muted-foreground max-w-lg">Everything you need to plan, book, and manage your travels in one place.</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {features.map((feature, index) => (
                            <div key={index}
                                className='group p-6 rounded-3xl border border-border bg-white dark:bg-card hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-start text-left gap-4 h-full'
                                onClick={() => router.push(feature.path)}
                            >
                                <div className={`p-3.5 rounded-2xl ${feature.color.replace('bg-', 'bg-opacity-10 text-').replace('text-white', '')} bg-opacity-10 w-fit group-hover:scale-110 transition-transform duration-300`}>
                                    {/* Map icon color correctly by cloning element to override className, strict UI fix */}
                                    {React.cloneElement(feature.icon as React.ReactElement<any>, {
                                        className: `w-6 h-6 ${feature.color.replace('bg-', 'text-')}`
                                    })}
                                </div>
                                <div>
                                    <h3 className='font-bold text-lg text-foreground mb-1 group-hover:text-blue-600 transition-colors'>{feature.title}</h3>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>{feature.desc}</p>
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