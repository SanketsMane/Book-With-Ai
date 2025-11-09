'use client'
import React from 'react'
import GlobalMap from './GlobalMap'
import FreeGlobalMap from './FreeGlobalMap'

function SmartMap() {
  // Check if Mapbox API key is available
  const hasMapboxKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY && 
                      process.env.NEXT_PUBLIC_MAPBOX_API_KEY !== ''
  
  // Use free map if no Mapbox key, otherwise use Mapbox
  return (
    <div className="w-full flex justify-center">
      {hasMapboxKey ? (
        <GlobalMap />
      ) : (
        <div className="w-full">
          <div className="mb-2 text-center">
            <p className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
              🆓 Using Free OpenStreetMap (No API key required)
            </p>
          </div>
          <div className="flex justify-center">
            <FreeGlobalMap />
          </div>
        </div>
      )}
    </div>
  )
}

export default SmartMap