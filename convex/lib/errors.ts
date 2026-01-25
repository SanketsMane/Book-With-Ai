// Author: Sanket
// Centralized error classes for consistent error handling across Convex mutations and queries
// These custom error types allow for better client-side error handling and user-friendly messages

/**
 * Error thrown when a user is not authenticated
 */
export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized: Please sign in to continue") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends Error {
    constructor(resource: string, id?: string) {
        const message = id
            ? `${resource} with id '${id}' not found`
            : `${resource} not found`;
        super(message);
        this.name = "NotFoundError";
    }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends Error {
    constructor(field: string, message: string) {
        super(`${field}: ${message}`);
        this.name = "ValidationError";
    }
}

/**
 * Error thrown when a user doesn't have permission to perform an action
 */
export class ForbiddenError extends Error {
    constructor(message = "You don't have permission to perform this action") {
        super(message);
        this.name = "ForbiddenError";
    }
}
