import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user documents
export const getDocuments = query({
    args: {
        folder: v.optional(v.string()),
        documentType: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        let q = ctx.db.query("Documents")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject));

        // Note: For complex filtering in Convex, it's often better to fetch and filter in memory if dataset is small,
        // or use specific composite indexes. Here we filter in memory for simplicity as per MVP plan.
        const docs = await q.order("desc").collect();

        return docs.filter(doc => {
            if (args.folder && doc.folder !== args.folder) return false;
            if (args.documentType && doc.documentType !== args.documentType) return false;
            return true;
        });
    },
});

// Generate upload URL for file storage
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

// Create document record after file upload
export const createDocument = mutation({
    args: {
        storageId: v.string(),
        fileName: v.string(),
        fileSize: v.number(),
        mimeType: v.string(),
        documentType: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        folder: v.optional(v.string()),
        tags: v.array(v.string()),
        isEncrypted: v.boolean(),
        expiryDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const docId = await ctx.db.insert("Documents", {
            userId: identity.subject,
            storageId: args.storageId,
            fileName: args.fileName,
            fileSize: args.fileSize,
            mimeType: args.mimeType,
            documentType: args.documentType,
            category: "travel_document", // Default category
            title: args.title,
            description: args.description,
            folder: args.folder,
            tags: args.tags,
            isEncrypted: args.isEncrypted,
            documentDetails: args.expiryDate ? {
                expiryDate: args.expiryDate,
                documentNumber: "", // Can be updated later
                issuingCountry: "",
                issueDate: "",
            } : undefined,
            verificationStatus: "pending",
            sharedWith: [],
            uploadedAt: new Date().toISOString(),
            version: 1,
        });
        return docId;
    },
});

export const deleteDocument = mutation({
    args: { id: v.id("Documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const doc = await ctx.db.get(args.id);
        if (!doc) throw new Error("Document not found");

        // Verify ownership
        if (doc.userId !== identity.subject) throw new Error("Unauthorized");

        // Delete file from storage
        await ctx.storage.delete(doc.storageId);

        // Delete record
        await ctx.db.delete(args.id);
    },
});

export const shareDocument = mutation({
    args: {
        id: v.id("Documents"),
        userId: v.string(), // User ID to share with
        permission: v.string(), // "view" | "download"
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const doc = await ctx.db.get(args.id);
        if (!doc) throw new Error("Document not found");

        // Verify ownership
        if (doc.userId !== identity.subject) throw new Error("Unauthorized");

        const sharedWith = doc.sharedWith || [];
        sharedWith.push({
            userId: args.userId,
            permission: args.permission,
            sharedAt: new Date().toISOString(),
        });

        await ctx.db.patch(args.id, { sharedWith });
    },
});

export const getDocumentUrl = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});
