'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, Star, Package, CreditCard, User, Bell } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  restaurant_name: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  estimated_delivery_time: string;
  items_count: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    restaurant_name: 'Pizza Palace',
    status: 'delivered',
    total_amount: 28.97,
    created_at: '2024-01-15T18:30:00Z',
    estimated_delivery_time: '2024-01-15T19:05:00Z',
    items_count: 2
  },
  {
    id: '2',
    restaurant_name: 'Burger Junction',
    status: 'preparing',
    total_amount: 15.49,
    created_at: '2024-01-16T12:15:00Z',
    estimated_delivery_time: '2024-01-16T12:45:00Z',
    items_count: 1
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'preparing':
      return 'bg-orange-100 text-orange-800';
    case 'ready':
      return 'bg-purple-100 text-purple-800';
    case 'picked_up':
      return 'bg-indigo-100 text-indigo-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState('orders');

  const activeOrders = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );
  
  const pastOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name}!</h1>
          <p className="text-gray-600 mt-1">Manage your orders and account settings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                  <p className="text-sm text-gray-600">Active Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(0)}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-6">
              {/* Active Orders */}
              {activeOrders.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{order.restaurant_name}</h3>
                              <p className="text-gray-600">Order #{order.id}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Items</p>
                              <p className="font-medium">{order.items_count} items</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total</p>
                              <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Est. Delivery</p>
                              <p className="font-medium">
                                {new Date(order.estimated_delivery_time).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-600">
                              Ordered {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <Button variant="outline" size="sm">
                              Track Order
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Orders */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                {pastOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No past orders yet</p>
                      <Button asChild className="mt-4">
                        <Link href="/restaurants">Start Ordering</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pastOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{order.restaurant_name}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>{order.items_count} items • ${order.total_amount.toFixed(2)}</span>
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <Button variant="outline" size="sm">
                              Reorder
                            </Button>
                            <Button variant="ghost" size="sm">
                              Leave Review
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No favorite restaurants yet</p>
                <p className="text-sm text-gray-500 mt-1">Heart restaurants you love to see them here</p>
                <Button asChild className="mt-4">
                  <Link href="/restaurants">Browse Restaurants</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="font-medium">Full Name</label>
                    <p className="text-gray-600">{user?.full_name}</p>
                  </div>
                  <div>
                    <label className="font-medium">Email</label>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  <div>
                    <label className="font-medium">Phone</label>
                    <p className="text-gray-600">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="font-medium">Address</label>
                    <p className="text-gray-600">{user?.address || 'Not provided'}</p>
                  </div>
                  <Button className="mt-6">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}