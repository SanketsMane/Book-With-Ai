'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Shield, Users, CreditCard, Settings } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function AdminPage() {
  const { user } = useUser()
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Simple admin check - only allow account owner
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'contactsanket1@gmail.com'

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-500" />
              <span>Access Denied</span>
            </CardTitle>
            <CardDescription>
              You don't have permission to access this admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span>Admin Panel</span>
              </h1>
              <p className="text-muted-foreground">
                Manage Book With Ai application settings and users
              </p>
            </div>
            <Badge variant="default" className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span>Admin Access</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Current Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Your Account:</span>
                    <Badge variant="default">Premium</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Credits:</span>
                    <Badge variant="outline">Unlimited</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">App Status:</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Voice AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Smart Notifications</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Personalization</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" className="w-full" variant="outline" asChild>
                    <a href="/create-new-trip">Test Trip Planning</a>
                  </Button>
                  <Button size="sm" className="w-full" variant="outline" asChild>
                    <a href="/personalization">View AI Dashboard</a>
                  </Button>
                  <Button size="sm" className="w-full" variant="outline" asChild>
                    <a href="/my-trips">Check Trip History</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Information */}
          <Card>
            <CardHeader>
              <CardTitle>✅ Account Upgrade Complete</CardTitle>
              <CardDescription>
                Your account has been successfully upgraded to premium access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Premium Benefits Activated:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Unlimited trip planning requests</li>
                    <li>• Full access to AI-powered features</li>
                    <li>• Voice AI integration with no limits</li>
                    <li>• Smart notifications and personalization</li>
                    <li>• Priority support and advanced features</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Technical Details:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Email: {user?.primaryEmailAddress?.emailAddress}</li>
                    <li>• Status: Premium (bypassed credit system)</li>
                    <li>• Rate Limiting: Disabled for your account</li>
                    <li>• All advanced features: Enabled</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button asChild>
                    <a href="/create-new-trip">Start Planning Trips</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/personalization">Explore AI Features</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Application Status</CardTitle>
              <CardDescription>
                All systems operational with advanced features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Core Systems</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Authentication (Clerk)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Database (Convex)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Model (Gemini)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Maps (OpenStreetMap)</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Advanced Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Voice AI</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Smart Notifications</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Personalization Engine</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Access</span>
                      <Badge variant="default">Unlimited</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}