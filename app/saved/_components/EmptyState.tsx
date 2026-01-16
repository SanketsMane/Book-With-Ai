import React from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
    onAddClick: () => void;
}

function EmptyState({ onAddClick }: EmptyStateProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No saved flights yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Start tracking flight prices and save interesting options here to compare them later.
            </p>
            <Button onClick={onAddClick} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-4">
                Find Flights
            </Button>
        </div>
    )
}

export default EmptyState
