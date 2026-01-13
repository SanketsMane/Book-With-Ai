import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Fetch all dashboard data for a user
export const getUserDashboard = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("UserTable")
            .filter((q) => q.eq(q.field("email"), args.userId)) // Using email as ID for now based on existing patterns, or lookup by ID if needed. Assuming email/clerk ID mapping.
            // Actually, let's try to find by some consistent ID. The schema implies userId string is used.
            // Let's assume we pass the Clerk ID or email. If we can't find by ID directly (if userId is not _id), we use filter.
            // Best practice: Query by the field you store as userId (e.g. Clerk ID or Email).
            // Looking at user.ts, we store email. But let's assume the frontend passes the right key. 
            // In saved_flights.ts query uses userId: v.string().
            .filter(q => q.eq(q.field("email"), args.userId)) // Fallback to email if that's what we use, or unique field.
            .first();

        // If user not found by email, try to search if userId matches token subject (identity).
        // For simplicity in this demo, we assume userId passed is the unique identifier used across tables.

        // Let's fetch preferences
        const preferences = await ctx.db.query("UserPreferences")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .first();

        // Let's fetch stats
        const flights = await ctx.db.query("SavedFlights")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();

        const itineraries = await ctx.db.query("Itineraries")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();

        // Calculate simplified stats
        const stats = {
            totalTrips: itineraries.length,
            savedFlights: flights.length,
            // Mocking miles calculation for now as we don't store distance yet
            totalMiles: (flights.length * 1250) + (itineraries.length * 3000),
            countriesVisited: new Set(itineraries.map(i => i.destination.country)).size
        };

        // Upcoming Trip (Nearest future date)
        const upcomingTrip = itineraries
            .filter(i => new Date(i.startDate) > new Date())
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

        // Notifications Settings
        const notificationSettings = await ctx.db.query("NotificationPreferences")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .first();

        return {
            user,
            preferences,
            stats,
            upcomingTrip,
            notificationSettings
        };
    },
});

// Update User Profile (Personal Info)
export const updateProfile = mutation({
    args: {
        userId: v.string(), // Use the actual DB ID (_id) if upgrading, or the unique key. 
        // Here we'll expect the frontend to pass the document ID if known, or we query.
        // Let's accept fields to update.
        docId: v.id("UserTable"),
        data: v.object({
            name: v.optional(v.string()),
            phone: v.optional(v.string()),
            dob: v.optional(v.string()),
            country: v.optional(v.string()),
            language: v.optional(v.string()),
            email: v.optional(v.string()), // usually read-only but allowed if changed
        })
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.docId, args.data);
    }
});

// Update Travel Preferences
export const updatePreferences = mutation({
    args: {
        userId: v.string(),
        // We will create if not exists
        preferences: v.object({
            preferredDestinations: v.array(v.string()),
            preferredAirlines: v.array(v.string()),
            homeAirport: v.array(v.string()),
            travelCompanions: v.optional(v.string()),
            preferredCabinClass: v.optional(v.string()),
            preferredBudget: v.object({
                min: v.optional(v.number()),
                max: v.optional(v.number()),
                currency: v.optional(v.string()),
            }),
            inFlight: v.optional(v.object({
                seat: v.string(),
                meal: v.string(),
                layoverTolerance: v.string(),
            })),
            travelStyle: v.optional(v.object({
                type: v.string(),
                pace: v.optional(v.string()),
            })),
            accessibilityNeeds: v.optional(v.string()),
        })
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("UserPreferences")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...args.preferences,
                lastUpdated: new Date().toISOString()
            });
        } else {
            await ctx.db.insert("UserPreferences", {
                userId: args.userId,
                ...args.preferences,
                preferredHotelCategories: [], // Default
                lastUpdated: new Date().toISOString()
            });
        }
    }
});

// Update Notification Preferences
export const updateNotifications = mutation({
    args: {
        userId: v.string(),
        settings: v.object({
            emailNotifications: v.boolean(),
            pushNotifications: v.boolean(),
            smsNotifications: v.boolean(),
            priceAlerts: v.boolean(),
            notificationTime: v.optional(v.string()),
            twoFactorEnabled: v.optional(v.boolean()),
        })
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("NotificationPreferences")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .first();

        const defaults = {
            tripReminders: true,
            weatherAlerts: true,
            dealAlerts: true,
            updatedAt: new Date().toISOString()
        };

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...args.settings,
                updatedAt: new Date().toISOString()
            });
        } else {
            await ctx.db.insert("NotificationPreferences", {
                userId: args.userId,
                ...defaults,
                ...args.settings
            });
        }
    }
});

// Clear AI Memory (Mock for now, would delete vector embeddings in real app)
export const clearAiMemory = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        // Logic to clear history
        const existing = await ctx.db.query("NotificationPreferences")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                aiMemoryStatus: "Cleared"
            });
        }
    }
});
