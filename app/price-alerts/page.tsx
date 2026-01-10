"use client"
import React from 'react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, TrendingDown, Plane, Plus, Pause, Pencil, ArrowRight } from 'lucide-react'

function PriceAlerts() {
    const alerts = [
        {
            from: "Delhi",
            to: "Dubai",
            airline: "Emirates",
            flightNo: "EK 501",
            date: "Dec 20-27",
            currentPrice: "₹18,500",
            lowestTracked: "₹16,200",
            trend: "-12%",
            status: "Active",
            history: [40, 60, 45, 30, 50, 65, 55, 40, 35, 20] // Mock height data
        },
        {
            from: "Mumbai",
            to: "London",
            airline: "British Airways",
            flightNo: "BA 107",
            date: "Jan 5-15",
            currentPrice: "₹42,000",
            lowestTracked: "₹38,500",
            trend: "+5%",
            status: "Active",
            history: [30, 35, 40, 45, 50, 55, 60, 55, 50, 55]
        }
    ]

    return (
        <div className='bg-background min-h-screen'>


            <div className='max-w-5xl mx-auto px-4 py-8 space-y-8'>
                {/* Page Header */}
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-3xl font-bold flex items-center gap-2'>
                            Smart Price Alerts
                        </h1>
                        <p className='text-muted-foreground mt-1'>
                            Track flight prices and get notified of the best deals
                        </p>
                    </div>
                    <Button className='bg-primary text-primary-foreground'>
                        <Plus className='w-4 h-4 mr-2' />
                        Add Alert
                    </Button>
                </div>

                {/* AI Prediction Banner */}
                <div className='bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-6 relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16'></div>
                    <div className='flex gap-4 items-start relative z-10'>
                        <div className='p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20'>
                            <TrendingDown className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h3 className='text-lg font-bold text-blue-900 dark:text-blue-100 mb-2'>AI Price Prediction</h3>
                            <p className='text-blue-700 dark:text-blue-300 leading-relaxed max-w-3xl'>
                                Prices for <span className='font-semibold'>Delhi → Dubai</span> are expected to drop by <span className='font-bold text-blue-600 dark:text-blue-200'>12% next week</span> based on historical trends. We recommend waiting 3-5 days before booking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alerts List */}
                <div className='space-y-6'>
                    {alerts.map((alert, index) => (
                        <div key={index} className='bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'>
                            {/* Card Header */}
                            <div className='flex justify-between items-start mb-6'>
                                <div className='flex gap-4'>
                                    <div className='p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full'>
                                        <Bell className='w-6 h-6 text-orange-600 dark:text-orange-400' />
                                    </div>
                                    <div>
                                        <h3 className='text-xl font-bold flex items-center gap-2'>
                                            {alert.from}
                                            <ArrowRight className='w-4 h-4 text-muted-foreground' />
                                            {alert.to}
                                        </h3>
                                        <p className='text-muted-foreground text-sm mt-1'>
                                            {alert.airline} • {alert.date}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className='bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 px-3 py-1'>
                                    {alert.status}
                                </Badge>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
                                {/* Stats */}
                                <div className='space-y-4 col-span-1'>
                                    <div>
                                        <p className='text-sm text-muted-foreground'>Current Price</p>
                                        <p className='text-2xl font-bold'>{alert.currentPrice}</p>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <div>
                                            <p className='text-xs text-muted-foreground'>Lowest Tracked</p>
                                            <p className='font-semibold text-green-600'>{alert.lowestTracked}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-muted-foreground'>Price Trend</p>
                                            <p className={`font-semibold ${alert.trend.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                                                {alert.trend}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Graph Visualization (Mock) */}
                                <div className='col-span-2 flex items-end gap-2 h-24 pb-2 border-b border-border/50'>
                                    {alert.history.map((height, i) => (
                                        <div key={i}
                                            className={`flex-1 rounded-t-sm transition-all hover:opacity-80 ${i === alert.history.length - 1 ? 'bg-primary' : 'bg-muted'}`}
                                            style={{ height: `${height}%` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='flex flex-wrap gap-3'>
                                <Button variant="outline" size="sm" className='gap-2'>
                                    <Pause className='w-3.5 h-3.5' />
                                    Pause Alert
                                </Button>
                                <Button variant="outline" size="sm" className='gap-2'>
                                    <Pencil className='w-3.5 h-3.5' />
                                    Edit Alert
                                </Button>
                                <div className='flex-1'></div>
                                <Button size="sm" className='gap-2'>
                                    View Flights
                                    <ArrowRight className='w-3.5 h-3.5' />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PriceAlerts
