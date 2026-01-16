import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all saved flights for a specific user
export const getSavedFlights = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        return await ctx.db
            .query("SavedFlights")
            .withIndex("by_user", (q) => q.eq("userId", identity.email!))
            .order("desc")
            .collect();
    },
});

// Get a single saved flight by ID
export const getSavedFlight = query({
    args: { id: v.id("SavedFlights") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const flight = await ctx.db.get(args.id);
        if (!flight) {
            return null; // Don't throw to avoid UI crashes on missing data
        }

        if (flight.userId !== identity.email) {
            throw new Error("Unauthorized");
        }

        return flight;
    },
});

// Save a new flight
export const saveFlight = mutation({
    args: {
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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const flightId = await ctx.db.insert("SavedFlights", {
            userId: identity.email!,
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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const flight = await ctx.db.get(args.id);
        if (!flight) throw new Error("Flight not found");

        if (flight.userId !== identity.email) throw new Error("Unauthorized");

        await ctx.db.patch(args.id, args.updates);
    },
});

// Delete a saved flight
export const deleteSavedFlight = mutation({
    args: { id: v.id("SavedFlights") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const flight = await ctx.db.get(args.id);
        if (!flight) throw new Error("Flight not found");

        if (flight.userId !== identity.email) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
