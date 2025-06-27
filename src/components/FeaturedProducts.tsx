import { products } from '../data/products';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const featuredProducts = products.filter(p => p.isNew || p.isBestSeller).slice(0, 8);

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-neutral-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-inter">
            Discover our handpicked selection of trending accessories
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}