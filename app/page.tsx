import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const categories = [
    {
      name: 'Shoes',
      slug: 'shoes',
      image: '/images/shoes-category.jpg',
      description: 'Step up your style',
    },
    {
      name: 'Bags',
      slug: 'bags',
      image: '/images/bags-category.jpg',
      description: 'Carry with confidence',
    },
    {
      name: 'Clothes',
      slug: 'clothes',
      image: '/images/clothes-category.jpg',
      description: 'Fashion that fits',
    },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Your transactions are safe',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'We\'re here to help anytime',
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section - Jumia Orange Theme */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6">
                Discover Your Style
              </h1>
              <p className="text-lg sm:text-xl mb-6 lg:mb-8 text-orange-50">
                Shop the latest trends in shoes, bags, and clothes with unbeatable prices
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-800 transition-all border-2 border-white/20"
                >
                  View Deals
                  <ShoppingBag className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="hidden lg:block">
              <div className="relative h-96 bg-white/10 rounded-2xl backdrop-blur-sm p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-2xl font-bold">Shop With Confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <Link
              href="/products"
              className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
                  {/* Placeholder pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-orange-200/50 rounded-full blur-3xl" />
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category icon placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="w-20 h-20 text-orange-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="flex items-center text-orange-600 font-semibold text-sm">
                    Explore now
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gender Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Shop by Gender
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {/* Men's Section */}
            <Link
              href="/products?gender=men"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 lg:p-12 text-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative z-10">
                <h3 className="text-3xl lg:text-4xl font-bold mb-2">Men's Collection</h3>
                <p className="text-blue-100 mb-6">Explore men's fashion</p>
                <div className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold group-hover:bg-blue-50 transition-colors">
                  Shop Men's
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-500" />
            </Link>

            {/* Women's Section */}
            <Link
              href="/products?gender=women"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 p-8 lg:p-12 text-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative z-10">
                <h3 className="text-3xl lg:text-4xl font-bold mb-2">Women's Collection</h3>
                <p className="text-pink-100 mb-6">Explore women's fashion</p>
                <div className="inline-flex items-center bg-white text-pink-700 px-6 py-3 rounded-lg font-semibold group-hover:bg-pink-50 transition-colors">
                  Shop Women's
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-lg sm:text-xl text-orange-50 mb-8">
            Join thousands of satisfied customers shopping with us
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-white text-orange-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Start Shopping
            <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </section> */}
    </div>
  );
}