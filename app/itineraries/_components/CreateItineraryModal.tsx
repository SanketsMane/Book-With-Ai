import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreateItineraryModalProps {
    children?: React.ReactNode;
}

function CreateItineraryModal({ children }: CreateItineraryModalProps) {
    const { user } = useUser();
    const router = useRouter();
    const createItinerary = useMutation(api.itineraries.createItinerary);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        city: '',
        country: '',
        startDate: '',
        endDate: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const itineraryId = await createItinerary({
                tripId: undefined, // Add explicit undefined if optional in schema but good to be explicit
                title: formData.title,
                destination: {
                    city: formData.city,
                    country: formData.country,
                },
                startDate: formData.startDate,
                endDate: formData.endDate,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });

            setOpen(false);
            setFormData({ title: '', city: '', country: '', startDate: '', endDate: '' });
            router.push(`/itineraries/${itineraryId}`);
        } catch (error) {
            console.error("Failed to create itinerary:", error);
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
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl gap-2">
                        <Plus className="w-4 h-4" /> New Trip
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle>Create New Trip</DialogTitle>
                    <DialogDescription>
                        Start planning your next adventure.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Trip Title</Label>
                        <Input id="title" name="title" placeholder="Summer in Paris" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" placeholder="Paris" value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" placeholder="France" value={formData.country} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Plan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateItineraryModal
