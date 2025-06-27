import { Product, QueryOptions } from '../../types';
import { db } from './DatabaseService';

export class ProductService {
  
  async getAllProducts(options: QueryOptions = {}): Promise<Product[]> {
    return db.find<Product>('products', {}, options);
  }

  async getProductById(id: string): Promise<Product | null> {
    return db.findById<Product>('products', id);
  }

  async getProductsByCategory(categorySlug: string, options: QueryOptions = {}): Promise<Product[]> {
    return db.getProductsByCategory(categorySlug, options);
  }

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return db.getFeaturedProducts(limit);
  }

  async getNewProducts(limit: number = 8): Promise<Product[]> {
    return db.getNewProducts(limit);
  }

  async searchProducts(searchTerm: string, options: QueryOptions = {}): Promise<Product[]> {
    return db.searchProducts(searchTerm, options);
  }

  async getProductsByPriceRange(minPrice: number, maxPrice: number, options: QueryOptions = {}): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    const filteredProducts = allProducts.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );

    // Apply sorting if specified
    if (options.sortBy) {
      filteredProducts.sort((a, b) => {
        const aValue = (a as any)[options.sortBy!];
        const bValue = (b as any)[options.sortBy!];
        
        if (options.sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
    }

    // Apply pagination
    let results = filteredProducts;
    if (options.offset !== undefined) {
      results = results.slice(options.offset);
    }
    if (options.limit !== undefined) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    const product = await this.getProductById(productId);
    if (!product) return [];

    // Get products from the same category, excluding the current product
    const relatedProducts = await this.getProductsByCategory(product.category);
    return relatedProducts
      .filter(p => p.id !== productId)
      .slice(0, limit);
  }

  async getTopRatedProducts(limit: number = 8): Promise<Product[]> {
    return this.getAllProducts({ 
      sortBy: 'rating', 
      sortOrder: 'desc', 
      limit 
    });
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    categoriesCount: number;
    averagePrice: number;
    outOfStockCount: number;
  }> {
    const products = await this.getAllProducts();
    const categories = new Set(products.map(p => p.category));
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    const outOfStock = products.filter(p => (p as any).stock === 0).length;

    return {
      totalProducts: products.length,
      categoriesCount: categories.size,
      averagePrice: Math.round(totalPrice / products.length),
      outOfStockCount: outOfStock
    };
  }
}

export const productService = new ProductService();
