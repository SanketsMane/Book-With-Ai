import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all itineraries for a user
export const getItineraries = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("Itineraries")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

// Get single itinerary
export const getItinerary = query({
    args: { id: v.id("Itineraries") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create new itinerary
export const createItinerary = mutation({
    args: {
        userId: v.string(),
        tripId: v.optional(v.id("TripDetailTable")),
        title: v.string(),
        description: v.optional(v.string()),
        destination: v.object({
            city: v.string(),
            country: v.string(),
            coordinates: v.optional(v.object({
                lat: v.number(),
                lng: v.number(),
            })),
        }),
        startDate: v.string(),
        endDate: v.string(),
        timezone: v.string(),
    },
    handler: async (ctx, args) => {
        const days = [];
        const start = new Date(args.startDate);
        const end = new Date(args.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        for (let i = 0; i < diffDays; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);
            days.push({
                day: i + 1,
                date: currentDate.toISOString().split('T')[0],
                activities: [],
            });
        }

        const itineraryId = await ctx.db.insert("Itineraries", {
            userId: args.userId,
            tripId: args.tripId,
            title: args.title,
            description: args.description,
            destination: args.destination,
            startDate: args.startDate,
            endDate: args.endDate,
            timezone: args.timezone,
            status: "draft",
            visibility: "private",
            collaborators: [],
            days: days,
            budget: {
                total: 0,
                spent: 0,
                currency: "USD",
                breakdown: {
                    flights: 0,
                    accommodation: 0,
                    activities: 0,
                    food: 0,
                    transport: 0,
                    other: 0,
                },
            },
            documentIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return itineraryId;
    },
});

// Add activity to itinerary
export const addActivity = mutation({
    args: {
        itineraryId: v.id("Itineraries"),
        dayIndex: v.number(), // 0-based index of day array
        activity: v.object({
            id: v.string(),
            time: v.string(),
            endTime: v.optional(v.string()), // Added matching schema
            title: v.string(),
            type: v.string(),
            category: v.optional(v.string()), // Added matching schema
            description: v.optional(v.string()),
            location: v.object({
                name: v.string(),
                address: v.optional(v.string()), // Added matching schema
                coordinates: v.optional(v.object({
                    lat: v.number(),
                    lng: v.number(),
                })),
            }),
            cost: v.optional(v.object({
                amount: v.number(),
                currency: v.string(),
                isPaid: v.boolean(),
            })),
            bookingInfo: v.optional(v.object({ // Added matching schema
                confirmationNumber: v.string(),
                status: v.string(),
                documentId: v.optional(v.id("Documents")),
            })),
            notes: v.optional(v.string()), // Added matching schema
            attachments: v.optional(v.array(v.string())), // Added matching schema
        }),
    },
    handler: async (ctx, args) => {
        const itinerary = await ctx.db.get(args.itineraryId);
        if (!itinerary) throw new Error("Itinerary not found");

        const days = itinerary.days;
        if (args.dayIndex < 0 || args.dayIndex >= days.length) {
            throw new Error("Invalid day index");
        }

        // Ensure robust object construction matching schema
        const newActivity = {
            ...args.activity,
            attachments: args.activity.attachments || [],
        };

        days[args.dayIndex].activities.push(newActivity);

        // Update budget if cost exists
        const budget = itinerary.budget;
        if (args.activity.cost) {
            budget.spent += args.activity.cost.amount;
        }

        await ctx.db.patch(args.itineraryId, {
            days: days,
            budget: budget,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete activity
export const deleteActivity = mutation({
    args: {
        itineraryId: v.id("Itineraries"),
        dayIndex: v.number(),
        activityId: v.string(),
    },
    handler: async (ctx, args) => {
        const itinerary = await ctx.db.get(args.itineraryId);
        if (!itinerary) throw new Error("Itinerary not found");

        const days = itinerary.days;
        const day = days[args.dayIndex];
        const activityIndex = day.activities.findIndex(a => a.id === args.activityId);

        if (activityIndex === -1) throw new Error("Activity not found");

        const activity = day.activities[activityIndex];

        // Remove activity
        day.activities.splice(activityIndex, 1);

        // Update budget
        const budget = itinerary.budget;
        if (activity.cost) {
            budget.spent -= activity.cost.amount;
        }

        await ctx.db.patch(args.itineraryId, {
            days: days,
            budget: budget,
            updatedAt: new Date().toISOString(),
        });
    },
});

export const deleteItinerary = mutation({
    args: { id: v.id("Itineraries") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
