import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    full_name: v.string(),
    role: v.union(v.literal("customer"), v.literal("restaurant"), v.literal("delivery"), v.literal("admin")),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_email", ["email"]),

  restaurants: defineTable({
    name: v.string(),
    description: v.string(),
    image_url: v.string(),
    cuisine_type: v.string(),
    rating: v.number(),
    delivery_time: v.string(),
    delivery_fee: v.number(),
    minimum_order: v.number(),
    is_open: v.boolean(),
    owner_id: v.id("users"),
    address: v.string(),
    phone: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_owner", ["owner_id"])
    .index("by_cuisine", ["cuisine_type"])
    .index("by_rating", ["rating"]),

  menu_items: defineTable({
    restaurant_id: v.id("restaurants"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    image_url: v.string(),
    category: v.string(),
    is_available: v.boolean(),
    preparation_time: v.number(),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_restaurant", ["restaurant_id"])
    .index("by_category", ["category"]),

  orders: defineTable({
    customer_id: v.id("users"),
    restaurant_id: v.id("restaurants"),
    delivery_partner_id: v.optional(v.id("users")),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready"),
      v.literal("picked_up"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    total_amount: v.number(),
    delivery_fee: v.number(),
    delivery_address: v.string(),
    estimated_delivery_time: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_customer", ["customer_id"])
    .index("by_restaurant", ["restaurant_id"])
    .index("by_delivery_partner", ["delivery_partner_id"])
    .index("by_status", ["status"]),

  order_items: defineTable({
    order_id: v.id("orders"),
    menu_item_id: v.id("menu_items"),
    quantity: v.number(),
    price: v.number(),
    special_instructions: v.optional(v.string()),
  }).index("by_order", ["order_id"]),

  reviews: defineTable({
    customer_id: v.id("users"),
    restaurant_id: v.id("restaurants"),
    order_id: v.id("orders"),
    rating: v.number(),
    comment: v.optional(v.string()),
    created_at: v.number(),
  }).index("by_restaurant", ["restaurant_id"])
    .index("by_customer", ["customer_id"])
    .index("by_order", ["order_id"]),
});