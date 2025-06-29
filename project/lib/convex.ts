import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default convex;

export type UserRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

export interface User {
  _id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  created_at: number;
  updated_at: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  image_url: string;
  cuisine_type: string;
  rating: number;
  delivery_time: string;
  delivery_fee: number;
  minimum_order: number;
  is_open: boolean;
  owner_id: string;
  address: string;
  phone: string;
  created_at: number;
  updated_at: number;
}

export interface MenuItem {
  _id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  preparation_time: number;
  created_at: number;
  updated_at: number;
}

export interface Order {
  _id: string;
  customer_id: string;
  restaurant_id: string;
  delivery_partner_id?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_fee: number;
  delivery_address: string;
  estimated_delivery_time: string;
  created_at: number;
  updated_at: number;
}

export interface OrderItem {
  _id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}