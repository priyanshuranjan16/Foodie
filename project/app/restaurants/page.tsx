'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Clock, MapPin, Filter } from 'lucide-react';
import type { Restaurant } from '@/lib/convex';

const cuisineTypes = ['All', 'Italian', 'American', 'Japanese', 'Mexican', 'Chinese', 'Healthy'];
const sortOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'delivery_time', label: 'Delivery Time' },
  { value: 'delivery_fee', label: 'Delivery Fee' }
];

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const restaurants = useQuery(api.restaurants.getRestaurants, {
    cuisine_type: selectedCuisine,
    search: searchQuery,
  }) || [];

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'delivery_time':
        const aTime = parseInt(a.delivery_time.split('-')[0]);
        const bTime = parseInt(b.delivery_time.split('-')[0]);
        return aTime - bTime;
      case 'delivery_fee':
        return a.delivery_fee - b.delivery_fee;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
              <p className="text-gray-600 mt-1">
                Discover and order from {sortedRestaurants.length} restaurants
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex items-center space-x-4 flex-1">
              {/* Cuisine Filter */}
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      Sort by {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="container mx-auto px-4 py-8">
        {sortedRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRestaurants.map((restaurant) => (
              <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="relative h-48">
                    <Image
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!restaurant.is_open && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-white text-gray-900">
                          Closed
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white/90">
                        <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                        {restaurant.rating}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {restaurant.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {restaurant.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          {restaurant.cuisine_type}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{restaurant.delivery_time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>${restaurant.delivery_fee.toFixed(2)} delivery</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Minimum order: ${restaurant.minimum_order}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}