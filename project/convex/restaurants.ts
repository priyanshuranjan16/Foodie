import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getRestaurants = query({
  args: {
    cuisine_type: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let restaurants = ctx.db.query("restaurants");

    if (args.cuisine_type && args.cuisine_type !== "All") {
      restaurants = restaurants.withIndex("by_cuisine", (q) => 
        q.eq("cuisine_type", args.cuisine_type)
      );
    }

    const results = await restaurants.collect();

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      return results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.description.toLowerCase().includes(searchLower) ||
        restaurant.cuisine_type.toLowerCase().includes(searchLower)
      );
    }

    return results;
  },
});

export const getRestaurant = query({
  args: { id: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getMenuItems = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menu_items")
      .withIndex("by_restaurant", (q) => q.eq("restaurant_id", args.restaurantId))
      .collect();
  },
});

export const createRestaurant = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    image_url: v.string(),
    cuisine_type: v.string(),
    delivery_fee: v.number(),
    minimum_order: v.number(),
    owner_id: v.id("users"),
    address: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const restaurantId = await ctx.db.insert("restaurants", {
      ...args,
      rating: 0,
      delivery_time: "30-45 min",
      is_open: true,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    return restaurantId;
  },
});

export const createMenuItem = mutation({
  args: {
    restaurant_id: v.id("restaurants"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    image_url: v.string(),
    category: v.string(),
    preparation_time: v.number(),
  },
  handler: async (ctx, args) => {
    const menuItemId = await ctx.db.insert("menu_items", {
      ...args,
      is_available: true,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    return menuItemId;
  },
});