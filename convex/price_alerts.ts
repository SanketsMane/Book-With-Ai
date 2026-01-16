import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAlerts = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        return await ctx.db.query("PriceAlerts")
            .filter(q => q.eq(q.field("userId"), identity.email!))
            .collect();
    }
});

export const addAlert = mutation({
    args: {
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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const newAlertId = await ctx.db.insert("PriceAlerts", {
            userId: identity.email!,
            ...args
        });
        return newAlertId;
    }
});

export const deleteAlert = mutation({
    args: {
        id: v.id("PriceAlerts")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const alert = await ctx.db.get(args.id);
        if (!alert) throw new Error("Alert not found");

        if (alert.userId !== identity.email) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    }
});

export const toggleAlertStatus = mutation({
    args: {
        id: v.id("PriceAlerts"),
        isActive: v.boolean()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const alert = await ctx.db.get(args.id);
        if (!alert) throw new Error("Alert not found");

        if (alert.userId !== identity.email) throw new Error("Unauthorized");

        await ctx.db.patch(args.id, { isActive: args.isActive });
    }
});
