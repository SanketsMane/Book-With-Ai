import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Admin function to upgrade user account to premium
export const upgradeUserToPremium = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Secure Admin Check - Allow only specific email
    const ADMIN_EMAIL = 'contactsanket1@gmail.com';
    if (identity.email !== ADMIN_EMAIL) {
      throw new Error('Unauthorized admin access');
    }

    // Find user by email
    const user = await ctx.db.query('UserTable')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Update user with premium subscription
    await ctx.db.patch(user._id, {
      subscription: 'premium',
      subscriptionDate: new Date().toISOString(),
      creditsRemaining: 1000, // Give generous credits
      isPremium: true
    });

    return {
      success: true,
      message: `User ${args.email} upgraded to premium`,
      userId: user._id
    };
  }
});

// Query to check user premium status
export const getUserPremiumStatus = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('UserTable')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();

    if (!user) {
      return { found: false };
    }

    return {
      found: true,
      email: user.email,
      subscription: user.subscription || 'free',
      isPremium: user.isPremium || false,
      creditsRemaining: user.creditsRemaining || 0
    };
  }
});

// Reset user credits (admin function)
export const resetUserCredits = mutation({
  args: {
    email: v.string(),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Secure Admin Check
    const ADMIN_EMAIL = 'contactsanket1@gmail.com';
    if (identity.email !== ADMIN_EMAIL) {
      throw new Error('Unauthorized admin access');
    }

    const user = await ctx.db.query('UserTable')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(user._id, {
      creditsRemaining: args.credits
    });

    return {
      success: true,
      message: `User ${args.email} credits set to ${args.credits}`
    };
  }
});