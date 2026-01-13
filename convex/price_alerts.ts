import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAlerts = query({
    args: {
        userId: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("PriceAlerts")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();
    }
});

export const addAlert = mutation({
    args: {
        userId: v.string(),
        alertType: v.string(), // "flight", "hotel"
        searchParams: v.any(), // Store raw scratch params
        targetPrice: v.optional(v.number()),
        currentPrice: v.number(),
        lowestPrice: v.number(),
        highestPrice: v.number(),
        priceHistory: v.array(v.object({
            price: v.number(),
            date: v.string()
        })),
        isActive: v.boolean(),
        alertFrequency: v.string(),
        createdAt: v.string(),
        lastChecked: v.string(),
        notificationSent: v.boolean(),
    },
    handler: async (ctx, args) => {
        const newAlertId = await ctx.db.insert("PriceAlerts", args);
        return newAlertId;
    }
});

export const deleteAlert = mutation({
    args: {
        id: v.id("PriceAlerts")
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const toggleAlertStatus = mutation({
    args: {
        id: v.id("PriceAlerts"),
        isActive: v.boolean()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isActive: args.isActive });
    }
});
