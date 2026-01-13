import React from 'react'
import { Clock, MapPin, DollarSign, GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ActivityCardProps {
    activity: any;
    onDelete?: () => void;
}

function ActivityCard({ activity, onDelete }: ActivityCardProps) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'transport': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'food': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'accommodation': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    }

    return (
        <div className="flex gap-4 group">
            {/* Time Column */}
            <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white w-12 text-center">{activity.time}</p>
                <div className="w-[1px] h-full bg-gray-200 dark:bg-gray-800 mt-2 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-teal-500"></div>
                </div>
            </div>

            {/* Card Content */}
            <div className="flex-1 pb-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all relative">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge className={`border-none capitalize ${getTypeColor(activity.type)}`}>
                                    {activity.type}
                                </Badge>
                                <h4 className="font-bold text-gray-900 dark:text-white">
                                    {activity.title}
                                </h4>
                            </div>

                            {activity.description && (
                                <p className="text-sm text-gray-500">{activity.description}</p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {activity.location.name}
                                </span>
                                {activity.cost && (
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        {activity.cost.currency} {activity.cost.amount}
                                    </span>
                                )}
                            </div>
                        </div>

                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-500"
                                onClick={onDelete}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityCard
