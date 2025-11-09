"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, User, Send, MapPin } from 'lucide-react'

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Create mailto link with form data
        const subject = encodeURIComponent(formData.subject || 'Contact from Book With Ai')
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)
        const mailtoLink = `mailto:georgeadriel07@gmail.com?subject=${subject}&body=${body}`
        window.location.href = mailtoLink
    }

    const contactDetails = [
        {
            icon: <Mail className="w-6 h-6 text-primary" />,
            label: "Email",
            value: "georgeadriel07@gmail.com",
            link: "mailto:georgeadriel07@gmail.com"
        },
        {
            icon: <Phone className="w-6 h-6 text-primary" />,
            label: "Mobile",
            value: "+91 93198 02478",
            link: "tel:+919319802478"
        },
        {
            icon: <User className="w-6 h-6 text-primary" />,
            label: "Author",
            value: "georgeadriel",
            link: null
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                        Get In <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have questions about your next adventure? We're here to help you plan the perfect trip with our AI-powered travel assistant.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">
                                Contact Information
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Ready to start your journey? Reach out to us and let's make your travel dreams come true.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6">
                            {contactDetails.map((detail, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border">
                                    <div className="flex-shrink-0">
                                        {detail.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-card-foreground">
                                            {detail.label}
                                        </h3>
                                        {detail.link ? (
                                            <a 
                                                href={detail.link}
                                                className="text-primary hover:text-primary/80 transition-colors"
                                            >
                                                {detail.value}
                                            </a>
                                        ) : (
                                            <p className="text-muted-foreground">
                                                {detail.value}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Info */}
                        <div className="bg-primary/10 p-6 rounded-lg border border-border">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center">
                                <MapPin className="w-5 h-5 text-primary mr-2" />
                                Response Time
                            </h3>
                            <p className="text-muted-foreground">
                                We typically respond within 24 hours. For urgent travel assistance, please call us directly.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card p-8 rounded-2xl shadow-xl border border-border">
                        <h2 className="text-3xl font-bold text-card-foreground mb-6">
                            Send us a Message
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground resize-none"
                                    placeholder="Tell us about your travel plans or ask us anything..."
                                    required
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                By submitting this form, you agree to our privacy policy and terms of service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactUs