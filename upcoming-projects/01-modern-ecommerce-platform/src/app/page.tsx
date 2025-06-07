import Link from 'next/link';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products
            </p>
          </div>
          <ProductGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
