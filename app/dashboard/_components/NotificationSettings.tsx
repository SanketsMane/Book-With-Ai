import React, { useState, useEffect } from 'react'
import { Bell, Mail, MessageSquare, Smartphone, Shield, Lock, Trash2, AlertTriangle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function NotificationSettings({ settings, onUpdate, onClearMemory }: any) {
    const [data, setData] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        priceAlerts: true,
        twoFactorEnabled: true,
    });

    useEffect(() => {
        if (settings) {
            setData({
                emailNotifications: settings.emailNotifications ?? true,
                pushNotifications: settings.pushNotifications ?? true,
                smsNotifications: settings.smsNotifications ?? false,
                priceAlerts: settings.priceAlerts ?? true,
                twoFactorEnabled: settings.twoFactorEnabled ?? true,
            });
        }
    }, [settings]);

    const handleToggle = (key: string) => {
        const newData = { ...data, [key]: !data[key as keyof typeof data] };
        setData(newData);
        onUpdate(newData);
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mt-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications & AI Settings</h3>
                        <p className="text-sm text-gray-500">Manage how you receive updates</p>
                    </div>
                </div>

                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Notification Channels</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-semibold text-sm">Email Notifications</p>
                                <p className="text-xs text-gray-500">Booking confirmations and updates</p>
                            </div>
                        </div>
                        <Switch checked={data.emailNotifications} onCheckedChange={() => handleToggle('emailNotifications')} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-semibold text-sm">Price Alerts</p>
                                <p className="text-xs text-gray-500">Get notified of price drops</p>
                            </div>
                        </div>
                        <Switch checked={data.priceAlerts} onCheckedChange={() => handleToggle('priceAlerts')} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-semibold text-sm">WhatsApp/SMS Updates</p>
                                <p className="text-xs text-gray-500">Real-time travel updates</p>
                            </div>
                        </div>
                        <Switch checked={data.smsNotifications} onCheckedChange={() => handleToggle('smsNotifications')} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Privacy & Security</h3>
                        <p className="text-sm text-gray-500">Manage your data and account security</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-green-500" />
                            <div>
                                <p className="font-semibold text-sm">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-500">Add an extra layer of security</p>
                            </div>
                        </div>
                        <Switch checked={data.twoFactorEnabled} onCheckedChange={() => handleToggle('twoFactorEnabled')} />
                    </div>

                    {data.twoFactorEnabled && (
                        <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg flex gap-2">
                            <Shield className="w-4 h-4" />
                            Two-factor authentication is enabled. Your account is protected.
                        </div>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4" />

                    <div>
                        <h4 className="font-bold text-sm mb-3">Data Management</h4>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium">Download Your Data</p>
                                <p className="text-xs text-gray-500">Export all your personal information and travel history</p>
                            </div>
                            <Button variant="outline" size="sm">Download</Button>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" /> Clear AI Memory
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">AI will forget your search history and personalization data</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-200 hover:bg-yellow-100" onClick={onClearMemory}>
                                Clear
                            </Button>
                        </div>
                    </div>

                    <div className="border-t border-red-100 dark:border-red-900/30 pt-4">
                        <p className="flex items-center gap-2 text-red-600 font-bold text-sm mb-2"><AlertTriangle className="w-4 h-4" /> Danger Zone</p>
                        <Button variant="destructive" size="sm" className="w-full">Delete Account</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationSettings
