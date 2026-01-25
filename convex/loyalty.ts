import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLoyaltyPrograms = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        // Author: Sanket - Using indexed query for performance
        return await ctx.db.query("LoyaltyPrograms")
            .withIndex("by_user", (q) => q.eq("userId", identity.email!))
            .collect();
    }
});

export const addLoyaltyProgram = mutation({
    args: {
        programName: v.string(),
        airline: v.string(),
        tier: v.string(),
        memberId: v.string(),
        currentMiles: v.number(),
        progress: v.number(),
        nextTierMiles: v.number(),
        nextTier: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const newProgramId = await ctx.db.insert("LoyaltyPrograms", {
            userId: identity.email!,
            programName: args.programName,
            airline: args.airline,
            tier: args.tier,
            memberId: args.memberId,
            currentMiles: args.currentMiles,
            progress: args.progress,
            nextTierMiles: args.nextTierMiles,
            nextTier: args.nextTier,
        });
        return newProgramId;
    }
});

export const deleteLoyaltyProgram = mutation({
    args: {
        id: v.id("LoyaltyPrograms")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const program = await ctx.db.get(args.id);
        if (!program) throw new Error("Program not found");

        if (program.userId !== identity.email) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    }
});
