import { useEffect, useState } from 'react';
import {
    analyticsService,
    inventoryService,
    orderService,
    productService
} from '../database';
import { Order, Product, QueryOptions } from '../types';

// Hook for products
export const useProducts = (options: QueryOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts(options);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(options)]);

  return { products, loading, error, refetch: () => window.location.reload() };
};

// Hook for single product
export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data);
        setError(null);
        
        // Track product view
        if (data) {
          await analyticsService.trackPageView(productId);
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

// Hook for products by category
export const useProductsByCategory = (categorySlug: string, options: QueryOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categorySlug) return;
      
      try {
        setLoading(true);
        const data = await productService.getProductsByCategory(categorySlug, options);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products by category');
        console.error('Error fetching products by category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, JSON.stringify(options)]);

  return { products, loading, error };
};

// Hook for search
export const useProductSearch = (searchTerm: string, options: QueryOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setProducts([]);
        return;
      }
      
      try {
        setLoading(true);
        const data = await productService.searchProducts(searchTerm, options);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to search products');
        console.error('Error searching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, JSON.stringify(options)]);

  return { products, loading, error };
};

// Hook for featured products
export const useFeaturedProducts = (limit: number = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getFeaturedProducts(limit);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch featured products');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

// Hook for new products
export const useNewProducts = (limit: number = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getNewProducts(limit);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch new products');
        console.error('Error fetching new products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, [limit]);

  return { products, loading, error };
};

// Hook for orders
export const useOrders = (userId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = userId 
          ? await orderService.getUserOrders(userId)
          : await orderService.getAllOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return { orders, loading, error };
};

// Hook for inventory
export const useInventory = (productId?: string) => {
  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = productId 
          ? await inventoryService.getInventory(productId)
          : await inventoryService.getAllInventory();
        setInventory(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch inventory');
        console.error('Error fetching inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [productId]);

  return { inventory, loading, error };
};

// Hook for analytics tracking
export const useAnalytics = () => {
  const trackProductView = async (productId: string, userId?: string) => {
    try {
      await analyticsService.trackPageView(productId, userId);
    } catch (err) {
      console.error('Error tracking product view:', err);
    }
  };

  const trackProductClick = async (productId: string, userId?: string) => {
    try {
      await analyticsService.trackProductClick(productId, userId);
    } catch (err) {
      console.error('Error tracking product click:', err);
    }
  };

  const trackCartAdd = async (productId: string, userId?: string) => {
    try {
      await analyticsService.trackCartAdd(productId, userId);
    } catch (err) {
      console.error('Error tracking cart add:', err);
    }
  };

  const trackCartRemove = async (productId: string, userId?: string) => {
    try {
      await analyticsService.trackCartRemove(productId, userId);
    } catch (err) {
      console.error('Error tracking cart remove:', err);
    }
  };

  const trackPurchase = async (productId: string, userId?: string) => {
    try {
      await analyticsService.trackPurchase(productId, userId);
    } catch (err) {
      console.error('Error tracking purchase:', err);
    }
  };

  return {
    trackProductView,
    trackProductClick,
    trackCartAdd,
    trackCartRemove,
    trackPurchase
  };
};
