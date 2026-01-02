import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Discover Your Style
          </h1>
          <p className="text-xl mb-8">
            Shop the latest trends in shoes, bags, and clothes
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['shoes', 'bags', 'clothes'].map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold capitalize">{category}</h3>
                  <p className="text-sm">Explore collection</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}