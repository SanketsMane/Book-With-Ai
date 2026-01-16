import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateTripDetail = mutation({
    args: {
        tripId: v.string(),
        tripDetail: v.any()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db.query('UserTable')
            .filter(q => q.eq(q.field('email'), identity.email))
            .first();

        if (!user) throw new Error("User not found");

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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db.query('UserTable')
            .filter(q => q.eq(q.field('email'), identity.email))
            .first();

        if (!user) return [];

        const result = await ctx.db.query('TripDetailTable')
            .filter(q => q.eq(q.field('uid'), user._id))
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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db.query('UserTable')
            .filter(q => q.eq(q.field('email'), identity.email))
            .first();

        if (!user) throw new Error("User not found");

        const result = await ctx.db.query('TripDetailTable')
            .filter(q => q.and(
                q.eq(q.field('uid'), user._id),
                q.eq(q.field('tripId'), args?.tripid)
            ))
            .collect();
        return result[0];
    }
})