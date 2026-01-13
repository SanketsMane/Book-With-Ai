"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Award, Lightbulb, Plane, Plus, TrendingUp, X, Trash2 } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetail } from '../provider'
import { useState } from 'react'
import { Input } from '@/components/ui/input' // Assuming Input is available

function LoyaltyProgram() {
    const { userDetail } = useUserDetail();
    const loyaltyPrograms = useQuery(api.loyalty.getLoyaltyPrograms, {
        userId: userDetail?._id || ''
    });
    const addProgram = useMutation(api.loyalty.addLoyaltyProgram);
    const deleteProgram = useMutation(api.loyalty.deleteLoyaltyProgram);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        programName: '',
        airline: '',
        tier: '',
        memberId: '',
        currentMiles: 0,
        nextTier: 'Gold', // Default or calc
        nextTierMiles: 5000 // Default or calc
    });

    const handleAddProgram = async () => {
        if (!userDetail) return;
        await addProgram({
            userId: userDetail._id,
            programName: formData.programName,
            airline: formData.airline,
            tier: formData.tier,
            memberId: formData.memberId,
            currentMiles: Number(formData.currentMiles),
            progress: (Number(formData.currentMiles) / (Number(formData.currentMiles) + Number(formData.nextTierMiles))) * 100, // Simple calc
            nextTierMiles: Number(formData.nextTierMiles),
            nextTier: formData.nextTier
        });
        setIsAddOpen(false);
        setFormData({ programName: '', airline: '', tier: '', memberId: '', currentMiles: 0, nextTier: 'Gold', nextTierMiles: 5000 });
    };

    return (
        <div className='bg-gray-50 dark:bg-black min-h-screen relative'>
            <div className="p-8 md:p-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loyalty & Miles</h1>
                            <p className="text-gray-500 dark:text-gray-400">Track your rewards and status</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} variant="outline" className="bg-white hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 gap-2 rounded-xl">
                        <Plus className="w-4 h-4" />
                        Add Program
                    </Button>
                </div>

                {/* Loyalty Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {loyaltyPrograms?.map((program, index) => (
                        <Card key={index} className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                            <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">{program.airline}</h3>
                                            <p className="text-sm text-muted-foreground">{program.programName}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            {program.tier}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => deleteProgram({ id: program._id })}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-muted-foreground mb-1">Member Number</p>
                                    <p className="font-mono text-lg font-semibold tracking-wide">{program.memberId}</p>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Current Miles</span>
                                        <div className="text-right">
                                            <span className="text-xs text-muted-foreground">Next Tier</span>
                                            <p className="font-semibold text-yellow-600">{program.nextTier}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-foreground">{program.currentMiles.toLocaleString()}</span>
                                    </div>
                                    <Progress value={program.progress} className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-red-600" />
                                    <p className="text-xs text-muted-foreground mt-1">{program.nextTierMiles.toLocaleString()} miles to {program.nextTier}</p>
                                </div>

                                <Button variant="ghost" className="w-full justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <TrendingUp className="w-4 h-4" />
                                    View Earning Opportunities
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {(!loyaltyPrograms || loyaltyPrograms.length === 0) && (
                        <div className="col-span-full py-10 text-center text-gray-500">
                            No loyalty programs added yet. Click "Add Program" to start tracking.
                        </div>
                    )}
                </div>

                {/* AI Insight Card */}
                <div className="bg-blue-600 dark:bg-blue-900 rounded-3xl p-1 relative overflow-hidden shadow-lg shadow-blue-900/20">
                    <div className="bg-white dark:bg-gray-900/95 rounded-[20px] p-6 relative z-10">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center shrink-0">
                                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                    AI Travel Insight
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full uppercase tracking-wide font-bold">New</span>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    You could earn <span className="font-bold text-blue-600 dark:text-blue-400">+1,200 miles on {loyaltyPrograms?.[0]?.airline || 'your next trip'}</span> with your upcoming bookings. Consider booking through alliance partners.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-20"></div>
                </div>

                {/* Add Program Modal Overlay */}
                {isAddOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                            <Button
                                onClick={() => setIsAddOpen(false)}
                                className="absolute top-4 right-4 p-2 h-auto text-gray-500 hover:text-black bg-transparent hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                            <h2 className="text-xl font-bold mb-4">Add Loyalty Program</h2>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Airline (e.g., Emirates)"
                                    value={formData.airline}
                                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                                />
                                <Input
                                    placeholder="Program Name (e.g., Skywards)"
                                    value={formData.programName}
                                    onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                                />
                                <Input
                                    placeholder="Member ID"
                                    value={formData.memberId}
                                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Current Tier (e.g., Silver)"
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Next Tier (e.g., Gold)"
                                        value={formData.nextTier}
                                        onChange={(e) => setFormData({ ...formData, nextTier: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="number"
                                        placeholder="Current Miles"
                                        value={formData.currentMiles}
                                        onChange={(e) => setFormData({ ...formData, currentMiles: Number(e.target.value) })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Miles needed for next tier"
                                        value={formData.nextTierMiles}
                                        onChange={(e) => setFormData({ ...formData, nextTierMiles: Number(e.target.value) })}
                                    />
                                </div>
                                <Button onClick={handleAddProgram} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                                    Save Program
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoyaltyProgram
