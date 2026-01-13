import React, { useState } from 'react'
import { MapPin, Award, Plane, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ProfileHeader({ user, stats, onUpdate }: any) {
    const [editOpen, setEditOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        location: user?.location || '',
    });

    const handleSave = () => {
        onUpdate(formData);
        setEditOpen(false);
    }

    return (
        <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
            {/* Background Pattern (Optional) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 p-1">
                        <img
                            src={user?.imageUrl || "https://github.com/shadcn.png"}
                            alt={user?.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
                        <p className="text-blue-100 text-sm mb-2">{user?.email}</p>
                        <div className="flex items-center gap-2 text-xs text-blue-200">
                            <MapPin className="w-3 h-3" />
                            <span>{user?.location || "Location not set"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Stats Cards (Mini) */}
                    <div className="flex items-center gap-6 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <div>
                            <p className="text-xs text-blue-200">Saved Trips</p>
                            <div className="font-bold text-lg flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {stats?.savedFlights || 0}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div>
                            <p className="text-xs text-blue-200">Loyalty Programs</p>
                            <div className="font-bold text-lg flex items-center gap-1">
                                <Award className="w-4 h-4" /> {stats?.totalTrips || 0}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div>
                            <p className="text-xs text-blue-200">Total Miles</p>
                            <div className="font-bold text-lg flex items-center gap-1">
                                <Plane className="w-4 h-4" /> {stats?.totalMiles?.toLocaleString() || 0}
                            </div>
                        </div>
                    </div>

                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="New York, USA"
                                    />
                                </div>
                                <Button onClick={handleSave} className="w-full bg-blue-600">Save Changes</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
