import React, { useState, useEffect } from 'react'
import { User, Calendar, Phone, Mail, Globe, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function PersonalInfo({ user, onUpdate }: any) {
    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        dob: user?.dob || '',
        country: user?.country || '',
        language: user?.language || 'English',
        email: user?.email || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                phone: user.phone || '',
                dob: user.dob || '',
                country: user.country || '',
                language: user.language || 'English',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSave = () => {
        onUpdate(formData);
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Personal Information</h3>
                    <p className="text-sm text-gray-500">Your basic information and contact details</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><User className="w-3 h-3 text-gray-400" /> Full Name</Label>
                    <Input value={user?.name || ''} disabled className="bg-gray-50 dark:bg-gray-800" />
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Calendar className="w-3 h-3 text-gray-400" /> Date of Birth</Label>
                    <Input
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        className="bg-white dark:bg-black"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Phone className="w-3 h-3 text-gray-400" /> Phone Number</Label>
                    <div className="flex gap-2">
                        <Input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                        />
                        <Button variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">Verify</Button>
                    </div>
                    <p className="text-xs text-gray-400">Used for booking confirmations and updates</p>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400" /> Email Address</Label>
                    <Input value={formData.email} disabled className="bg-gray-50 dark:bg-gray-800" />
                    <p className="text-xs text-gray-400">Primary contact for all communications</p>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Globe className="w-3 h-3 text-gray-400" /> Country of Residence</Label>
                    <Input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="United States"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MapPin className="w-3 h-3 text-gray-400" /> Preferred Language</Label>
                    <Input
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        placeholder="English"
                    />
                    <p className="text-xs text-gray-400">Used to personalize notifications and AI responses</p>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
            </div>
        </div>
    )
}

export default PersonalInfo
