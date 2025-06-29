'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/hooks/useCart';
import { Star, Clock, MapPin, Phone, Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import type { Restaurant, MenuItem } from '@/lib/convex';
import type { Id } from '@/convex/_generated/dataModel';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { items } = useCart();
  
  const cartItem = items.find(cartItem => cartItem.menuItem._id === item._id);
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="relative h-48 md:h-32 md:w-32 flex-shrink-0">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{item.preparation_time} min</span>
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {cartQuantity > 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {cartQuantity} in cart
                </Badge>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={!item.is_available}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('menu');

  const restaurant = useQuery(api.restaurants.getRestaurant, {
    id: params.id as Id<"restaurants">
  });

  const menuItems = useQuery(api.restaurants.getMenuItems, {
    restaurantId: params.id as Id<"restaurants">
  }) || [];

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    addItem(item, quantity);
    toast.success(`Added ${item.name} to cart!`);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(menuItems.map(item => item.category))];
  const groupedMenuItems = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80">
        <Image
          src={restaurant.image_url}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-white/90 mb-2">{restaurant.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span>{restaurant.rating} rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.delivery_time}</span>
                  </div>
                  <Badge className="bg-white/20 text-white hover:bg-white/20">
                    {restaurant.cuisine_type}
                  </Badge>
                </div>
              </div>
              {!restaurant.is_open && (
                <Badge className="bg-red-600 text-white text-lg px-4 py-2">
                  Closed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{restaurant.phone}</span>
            </div>
            <div className="text-gray-600">
              Minimum order: ${restaurant.minimum_order} • Delivery: ${restaurant.delivery_fee.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-8">
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
                  <div className="space-y-4">
                    {groupedMenuItems[category].map((item) => (
                      <MenuItemCard
                        key={item._id}
                        item={item}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="text-center py-12 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4" />
              <p>Reviews feature coming soon!</p>
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Restaurant Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-medium">Address:</label>
                    <p className="text-gray-600">{restaurant.address}</p>
                  </div>
                  <div>
                    <label className="font-medium">Phone:</label>
                    <p className="text-gray-600">{restaurant.phone}</p>
                  </div>
                  <div>
                    <label className="font-medium">Cuisine:</label>
                    <p className="text-gray-600">{restaurant.cuisine_type}</p>
                  </div>
                  <div>
                    <label className="font-medium">Description:</label>
                    <p className="text-gray-600">{restaurant.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="mt-8">
            <div className="text-center py-12 text-gray-500">
              <Image className="h-12 w-12 mx-auto mb-4" />
              <p>Photo gallery coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}