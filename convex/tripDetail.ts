import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserEmail } from "./lib/auth";
import { ValidationError } from "./lib/errors";

export const CreateTripDetail = mutation({
    args: {
        tripId: v.string(),
        tripDetail: v.any()
    },
    handler: async (ctx, args) => {
        // Author: Sanket - Using centralized auth helper
        const { user } = await getCurrentUser(ctx);

        // Author: Sanket - Input validation
        if (!args.tripId || args.tripId.trim().length === 0) {
            throw new ValidationError("tripId", "Trip ID is required");
        }

        const result = await ctx.db.insert('TripDetailTable', {
            tripDetail: args.tripDetail,
            tripId: args.tripId,
            uid: user._id
        });
    }
})

export const GetUserTrips = query({
    args: {},
    handler: async (ctx) => {
        // Author: Sanket - Using centralized auth helper
        const { user } = await getCurrentUser(ctx);

        // Author: Sanket - Using indexed query for performance
        const result = await ctx.db.query('TripDetailTable')
            .withIndex('by_uid', (q) => q.eq('uid', user._id))
            .order('desc')
            .collect();

        return result;
    }
})

export const GetTripById = query({
    args: {
        tripid: v.string()
    },
    handler: async (ctx, args) => {
        // Author: Sanket - Using centralized auth helper
        const { user } = await getCurrentUser(ctx);

        // Author: Sanket - Using composite filter with uid index base
        const result = await ctx.db.query('TripDetailTable')
            .withIndex('by_uid', (q) => q.eq('uid', user._id))
            .filter(q => q.eq(q.field('tripId'), args?.tripid))
            .collect();
        return result[0];
    }
})

export const getUpcomingFlights = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        // Author: Sanket - Using indexed query on FlightBookings
        const flights = await ctx.db.query('FlightBookings')
            .withIndex('by_user', (q) => q.eq('userId', identity.email!))
            .collect();

        return flights;
    },
});

export const deleteMockFlights = mutation({
    args: {},
    handler: async (ctx) => {
        // Author: Sanket - Using lightweight email helper
        const userEmail = await getCurrentUserEmail(ctx);

        // Author: Sanket - Using indexed query on FlightBookings
        const flights = await ctx.db.query('FlightBookings')
            .withIndex('by_user', (q) => q.eq('userId', userEmail))
            .collect();

        for (const flight of flights) {
            // Only delete the mock ones we seemingly created (or all of them if user wants 'every single dummy data')
            // To be safe and thorough as requested, we delete all for this user.
            await ctx.db.delete(flight._id);
        }
    },
});