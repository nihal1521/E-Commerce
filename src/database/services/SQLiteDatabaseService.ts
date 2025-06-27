import {
    Analytics,
    Category,
    Inventory,
    Order,
    Product,
    QueryOptions,
    Review,
    UserProfile
} from '../../types';
import { sqliteDb } from '../SQLiteDatabase';

export class DatabaseService {
  private static instance: DatabaseService;

  constructor() {
    // Initialize SQLite database
    this.initializeDatabase();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async initializeDatabase() {
    try {
      await sqliteDb.initialize();
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
    }
  }

  // Generic CRUD Operations
  async insert<T extends { id: string }>(collection: string, data: T): Promise<T> {
    try {
      switch (collection) {
        case 'products':
          return this.insertProduct(data as unknown as Product) as unknown as T;
        case 'categories':
          return this.insertCategory(data as unknown as Category) as unknown as T;
        case 'users':
          return this.insertUser(data as unknown as UserProfile) as unknown as T;
        case 'orders':
          return this.insertOrder(data as unknown as Order) as unknown as T;
        case 'reviews':
          return this.insertReview(data as unknown as Review) as unknown as T;
        case 'analytics':
          return this.insertAnalytics(data as unknown as Analytics) as unknown as T;
        case 'inventory':
          return this.insertInventory(data as unknown as Inventory) as unknown as T;
        default:
          throw new Error(`Collection ${collection} not supported`);
      }
    } catch (error) {
      console.error(`Error inserting into ${collection}:`, error);
      throw error;
    }
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    try {
      const tableName = this.getTableName(collection);
      const result = sqliteDb.get(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
      return result ? this.transformRow(collection, result) : null;
    } catch (error) {
      console.error(`Error finding by ID in ${collection}:`, error);
      return null;
    }
  }

  async find<T>(collection: string, query: any = {}, options: QueryOptions = {}): Promise<T[]> {
    try {
      const tableName = this.getTableName(collection);
      let sql = `SELECT * FROM ${tableName}`;
      const params: any[] = [];

      // Build WHERE clause
      if (Object.keys(query).length > 0) {
        const conditions: string[] = [];
        Object.entries(query).forEach(([key, value]) => {
          conditions.push(`${key} = ?`);
          params.push(value);
        });
        sql += ` WHERE ${conditions.join(' AND ')}`;
      }

      // Add ORDER BY
      if (options.sortBy) {
        const direction = options.sortOrder === 'desc' ? 'DESC' : 'ASC';
        sql += ` ORDER BY ${options.sortBy} ${direction}`;
      }

      // Add LIMIT and OFFSET
      if (options.limit) {
        sql += ` LIMIT ?`;
        params.push(options.limit);
      }
      if (options.offset) {
        sql += ` OFFSET ?`;
        params.push(options.offset);
      }

      const results = sqliteDb.query(sql, params);
      return results.map(row => this.transformRow(collection, row));
    } catch (error) {
      console.error(`Error finding in ${collection}:`, error);
      return [];
    }
  }

  async update<T>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const tableName = this.getTableName(collection);
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      sqliteDb.run(
        `UPDATE ${tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...values, id]
      );

      return this.findById<T>(collection, id);
    } catch (error) {
      console.error(`Error updating ${collection}:`, error);
      return null;
    }
  }

  async delete(collection: string, id: string): Promise<boolean> {
    try {
      const tableName = this.getTableName(collection);
      sqliteDb.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting from ${collection}:`, error);
      return false;
    }
  }

  // Specialized insert methods
  private insertProduct(product: Product): Product {
    sqliteDb.run(`
      INSERT INTO products (id, name, description, price, image, category_id, material, colors, rating, review_count, is_new, is_best_seller, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product.id, product.name, product.description, product.price, product.image,
      product.category, product.material, JSON.stringify(product.colors), product.rating, product.reviews || 0,
      product.isNew ? 1 : 0, product.isBestSeller ? 1 : 0, 0 // Default stock to 0 since it's not in Product type
    ]);
    return product;
  }

  private insertCategory(category: Category): Category {
    sqliteDb.run(`
      INSERT INTO categories (id, name, slug, description, image)
      VALUES (?, ?, ?, ?, ?)
    `, [category.id, category.name, category.slug, category.description, category.image]);
    return category;
  }

  private insertUser(user: UserProfile): UserProfile {
    sqliteDb.run(`
      INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?)
    `, [user.id, user.name, user.email, user.passwordHash || '']);
    return user;
  }

  private insertOrder(order: Order): Order {
    sqliteDb.run(`
      INSERT INTO orders (id, user_id, total_amount, status, payment_method_id, payment_method_type, billing_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      order.id, order.userId, order.totalAmount, order.status,
      order.paymentMethod.id, order.paymentMethod.type, JSON.stringify(order.billingAddress)
    ]);

