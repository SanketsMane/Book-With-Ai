import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable: defineTable({
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
        subscription: v.optional(v.string()),
        subscriptionDate: v.optional(v.string()),
        isPremium: v.optional(v.boolean()),
        creditsRemaining: v.optional(v.number()),
        totalCreditsUsed: v.optional(v.number()),
    }),

    TripDetailTable: defineTable({
        tripId: v.string(),
        tripDetail: v.any(),
        uid: v.id('UserTable')
    }),

    // Real-time flight bookings
    FlightBookings: defineTable({
        userId: v.string(),
        bookingId: v.string(),
        flightId: v.string(),
        airline: v.string(),
        flightNumber: v.string(),
        from: v.string(),
        to: v.string(),
        departure: v.string(),
        arrival: v.string(),
        date: v.string(),
        passengers: v.number(),
        totalPrice: v.number(),
        currency: v.string(),
        status: v.string(), // "confirmed", "pending", "cancelled"
        bookingDate: v.string(),
        passengerDetails: v.any(),
    }),

    // Real-time hotel bookings  
    HotelBookings: defineTable({
        userId: v.string(),
        bookingId: v.string(),
        hotelId: v.string(),
        hotelName: v.string(),
        city: v.string(),
        checkIn: v.string(),
        checkOut: v.string(),
        nights: v.number(),
        guests: v.number(),
        roomType: v.string(),
        totalPrice: v.number(),
        currency: v.string(),
        status: v.string(), // "confirmed", "pending", "cancelled"
        bookingDate: v.string(),
        guestDetails: v.any(),
    }),

    // Trip search history and preferences
    SearchHistory: defineTable({
        userId: v.string(),
        searchType: v.string(), // "flight", "hotel", "trip"
        searchData: v.any(),
        searchDate: v.string(),
        results: v.any(),
    }),

    // User preferences for personalized recommendations
    UserPreferences: defineTable({
        userId: v.string(),
        preferredBudget: v.object({
            flight: v.optional(v.number()),
            hotel: v.optional(v.number()),
            total: v.optional(v.number()),
        }),
        preferredDestinations: v.array(v.string()),
        preferredAirlines: v.array(v.string()),
        preferredHotelCategories: v.array(v.string()),
        travelStyle: v.optional(v.string()), // "luxury", "budget", "business", "adventure"
        lastUpdated: v.string(),
    }),

    // Smart notifications and alerts
    Notifications: defineTable({
        userId: v.string(),
        type: v.string(), // "price_alert", "trip_reminder", "weather_alert", "deal_alert"
        title: v.string(),
        message: v.string(),
        data: v.any(), // Additional data for the notification
        isRead: v.boolean(),
        createdAt: v.string(),
        scheduledFor: v.optional(v.string()), // For scheduled notifications
        priority: v.string(), // "low", "medium", "high", "urgent"
        category: v.string(), // "travel", "booking", "alert", "reminder"
    }),

    // Price tracking for flights and hotels
    PriceAlerts: defineTable({
        userId: v.string(),
        alertType: v.string(), // "flight", "hotel"
        searchParams: v.any(), // Original search parameters
        targetPrice: v.optional(v.number()),
        currentPrice: v.number(),
        lowestPrice: v.number(),
        highestPrice: v.number(),
        priceHistory: v.array(v.object({
            price: v.number(),
            date: v.string()
        })),
        isActive: v.boolean(),
        alertFrequency: v.string(), // "instant", "daily", "weekly"
        createdAt: v.string(),
        lastChecked: v.string(),
        notificationSent: v.boolean(),
    }),

    // Trip reminders and planning alerts
    TripReminders: defineTable({
        userId: v.string(),
        tripId: v.string(),
        reminderType: v.string(), // "departure", "checkin", "checkout", "document_check", "packing"
        reminderDate: v.string(),
        isTriggered: v.boolean(),
        customMessage: v.optional(v.string()),
        importance: v.string(), // "low", "medium", "high"
        createdAt: v.string(),
    }),

    // User notification preferences
    NotificationPreferences: defineTable({
        userId: v.string(),
        priceAlerts: v.boolean(),
        tripReminders: v.boolean(),
        weatherAlerts: v.boolean(),
        dealAlerts: v.boolean(),
        pushNotifications: v.boolean(),
        emailNotifications: v.boolean(),
        smsNotifications: v.boolean(),
        alertFrequency: v.string(), // "instant", "daily", "weekly"
        quietHours: v.object({
            enabled: v.boolean(),
            start: v.string(),
            end: v.string(),
        }),
        updatedAt: v.string(),
    })
})