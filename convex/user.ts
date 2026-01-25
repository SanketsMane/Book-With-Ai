import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ArrowBigLeft } from "lucide-react";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        imageUrl: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // If User already exist?
        // Author: Sanket - Using indexed query for performance
        const user = await ctx.db.query('UserTable')
            .withIndex('by_email', (q) => q.eq('email', identity.email!))
            .collect();

        if (user?.length == 0) {
            const userData = {
                name: args.name,
                email: identity.email!,
                imageUrl: args.imageUrl
            }
            //If Not then create New user
            const userId = await ctx.db.insert('UserTable', userData);
            return { ...userData, _id: userId };
        }

        return user[0];

    }
})