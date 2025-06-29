'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Search, Clock, Star, Truck, Shield, CreditCard } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: <Search className="h-8 w-8 text-orange-600" />,
      title: 'Easy Discovery',
      description: 'Find restaurants near you with our smart search and filters.'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Fast Delivery',
      description: 'Get your food delivered hot and fresh in 30 minutes or less.'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Safe & Secure',
      description: 'Your payments and personal data are always protected.'
    },
    {
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      title: 'Easy Payment',
      description: 'Multiple payment options including cards, wallets, and cash.'
    }
  ];

  const popularRestaurants = [
    {
      id: '1',
      name: 'Pizza Palace',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: '25-35 min',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'Burger Junction',
      cuisine: 'American',
      rating: 4.6,
      deliveryTime: '20-30 min',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.9,
      deliveryTime: '30-40 min',
      image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                  🍕 Free delivery on orders over $30
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Delicious food
                  <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    delivered fast
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  Order from your favorite restaurants and get it delivered hot and fresh to your doorstep in minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8">
                  <Link href={user ? '/restaurants' : '/auth/register'}>
                    {user ? 'Order Now' : 'Get Started'}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 border-gray-300">
                  <Link href="/restaurants">
                    Browse Restaurants
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span>4.8/5 rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span>30 min delivery</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Food delivery"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Fast Delivery</p>
                    <p className="text-sm text-gray-600">Average 25 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose Foodie?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make food delivery simple, fast, and reliable with features designed around your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular restaurants
            </h2>
            <p className="text-lg text-gray-600">
              Discover top-rated restaurants in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="relative h-48">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="/restaurants">
                View All Restaurants
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to order delicious food?
            </h2>
            <p className="text-lg mb-8 text-orange-100">
              Join thousands of satisfied customers and get your favorite meals delivered fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8">
                <Link href={user ? '/restaurants' : '/auth/register'}>
                  {user ? 'Start Ordering' : 'Sign Up Now'}
                </Link>
              </Button>
              {!user && (
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8">
                  <Link href="/auth/login">
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}