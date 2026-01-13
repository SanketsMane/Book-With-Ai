import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Loader2, Plus } from 'lucide-react'

interface AddActivityModalProps {
    itineraryId: Id<"Itineraries">;
    dayIndex: number;
    children?: React.ReactNode;
}

function AddActivityModal({ itineraryId, dayIndex, children }: AddActivityModalProps) {
    const addActivity = useMutation(api.itineraries.addActivity);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: 'activity', // activity, food, transport, accommodation
        time: '',
        locationName: '',
        cost: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addActivity({
                itineraryId,
                dayIndex,
                activity: {
                    id: crypto.randomUUID(),
                    title: formData.title,
                    type: formData.type,
                    time: formData.time,
                    description: formData.description,
                    location: {
                        name: formData.locationName,
                    },
                    cost: formData.cost ? {
                        amount: parseFloat(formData.cost),
                        currency: 'USD',
                        isPaid: false
                    } : undefined,
                    attachments: [], // Correctly handling schema requirement
                }
            });
            setOpen(false);
            setFormData({ title: '', type: 'activity', time: '', locationName: '', cost: '', description: '' });
        } catch (error) {
            console.error("Failed to add activity:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm" className="gap-2 rounded-lg border-dashed">
                        <Plus className="w-4 h-4" /> Add Activity
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Visit Eiffel Tower" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            {/* Simple select fallback if Select component has issues, but we have Radix Select dependency installed by default? Check package.json again. 
                                Wait, package.json had @radix-ui/react-select. But I don't have component/ui/select.tsx created.
                                I'll use native select for now to avoid dependency hell or creating another file.
                            */}
                            <select
                                id="type"
                                name="type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="activity">Activity</option>
                                <option value="food">Food</option>
                                <option value="transport">Transport</option>
                                <option value="accommodation">Stay</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locationName">Location</Label>
                        <Input id="locationName" name="locationName" placeholder="Paris, France" value={formData.locationName} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cost">Cost ($)</Label>
                        <Input id="cost" name="cost" type="number" placeholder="Optional" value={formData.cost} onChange={handleChange} />
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Itinerary"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddActivityModal
