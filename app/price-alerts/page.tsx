"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, TrendingDown, Plane, Plus, Pause, Pencil, ArrowRight, X, Trash2, Play } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetail } from '../provider'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function PriceAlerts() {
    const { userDetail } = useUserDetail();
    const alerts = useQuery(api.price_alerts.getAlerts);
    const addAlert = useMutation(api.price_alerts.addAlert);
    const deleteAlert = useMutation(api.price_alerts.deleteAlert);
    const toggleAlert = useMutation(api.price_alerts.toggleAlertStatus);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        airline: '',
        targetPrice: '',
        date: ''
    });

    const handleAddAlert = async () => {
        if (!userDetail) return;

        // Mocking some internal logic for the demo
        const currentPrice = Number(formData.targetPrice) * 1.1; // Make it slightly higher so it's interesting
        const mockHistory = Array.from({ length: 10 }, (_, i) => ({
            price: currentPrice * (0.8 + Math.random() * 0.4),
            date: new Date().toISOString()
        }));

        await addAlert({
            alertType: 'flight',
            searchParams: {
                from: formData.from,
                to: formData.to,
                airline: formData.airline,
                date: formData.date
            },
            targetPrice: Number(formData.targetPrice),
            currentPrice: currentPrice,
            lowestPrice: currentPrice * 0.9,
            highestPrice: currentPrice * 1.2,
            priceHistory: mockHistory,
            isActive: true,
            alertFrequency: 'daily',
            createdAt: new Date().toISOString(),
            lastChecked: new Date().toISOString(),
            notificationSent: false
        });

        setIsAddOpen(false);
        setFormData({ from: '', to: '', airline: '', targetPrice: '', date: '' });
    };

    return (
        <div className='bg-gray-50 dark:bg-black min-h-screen relative'>
            <div className='max-w-6xl mx-auto px-6 py-10 space-y-8'>
                {/* Page Header */}
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white'>
                            Smart Price Alerts
                        </h1>
                        <p className='text-gray-500 dark:text-gray-400 mt-1'>
                            Track flight prices and get notified of the best deals
                        </p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-11 shadow-lg shadow-blue-600/20'>
                        <Plus className='w-4 h-4 mr-2' />
                        Add Alert
                    </Button>
                </div>

                {/* AI Prediction Banner */}
                <div className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900 rounded-3xl p-6 relative overflow-hidden shadow-sm'>
                    <div className='absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16'></div>
                    <div className='flex gap-5 items-start relative z-10'>
                        <div className='p-3.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 shrink-0'>
                            <TrendingDown className='w-6 h-6 text-white' />
                        </div>
                        <div>
                            <h3 className='text-lg font-bold text-blue-900 dark:text-blue-100 mb-2'>AI Price Prediction</h3>
                            <p className='text-blue-800 dark:text-blue-300 leading-relaxed max-w-4xl text-base'>
                                Prices for <span className='font-semibold'>tracked destinations</span> are expected to fluctuate. We recommend monitoring trends closely this week.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alerts List */}
                <div className='space-y-6'>
                    {alerts?.map((alert, index) => {
                        const trend = alert.currentPrice < alert.priceHistory[0]?.price ? '-5%' : '+2%'; // Simple calc
                        return (
                            <div key={index} className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 group'>
                                {/* Card Header */}
                                <div className='flex justify-between items-start mb-8'>
                                    <div className='flex gap-5'>
                                        <div className='p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl group-hover:scale-105 transition-transform duration-300'>
                                            <Bell className='w-6 h-6 text-orange-500 dark:text-orange-400' />
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white'>
                                                {alert.searchParams.from}
                                                <ArrowRight className='w-4 h-4 text-gray-400' />
                                                {alert.searchParams.to}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{alert.searchParams.airline || 'Any Airline'}</span>
                                                <span className="text-sm text-gray-400">•</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{alert.searchParams.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className='bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider'>
                                        {alert.isActive ? 'Active' : 'Paused'}
                                    </Badge>
                                </div>

                                <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 mb-8'>
                                    {/* Stats */}
                                    <div className='space-y-6 col-span-1'>
                                        <div>
                                            <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-1'>Current Price</p>
                                            <p className='text-3xl font-bold text-gray-900 dark:text-white'>₹{alert.currentPrice.toLocaleString()}</p>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <p className='text-xs font-medium text-gray-500 mb-1'>Lowest Tracked</p>
                                                <p className='font-semibold text-green-600 dark:text-green-400'>₹{alert.lowestPrice.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs font-medium text-gray-500 mb-1'>Price Trend</p>
                                                <p className={`font-semibold ${trend.startsWith('-') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {trend}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Graph Visualization (Mock) */}
                                    <div className='col-span-2 flex items-end gap-3 h-32 pb-1 border-b border-gray-100 dark:border-gray-800 pt-4'>
                                        {alert.priceHistory.map((item, i) => {
                                            const height = Math.min(100, Math.max(10, (item.price / alert.highestPrice) * 100));
                                            return (
                                                <div key={i}
                                                    className={`flex-1 rounded-t-lg transition-all duration-500 relative group/bar hover:opacity-90 ${i === alert.priceHistory.length - 1 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-100 dark:bg-gray-800'}`}
                                                    style={{ height: `${height}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                        ₹{item.price.toLocaleString()}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className='flex flex-wrap gap-3 pt-2'>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className='gap-2 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 h-9 font-medium'
                                        onClick={() => toggleAlert({ id: alert._id, isActive: !alert.isActive })}
                                    >
                                        {alert.isActive ? <Pause className='w-3.5 h-3.5' /> : <Play className='w-3.5 h-3.5' />}
                                        {alert.isActive ? 'Pause Alert' : 'Resume Alert'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className='gap-2 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:text-gray-300 h-9 font-medium'
                                        onClick={() => deleteAlert({ id: alert._id })}
                                    >
                                        <Trash2 className='w-3.5 h-3.5' />
                                        Delete
                                    </Button>
                                    <div className='flex-1'></div>
                                    <Button size="sm" className='gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 font-medium'>
                                        View Flights
                                        <ArrowRight className='w-3.5 h-3.5' />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}

                    {(!alerts || alerts.length === 0) && (
                        <div className="col-span-full py-20 text-center text-gray-500 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                            <TrendingDown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p>No price alerts active. Create one to start saving!</p>
                        </div>
                    )}
                </div>

                {/* Add Alert Modal Overlay */}
                {isAddOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                            <Button
                                onClick={() => setIsAddOpen(false)}
                                className="absolute top-4 right-4 p-2 h-auto text-gray-500 hover:text-black bg-transparent hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                            <h2 className="text-xl font-bold mb-4">Create Price Alert</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="From (e.g., DEL)"
                                        value={formData.from}
                                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                    />
                                    <Input
                                        placeholder="To (e.g., DXB)"
                                        value={formData.to}
                                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                    />
                                </div>
                                <Input
                                    placeholder="Airline (Optional)"
                                    value={formData.airline}
                                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                                />
                                <Input
                                    placeholder="Travel Dates"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Target Price (₹)"
                                    value={formData.targetPrice}
                                    onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                                />
                                <Button onClick={handleAddAlert} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                                    Start Tracking
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PriceAlerts
