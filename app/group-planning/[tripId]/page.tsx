"use client"
import React, { use, useState } from 'react'
import AppSidebar from '../../_components/AppSidebar'
import { Calendar, MapPin, Loader2, ArrowLeft, Users, MessageSquare, DollarSign, Vote, Settings, Share } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from '@clerk/nextjs'
import ChatBoard from '../_components/ChatBoard'
import PollsBoard from '../_components/PollsBoard'
import ExpenseSplitter from '../_components/ExpenseSplitter'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface GroupTripDetailProps {
    params: Promise<{ tripId: string }>;
}

function GroupTripDetail({ params }: GroupTripDetailProps) {
    const { user } = useUser();
    const resolvedParams = use(params);
    const tripId = resolvedParams.tripId as Id<"GroupTrips">;

    const trip = useQuery(api.group_trips.getGroupTrip, { id: tripId });
    const inviteMember = useMutation(api.group_trips.inviteMember);

    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app we would lookup user by email. 
        // For this demo, we'll just simulate inviting by adding a dummy member or just toast.
        // The backend `inviteMember` takes `email`.
        await inviteMember({ tripId, email: inviteEmail, role: 'member' });
        setInviteOpen(false);
        setInviteEmail('');
        alert("Invite sent! (Simulated)");
    }

    if (trip === undefined) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black">
                <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
            </div>
        )
    }

    if (trip === null) {
        return <div className="p-10">Trip not found</div>
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-black font-sans'>
            <AppSidebar />
            <div className="lg:ml-72 min-h-screen">
                {/* Hero Header */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-6xl mx-auto px-8 py-8">
                        <Link href="/group-planning" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Trips
                        </Link>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                                    {trip.name}
                                </h1>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {trip.destination.city}, {trip.destination.country}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Member List Header */}
                                <div className="flex -space-x-2 mr-4">
                                    {trip.members.slice(0, 5).map((m: any, i: number) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden" title={m.name}>
                                            {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m.name[0]}
                                        </div>
                                    ))}
                                </div>

                                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Users className="w-4 h-4" /> Invite
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Invite Friends</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleInvite} className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Email Address</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="friend@example.com"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full bg-pink-600">Send Invite</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Button variant="ghost" size="icon">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-8 py-8">
                    <Tabs defaultValue="chat" className="space-y-6">
                        <TabsList className="bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-800 h-auto">
                            <TabsTrigger value="chat" className="rounded-lg gap-2 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 dark:data-[state=active]:bg-pink-900/20 dark:data-[state=active]:text-pink-400 py-3 px-6">
                                <MessageSquare className="w-4 h-4" /> Chat
                            </TabsTrigger>
                            <TabsTrigger value="polls" className="rounded-lg gap-2 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 dark:data-[state=active]:bg-pink-900/20 dark:data-[state=active]:text-pink-400 py-3 px-6">
                                <Vote className="w-4 h-4" /> Polls
                            </TabsTrigger>
                            <TabsTrigger value="expenses" className="rounded-lg gap-2 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 dark:data-[state=active]:bg-pink-900/20 dark:data-[state=active]:text-pink-400 py-3 px-6">
                                <DollarSign className="w-4 h-4" /> Expenses
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="chat" className="focus-visible:outline-none">
                            <ChatBoard tripId={tripId} />
                        </TabsContent>

                        <TabsContent value="polls" className="focus-visible:outline-none">
                            <PollsBoard tripId={tripId} />
                        </TabsContent>

                        <TabsContent value="expenses" className="focus-visible:outline-none">
                            <ExpenseSplitter tripId={tripId} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default GroupTripDetail
