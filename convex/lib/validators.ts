// Author: Sanket
// Validation helper functions for input validation across Convex mutations
// Prevents invalid data from being inserted into the database

/**
 * Validates email format using standard regex
 */
export function validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates that start date is before end date
 */
export function validateDateRange(start: string, end: string): boolean {
    try {
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return false;
        }

        return startDate < endDate;
    } catch {
        return false;
    }
}

/**
 * Validates budget is within reasonable range
 */
export function validateBudget(amount: number): boolean {
    return typeof amount === 'number' &&
        amount > 0 &&
        amount < 10000000 &&
        !isNaN(amount);
}

/**
 * Validates number of travelers
 */
export function validateTravelers(count: number): boolean {
    return typeof count === 'number' &&
        count > 0 &&
        count <= 50 &&
        Number.isInteger(count);
}

/**
 * Validates phone number format (basic validation)
 */
export function validatePhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return true; // Optional field
    // Basic check: 10-15 digits with optional + and spaces/dashes
    return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$/.test(phone);
}

/**
 * Validates URL format
 */
export function validateUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
