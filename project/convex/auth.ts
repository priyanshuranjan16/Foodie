import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    full_name: v.string(),
    role: v.union(v.literal("customer"), v.literal("restaurant"), v.literal("delivery"), v.literal("admin")),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new ConvexError("User with this email already exists");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      full_name: args.full_name,
      role: args.role,
      phone: args.phone,
      address: args.address,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    return { userId, success: true };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new ConvexError("Invalid email or password");
    }

    // In a real app, you would verify the password here
    // For now, we'll just return the user
    return { user, success: true };
  },
});

export const getCurrentUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return null;
    }

    const user = await ctx.db.get(args.userId);
    return user;
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    full_name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    await ctx.db.patch(userId, {
      ...updates,
      updated_at: Date.now(),
    });

    const updatedUser = await ctx.db.get(userId);
    return updatedUser;
  },
});