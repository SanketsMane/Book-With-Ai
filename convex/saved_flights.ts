import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all saved flights for a specific user
export const getSavedFlights = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("SavedFlights")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

// Get a single saved flight by ID
export const getSavedFlight = query({
    args: { id: v.id("SavedFlights") },
    handler: async (ctx, args) => {
        const flight = await ctx.db.get(args.id);
        if (!flight) {
            throw new Error("Flight not found");
        }
        return flight;
    },
});

// Save a new flight
export const saveFlight = mutation({
    args: {
        userId: v.string(),
        searchParams: v.object({
            from: v.string(),
            to: v.string(),
            departureDate: v.string(),
            returnDate: v.optional(v.string()),
            passengers: v.object({
                adults: v.number(),
                children: v.number(),
                infants: v.number(),
            }),
            class: v.string(),
            tripType: v.string(),
        }),
        flightDetails: v.object({
            outbound: v.object({
                airline: v.string(),
                flightNumber: v.string(),
                departure: v.string(),
                arrival: v.string(),
                duration: v.string(),
                stops: v.number(),
                aircraft: v.optional(v.string()),
            }),
            inbound: v.optional(v.object({
                airline: v.string(),
                flightNumber: v.string(),
                departure: v.string(),
                arrival: v.string(),
                duration: v.string(),
                stops: v.number(),
                aircraft: v.optional(v.string()),
            })),
        }),
        pricing: v.object({
            amount: v.number(),
            currency: v.string(),
            pricePerPerson: v.number(),
            taxes: v.number(),
            fees: v.number(),
        }),
        title: v.optional(v.string()),
        notes: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        isPriceTracked: v.boolean(),
    },
    handler: async (ctx, args) => {
        const flightId = await ctx.db.insert("SavedFlights", {
            userId: args.userId,
            searchParams: args.searchParams,
            flightDetails: args.flightDetails,
            pricing: args.pricing,
            title: args.title || `${args.searchParams.from} to ${args.searchParams.to}`,
            notes: args.notes,
            tags: args.tags || [],
            isPriceTracked: args.isPriceTracked,
            savedAt: new Date().toISOString(),
        });
        return flightId;
    },
});

// Update saved flight (notes, tags, etc.)
export const updateSavedFlight = mutation({
    args: {
        id: v.id("SavedFlights"),
        updates: v.object({
            title: v.optional(v.string()),
            notes: v.optional(v.string()),
            tags: v.optional(v.array(v.string())),
            isPriceTracked: v.optional(v.boolean()),
        }),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});

// Delete a saved flight
export const deleteSavedFlight = mutation({
    args: { id: v.id("SavedFlights") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
