import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new notification
export const createNotification = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    scheduledFor: v.optional(v.string()),
    priority: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const notification = await ctx.db.insert("Notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      data: args.data || {},
      isRead: false,
      createdAt: new Date().toISOString(),
      scheduledFor: args.scheduledFor,
      priority: args.priority || "medium",
      category: args.category || "travel",
    });

    return notification;
  },
});

// Get user notifications
export const getUserNotifications = query({
  args: {
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const userId = identity.email!;

    // Author: Sanket - Using indexed query for performance
    let query = ctx.db
      .query("Notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.unreadOnly) {
      query = query.filter((q) => q.eq(q.field("isRead"), false));
    }

    const notifications = await query
      .order("desc")
      .take(args.limit || 20);

    return notifications;
  },
});

// Mark notification as read
export const markNotificationRead = mutation({
  args: {
    notificationId: v.id("Notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
  },
});

// Mark all notifications as read
export const markAllNotificationsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.email!;

    // Author: Sanket - Using indexed composite query
    const notifications = await ctx.db
      .query("Notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("isRead", false))
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      });
    }

    return notifications.length;
  },
});

// Create price alert
export const createPriceAlert = mutation({
  args: {
    userId: v.string(),
    alertType: v.string(),
    searchParams: v.any(),
    targetPrice: v.optional(v.number()),
    currentPrice: v.number(),
    alertFrequency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const priceAlert = await ctx.db.insert("PriceAlerts", {
      userId: args.userId,
      alertType: args.alertType,
      searchParams: args.searchParams,
      targetPrice: args.targetPrice,
      currentPrice: args.currentPrice,
      lowestPrice: args.currentPrice,
      highestPrice: args.currentPrice,
      priceHistory: [{
        price: args.currentPrice,
        date: new Date().toISOString(),
      }],
      isActive: true,
      alertFrequency: args.alertFrequency || "daily",
      createdAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      notificationSent: false,
    });

    return priceAlert;
  },
});

// Update price alert with new price
export const updatePriceAlert = mutation({
  args: {
    alertId: v.id("PriceAlerts"),
    newPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const alert = await ctx.db.get(args.alertId);
    if (!alert) return null;

    const newHistory = [...alert.priceHistory, {
      price: args.newPrice,
      date: new Date().toISOString(),
    }];

    // Keep only last 30 days of history
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const filteredHistory = newHistory.filter(entry => entry.date > thirtyDaysAgo);

    const updated = await ctx.db.patch(args.alertId, {
      currentPrice: args.newPrice,
      lowestPrice: Math.min(alert.lowestPrice, args.newPrice),
      highestPrice: Math.max(alert.highestPrice, args.newPrice),
      priceHistory: filteredHistory,
      lastChecked: new Date().toISOString(),
    });

    // Check if we should send notification
    const shouldNotify = alert.targetPrice ?
      args.newPrice <= alert.targetPrice :
      args.newPrice < alert.lowestPrice;

    if (shouldNotify && !alert.notificationSent) {
      await ctx.db.insert("Notifications", {
        userId: alert.userId,
        type: "price_alert",
        title: `Price Drop Alert!`,
        message: `Price dropped to $${args.newPrice} for your ${alert.alertType} search`,
        data: {
          alertId: args.alertId,
          newPrice: args.newPrice,
          previousPrice: alert.currentPrice,
          searchParams: alert.searchParams,
        },
        isRead: false,
        createdAt: new Date().toISOString(),
        priority: "high",
        category: "alert",
      });

      await ctx.db.patch(args.alertId, {
        notificationSent: true,
      });
    }

    return updated;
  },
});

// Get user price alerts
export const getUserPriceAlerts = query({
  args: {
    userId: v.string(),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Author: Sanket - Using indexed query for performance
    let query = ctx.db
      .query("PriceAlerts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.activeOnly) {
      query = query.filter((q) => q.eq(q.field("isActive"), true));
    }

    const alerts = await query
      .order("desc")
      .collect();

    return alerts;
  },
});

// Create trip reminder
export const createTripReminder = mutation({
  args: {
    userId: v.string(),
    tripId: v.string(),
    reminderType: v.string(),
    reminderDate: v.string(),
    customMessage: v.optional(v.string()),
    importance: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reminder = await ctx.db.insert("TripReminders", {
      userId: args.userId,
      tripId: args.tripId,
      reminderType: args.reminderType,
      reminderDate: args.reminderDate,
      isTriggered: false,
      customMessage: args.customMessage,
      importance: args.importance || "medium",
      createdAt: new Date().toISOString(),
    });

    return reminder;
  },
});

// Get notification preferences
export const getNotificationPreferences = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null; // or default?
    const userId = identity.email!;

    // Author: Sanket - Using indexed query for performance
    const preferences = await ctx.db
      .query("NotificationPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // Return default preferences if none exist
    if (!preferences) {
      return {
        priceAlerts: true,
        tripReminders: true,
        weatherAlerts: true,
        dealAlerts: true,
        pushNotifications: true,
        emailNotifications: false,
        smsNotifications: false,
        alertFrequency: "daily",
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "08:00",
        },
      };
    }

    return preferences;
  },
});

// Update notification preferences
export const updateNotificationPreferences = mutation({
  args: {
    preferences: v.object({
      priceAlerts: v.optional(v.boolean()),
      tripReminders: v.optional(v.boolean()),
      weatherAlerts: v.optional(v.boolean()),
      dealAlerts: v.optional(v.boolean()),
      pushNotifications: v.optional(v.boolean()),
      emailNotifications: v.optional(v.boolean()),
      smsNotifications: v.optional(v.boolean()),
      alertFrequency: v.optional(v.string()),
      quietHours: v.optional(v.object({
        enabled: v.boolean(),
        start: v.string(),
        end: v.string(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.email!;

    // Author: Sanket - Using indexed query for performance
    const existing = await ctx.db
      .query("NotificationPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args.preferences,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await ctx.db.insert("NotificationPreferences", {
        userId: userId,
        priceAlerts: true,
        tripReminders: true,
        weatherAlerts: true,
        dealAlerts: true,
        pushNotifications: true,
        emailNotifications: false,
        smsNotifications: false,
        alertFrequency: "daily",
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "08:00",
        },
        ...args.preferences,
        updatedAt: new Date().toISOString(),
      });
    }
  },
});