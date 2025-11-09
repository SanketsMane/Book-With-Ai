"use client"
import React, { useState, useEffect } from 'react'
import { Bell, BellRing, X, Check, AlertCircle, TrendingDown, Calendar, MapPin, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetail } from '@/app/provider'
import { cn } from '@/lib/utils'

interface NotificationData {
  _id: string
  type: string
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
  priority: string
  category: string
}

interface NotificationItemProps {
  notification: NotificationData
  onMarkRead: (id: string) => void
  onDismiss: (id: string) => void
}

function NotificationItem({ notification, onMarkRead, onDismiss }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'price_alert':
        return <TrendingDown className="h-4 w-4 text-green-600" />
      case 'trip_reminder':
        return <Calendar className="h-4 w-4 text-blue-600" />
      case 'weather_alert':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'deal_alert':
        return <MapPin className="h-4 w-4 text-purple-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50'
      case 'high':
        return 'border-l-orange-500 bg-orange-50'
      case 'medium':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-gray-300 bg-gray-50'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className={cn(
      'border-l-4 p-4 rounded-lg transition-all duration-200 hover:shadow-md',
      getPriorityColor(),
      !notification.isRead && 'ring-2 ring-primary/20'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn(
                'font-medium text-sm',
                !notification.isRead && 'font-semibold'
              )}>
                {notification.title}
              </h4>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              )}
              <Badge variant="outline" className="text-xs">
                {notification.priority}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 break-words">
              {notification.message}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatTimeAgo(notification.createdAt)}</span>
              <span>•</span>
              <span className="capitalize">{notification.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkRead(notification._id)}
              className="h-8 w-8 p-0"
              title="Mark as read"
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(notification._id)}
            className="h-8 w-8 p-0"
            title="Dismiss"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Additional action buttons for specific notification types */}
      {notification.type === 'price_alert' && notification.data && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-semibold text-green-600">
              ${notification.data.newPrice}
            </span>
            {notification.data.previousPrice && (
              <>
                <span className="text-muted-foreground">was</span>
                <span className="line-through text-muted-foreground">
                  ${notification.data.previousPrice}
                </span>
              </>
            )}
          </div>
          
          <Button size="sm" className="mt-2" variant="outline">
            View Details
          </Button>
        </div>
      )}
    </div>
  )
}

interface NotificationPreferencesProps {
  preferences: {
    priceAlerts?: boolean
    tripReminders?: boolean
    weatherAlerts?: boolean
    dealAlerts?: boolean
    alertFrequency?: string
  }
  onUpdatePreferences: (preferences: any) => void
}

function NotificationPreferences({ preferences, onUpdatePreferences }: NotificationPreferencesProps) {
  const [localPrefs, setLocalPrefs] = useState(preferences)

  const handleSave = () => {
    onUpdatePreferences(localPrefs)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Notification Types</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Price Alerts</div>
            <div className="text-xs text-muted-foreground">Get notified of price drops</div>
          </div>
          <Switch
            checked={localPrefs.priceAlerts}
            onCheckedChange={(checked) => 
              setLocalPrefs((prev: typeof localPrefs) => ({ ...prev, priceAlerts: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Trip Reminders</div>
            <div className="text-xs text-muted-foreground">Important travel reminders</div>
          </div>
          <Switch
            checked={localPrefs.tripReminders}
            onCheckedChange={(checked) => 
              setLocalPrefs((prev: typeof localPrefs) => ({ ...prev, tripReminders: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Weather Alerts</div>
            <div className="text-xs text-muted-foreground">Weather updates for your trips</div>
          </div>
          <Switch
            checked={localPrefs.weatherAlerts}
            onCheckedChange={(checked) => 
              setLocalPrefs((prev: typeof localPrefs) => ({ ...prev, weatherAlerts: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Deal Alerts</div>
            <div className="text-xs text-muted-foreground">Special offers and deals</div>
          </div>
          <Switch
            checked={localPrefs.dealAlerts}
            onCheckedChange={(checked) => 
              setLocalPrefs((prev: typeof localPrefs) => ({ ...prev, dealAlerts: checked }))
            }
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Alert Frequency</h4>
        
        <Select
          value={localPrefs.alertFrequency}
          onValueChange={(value) => 
            setLocalPrefs((prev: typeof localPrefs) => ({ ...prev, alertFrequency: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instant">Instant</SelectItem>
            <SelectItem value="daily">Daily Summary</SelectItem>
            <SelectItem value="weekly">Weekly Summary</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleSave} className="w-full" size="sm">
        Save Preferences
      </Button>
    </div>
  )
}

export function NotificationCenter() {
  const { userDetail } = useUserDetail()
  const [isOpen, setIsOpen] = useState(false)
  
  // Queries
  const notifications = useQuery(api.notifications.getUserNotifications, 
    userDetail ? { userId: userDetail._id } : "skip"
  )
  
  const unreadNotifications = useQuery(api.notifications.getUserNotifications, 
    userDetail ? { userId: userDetail._id, unreadOnly: true } : "skip"
  )
  
  const preferences = useQuery(api.notifications.getNotificationPreferences,
    userDetail ? { userId: userDetail._id } : "skip"
  )
  
  // Mutations
  const markAsRead = useMutation(api.notifications.markNotificationRead)
  const markAllAsRead = useMutation(api.notifications.markAllNotificationsRead)
  const updatePreferences = useMutation(api.notifications.updateNotificationPreferences)
  
  const unreadCount = unreadNotifications?.length || 0
  
  const handleMarkRead = async (notificationId: string) => {
    await markAsRead({ notificationId: notificationId as any })
  }
  
  const handleDismiss = async (notificationId: string) => {
    await markAsRead({ notificationId: notificationId as any })
  }
  
  const handleMarkAllRead = async () => {
    if (userDetail) {
      await markAllAsRead({ userId: userDetail._id })
    }
  }
  
  const handleUpdatePreferences = async (newPreferences: any) => {
    if (userDetail) {
      await updatePreferences({
        userId: userDetail._id,
        preferences: newPreferences
      })
    }
  }

  if (!userDetail) {
    return null
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Notifications</h2>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                {preferences && (
                  <NotificationPreferences
                    preferences={preferences}
                    onUpdatePreferences={handleUpdatePreferences}
                  />
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {!notifications || notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div className="text-sm">No notifications yet</div>
              <div className="text-xs mt-1">We'll notify you about price drops and trip updates</div>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationCenter