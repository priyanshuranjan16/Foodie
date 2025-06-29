import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">Foodie</span>
            </div>
            <p className="text-gray-300 text-sm">
              Delivering delicious food from your favorite restaurants right to your door.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/restaurants" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Browse Restaurants
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white text-sm transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Contact
              </Link>
              <Link href="/help" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Help Center
              </Link>
            </div>
          </div>

          {/* For Partners */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Partners</h3>
            <div className="space-y-2">
              <Link href="/auth/register?role=restaurant" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Restaurant Partner
              </Link>
              <Link href="/auth/register?role=delivery" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Delivery Partner
              </Link>
              <Link href="/partner-support" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Partner Support
              </Link>
              <Link href="/partner-terms" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300 text-sm">support@foodie.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300 text-sm">123 Food Street, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Foodie. All rights reserved. | 
            <Link href="/privacy" className="hover:text-white ml-1">Privacy Policy</Link> |
            <Link href="/terms" className="hover:text-white ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}