import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's group trips
export const getGroupTrips = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        // Query trips where user is the creator
        const ownedTrips = await ctx.db
            .query("GroupTrips")
            .withIndex("by_creator", (q) => q.eq("creatorId", args.userId))
            .collect();

        // In a real app, we'd also query trips where user is a member
        // For MVP, we'll return owned trips. 
        // To do member index properly without array index, we would filter in memory or use a separate mapping table

        return ownedTrips;
    },
});

export const getGroupTrip = query({
    args: { id: v.id("GroupTrips") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new group trip
export const createGroupTrip = mutation({
    args: {
        creatorId: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        destination: v.object({
            city: v.string(),
            country: v.string(),
            coordinates: v.optional(v.object({
                lat: v.number(),
                lng: v.number(),
            })),
        }),
        startDate: v.string(),
        endDate: v.string(),
        budget: v.object({
            total: v.number(),
            currency: v.string(),
            perPerson: v.number(),
            splitMethod: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const tripId = await ctx.db.insert("GroupTrips", {
            creatorId: args.creatorId,
            name: args.name,
            description: args.description,
            destination: args.destination,
            startDate: args.startDate,
            endDate: args.endDate,
            budget: args.budget,
            status: "planning",
            members: [{
                userId: args.creatorId,
                name: "Organizer", // Should be fetched from user profile
                email: "",
                role: "organizer",
                status: "accepted",
                joinedAt: new Date().toISOString(),
                permissions: {
                    canEdit: true,
                    canInvite: true,
                    canManageExpenses: true,
                },
            }],
            expenses: [],
            polls: [],
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return tripId;
    },
});

export const inviteMember = mutation({
    args: {
        tripId: v.id("GroupTrips"),
        email: v.string(),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.get(args.tripId);
        if (!trip) throw new Error("Trip not found");

        const members = trip.members;
        // Check if already invited
        if (members.some(m => m.email === args.email)) {
            throw new Error("Already invited");
        }

        members.push({
            userId: "", // Placeholder until they join
            name: args.email.split('@')[0],
            email: args.email,
            role: args.role,
            status: "invited",
            joinedAt: new Date().toISOString(),
            permissions: {
                canEdit: args.role === "organizer",
                canInvite: args.role === "organizer",
                canManageExpenses: true,
            },
        });

        await ctx.db.patch(args.tripId, { members });
    },
});

// Send chat message
export const sendMessage = mutation({
    args: {
        tripId: v.id("GroupTrips"),
        userId: v.string(),
        userName: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.get(args.tripId);
        if (!trip) throw new Error("Trip not found");

        const messages = trip.messages;
        messages.push({
            id: crypto.randomUUID(),
            userId: args.userId,
            userName: args.userName,
            content: args.content,
            type: "text",
            timestamp: new Date().toISOString(),
        });

        await ctx.db.patch(args.tripId, { messages });
    },
});

// Create poll
export const createPoll = mutation({
    args: {
        tripId: v.id("GroupTrips"),
        createdBy: v.string(),
        question: v.string(),
        options: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.get(args.tripId);
        if (!trip) throw new Error("Trip not found");

        const polls = trip.polls;
        polls.push({
            id: crypto.randomUUID(),
            question: args.question,
            options: args.options.map(opt => ({
                id: crypto.randomUUID(),
                text: opt,
                votes: [],
            })),
            allowMultiple: false,
            createdBy: args.createdBy,
            createdAt: new Date().toISOString(),
            isClosed: false,
        });

        await ctx.db.patch(args.tripId, { polls });
    },
});

// Vote in poll
export const vote = mutation({
    args: {
        tripId: v.id("GroupTrips"),
        pollId: v.string(),
        userId: v.string(),
        optionId: v.string(),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.get(args.tripId);
        if (!trip) throw new Error("Trip not found");

        const polls = trip.polls;
        const poll = polls.find(p => p.id === args.pollId);
        if (!poll) throw new Error("Poll not found");

        const option = poll.options.find(o => o.id === args.optionId);
        if (!option) throw new Error("Option not found");

        // Remove previous vote if single choice
        if (!poll.allowMultiple) {
            poll.options.forEach(opt => {
                opt.votes = opt.votes.filter(id => id !== args.userId);
            });
        }

        if (!option.votes.includes(args.userId)) {
            option.votes.push(args.userId);
        }

        await ctx.db.patch(args.tripId, { polls });
    },
});

// Add expense
export const addExpense = mutation({
    args: {
        tripId: v.id("GroupTrips"),
        description: v.string(),
        amount: v.number(),
        paidBy: v.string(),
        category: v.string(),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.get(args.tripId);
        if (!trip) throw new Error("Trip not found");

        const expenses = trip.expenses;
        expenses.push({
            id: crypto.randomUUID(),
            description: args.description,
            amount: args.amount,
            currency: "USD",
            category: args.category,
            paidBy: args.paidBy,
            date: new Date().toISOString(),
            splitBetween: trip.members.map(m => ({
                userId: m.userId,
                amount: args.amount / trip.members.length,
                isPaid: false,
            })),
            createdAt: new Date().toISOString(),
        });

        await ctx.db.patch(args.tripId, { expenses });
    },
});
