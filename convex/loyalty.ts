import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLoyaltyPrograms = query({
    args: {
        userId: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("LoyaltyPrograms")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();
    }
});

export const addLoyaltyProgram = mutation({
    args: {
        userId: v.string(),
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
        const newProgramId = await ctx.db.insert("LoyaltyPrograms", {
            userId: args.userId,
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
        await ctx.db.delete(args.id);
    }
});
