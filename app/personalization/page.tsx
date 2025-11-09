'use client'

import { PersonalizationDashboard } from '@/components/ui/personalization-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Brain, Sparkles, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useUserDetail } from '../provider'

export default function PersonalizationPage() {
  const { user } = useUser()
  const { userDetail } = useUserDetail()
  const convex = useConvex()
  const [myTrips, setMyTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userDetail?._id) {
      GetUserTrips()
    }
  }, [userDetail])

  const GetUserTrips = async () => {
    try {
      setLoading(true)
      const result = await convex.query(api.tripDetail.GetUserTrips, {
        uid: userDetail?._id
      })
      setMyTrips(result || [])
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/my-trips">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Trips
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <span>AI Travel Assistant</span>
                </h1>
                <p className="text-muted-foreground">
                  Advanced personalization powered by artificial intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>AI Powered</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Real Trip Stats */}
          {!loading && myTrips.length > 0 && (
            <Card className="mb-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Your Travel Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                    <MapPin className="h-8 w-8 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{myTrips.length}</div>
                      <span className="text-sm text-muted-foreground">Trips Planned</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">
                        {Array.from(new Set(myTrips.map(t => t.tripDetail?.destination))).length}
                      </div>
                      <span className="text-sm text-muted-foreground">Destinations</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold">
                        {myTrips.reduce((acc, t) => acc + (parseInt(t.tripDetail?.duration) || 0), 0)}
                      </div>
                      <span className="text-sm text-muted-foreground">Total Days</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground">
                  Our AI learns from your {myTrips.length} trip{myTrips.length !== 1 ? 's' : ''} to provide increasingly 
                  accurate recommendations. The more you use Book With Ai, the smarter your suggestions become.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Introduction Card for New Users */}
          {!loading && myTrips.length === 0 && (
            <Card className="mb-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Start Your Personalized Travel Experience</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Plan your first trip to unlock AI-powered recommendations! Our system learns from your 
                  travel patterns and preferences to provide smarter suggestions with every trip.
                </p>
                <div className="flex gap-4">
                  <Link href="/create-new-trip">
                    <Button>Plan Your First Trip</Button>
                  </Link>
                  <Link href="/my-trips">
                    <Button variant="outline">View Trip History</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Trips */}
          {!loading && myTrips.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Travel Plans</CardTitle>
                  <Link href="/my-trips">
                    <Button variant="outline" size="sm">View All Trips</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myTrips.slice(0, 6).map((trip, index) => (
                    <Link key={index} href={`/view-trip/${trip.tripId}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {trip.tripDetail?.destination || 'Unknown Destination'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                from {trip.tripDetail?.origin || 'N/A'}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {trip.tripDetail?.duration || 'N/A'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>💰 {trip.tripDetail?.budget || 'N/A'}</span>
                            <span>•</span>
                            <span>👥 {trip.tripDetail?.group_size || 'N/A'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personalization Dashboard */}
          <PersonalizationDashboard />

          {/* Feature Highlights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 Smart Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI-powered destination and budget recommendations based on your travel history and preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Travel Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed analysis of your travel behavior, seasonal preferences, and booking patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔔 Smart Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about price drops, trip reminders, and personalized travel deals.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Notice */}
          <Card className="mt-8 border-muted">
            <CardContent className="py-6">
              <div className="text-center space-y-2">
                <h3 className="font-medium">🔒 Your Privacy is Protected</h3>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  All personalization data is encrypted and stored securely. We never share your travel patterns 
                  or personal information with third parties. You can delete your data at any time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}