// Author: Sanket
// Centralized authentication helpers to avoid repetitive user lookup code
// This reduces duplication and makes auth checks consistent across all functions

import { QueryCtx, MutationCtx } from "../_generated/server";
import { UnauthorizedError, NotFoundError } from "./errors";

/**
 * Gets the current authenticated user from the database
 * Throws UnauthorizedError if not authenticated
 * Throws NotFoundError if user doesn't exist in database
 * 
 * @returns Object containing user record and identity information
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
    // Check if user is authenticated via Clerk
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new UnauthorizedError();
    }

    // Look up user in database using indexed query
    const user = await ctx.db
        .query('UserTable')
        .withIndex('by_email', (q) => q.eq('email', identity.email!))
        .first();

    if (!user) {
        throw new NotFoundError("User profile");
    }

    return { user, identity };
}

/**
 * Gets the current user's email (lighter weight than getCurrentUser)
 * Throws UnauthorizedError if not authenticated
 * 
 * @returns User's email address
 */
export async function getCurrentUserEmail(ctx: QueryCtx | MutationCtx): Promise<string> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.email) {
        throw new UnauthorizedError();
    }
    return identity.email;
}
