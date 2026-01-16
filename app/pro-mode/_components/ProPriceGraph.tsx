"use client"
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Mon', price: 420 },
    { name: 'Tue', price: 380 },
    { name: 'Wed', price: 350 },
    { name: 'Thu', price: 390 },
    { name: 'Fri', price: 480 },
    { name: 'Sat', price: 550 },
    { name: 'Sun', price: 500 },
];

export default function ProPriceGraph() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Price Trend</h3>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        Runway low • Save $70
                    </p>
                </div>
                <select className="text-xs bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-2 py-1 cursor-pointer outline-none">
                    <option>7 Days</option>
                    <option>30 Days</option>
                </select>
            </div>

            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9CA3AF' }}
                            dy={10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                Tip: Prices are expected to rise by $45 in the next 2 days.
            </div>
        </div>
    )
}
