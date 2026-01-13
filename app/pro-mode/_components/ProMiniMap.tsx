"use client"
import React from 'react'
import { Map, MapPin } from 'lucide-react'

export default function ProMiniMap() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-1 relative overflow-hidden h-full group">
            {/* Map Placeholder Image/Component */}
            <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 z-0" />

            {/* Mock Map Details */}
            <div className="relative z-10 w-full h-full flex items-center justify-center flex-col gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Map className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Interactive Map View</span>
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm p-3 rounded-xl border border-gray-100 dark:border-gray-700 z-20 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-semibold">Dubai (DXB)</span>
                    </div>
                    <span className="text-[10px] text-gray-500">+3h 30m • 28°C</span>
                </div>
            </div>
        </div>
    )
}