    // Insert order items
    order.items.forEach(item => {
      sqliteDb.run(`
        INSERT INTO order_items (id, order_id, product_id, quantity, price, selected_color)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        `${order.id}_${item.product.id}`, order.id, item.product.id,
        item.quantity, item.product.price, item.selectedColor
      ]);
    });

    return order;
  }

  private insertReview(review: Review): Review {
    sqliteDb.run(`
      INSERT INTO reviews (id, product_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `, [review.id, review.productId, review.userId, review.rating, review.comment]);
    return review;
  }

  private insertAnalytics(analytics: Analytics): Analytics {
    sqliteDb.run(`
      INSERT INTO analytics (id, event_type, data, user_id)
      VALUES (?, ?, ?, ?)
    `, [analytics.id, analytics.eventType, JSON.stringify(analytics.metadata), analytics.userId]);
    return analytics;
  }

  private insertInventory(inventory: Inventory): Inventory {
    sqliteDb.run(`
      INSERT INTO inventory (id, product_id, stock_quantity, low_stock_threshold)
      VALUES (?, ?, ?, ?)
    `, [inventory.id, inventory.productId, inventory.quantity, 5]); // Default threshold
    return inventory;
  }

  // Helper methods
  private getTableName(collection: string): string {
    const tableMap: Record<string, string> = {
      'products': 'products',
      'categories': 'categories',
      'users': 'users',
      'orders': 'orders',
      'reviews': 'reviews',
      'analytics': 'analytics',
      'inventory': 'inventory'
    };
    return tableMap[collection] || collection;
  }

  private transformRow(collection: string, row: any): any {
    // Transform SQLite row back to application format
    switch (collection) {
      case 'products':
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          price: row.price,
          image: row.image,
          images: [row.image], // Convert single image to array
          category: row.category_id,
          material: row.material || 'Unknown', // Default material
          colors: JSON.parse(row.colors || '[]'),
          rating: row.rating,
          reviews: row.review_count || 0,
          isNew: Boolean(row.is_new),
          isBestSeller: Boolean(row.is_best_seller)
        } as Product;
      
      case 'categories':
        return {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          image: row.image
        } as Category;
      
      case 'users':
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          role: 'customer',
          isVerified: false,
          passwordHash: row.password,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
          preferences: {
            currency: 'INR',
            language: 'en',
            notifications: true
          },
          addresses: [],
          orders: []
        } as UserProfile;
      
      case 'orders':
        // Note: This is simplified - you'd need to join with order_items for complete orders
        return {
          id: row.id,
          userId: row.user_id,
          totalAmount: row.total_amount,
          status: row.status,
          paymentMethod: {
            id: row.payment_method_id,
            type: row.payment_method_type,
            name: row.payment_method_type === 'cod' ? 'Cash on Delivery' : 'Payment',
            icon: '',
            isEnabled: true
          },
          billingAddress: JSON.parse(row.billing_address || '{}'),
          createdAt: new Date(row.created_at),
          items: [] // Would need separate query to populate
        } as Order;
      
      default:
        return row;
    }
  }

  // Search functionality
  async searchProducts(query: string, options: QueryOptions = {}): Promise<Product[]> {
    const sql = `
      SELECT * FROM products 
      WHERE name LIKE ? OR description LIKE ?
      ORDER BY 
        CASE WHEN name LIKE ? THEN 1 ELSE 2 END,
        rating DESC
      LIMIT ?
    `;
    
    const searchTerm = `%${query}%`;
    const limit = options.limit || 50;
    
    const results = sqliteDb.query(sql, [searchTerm, searchTerm, searchTerm, limit]);
    return results.map(row => this.transformRow('products', row));
  }

  // Get user orders with items
  async getUserOrders(userId: string): Promise<Order[]> {
    const orders = sqliteDb.query(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `, [userId]);

    return Promise.all(orders.map(async (orderRow) => {
      const items = sqliteDb.query(`
        SELECT oi.*, p.name, p.description, p.image, p.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [orderRow.id]);

      return {
        ...this.transformRow('orders', orderRow),
        items: items.map(item => ({
          product: {
            id: item.product_id,
            name: item.name,
            description: item.description,
            image: item.image,
            price: item.price
          },
          quantity: item.quantity,
          selectedColor: item.selected_color
        }))
      } as Order;
    }));
  }

  // Analytics methods
  async trackEvent(eventType: string, data: any, userId?: string): Promise<void> {
    const analytics: Analytics = {
      id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType: eventType as any,
      sessionId: `session_${Date.now()}`,
      timestamp: new Date(),
      metadata: data,
      userId
    };
    
    await this.insert('analytics', analytics);
  }
}

export const db = new DatabaseService();
