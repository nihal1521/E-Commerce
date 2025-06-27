import initSqlJs, { Database } from 'sql.js';

export class SQLiteDatabase {
  private db: Database | null = null;
  private static instance: SQLiteDatabase;

  private constructor() {}

  static getInstance(): SQLiteDatabase {
    if (!SQLiteDatabase.instance) {
      SQLiteDatabase.instance = new SQLiteDatabase();
    }
    return SQLiteDatabase.instance;
  }

  async initialize(): Promise<void> {
    if (this.db) return;

    try {
      // Initialize SQL.js
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('knotara_sqlite_db');
      if (savedDb) {
        const uint8Array = new Uint8Array(
          atob(savedDb).split('').map(c => c.charCodeAt(0))
        );
        this.db = new SQL.Database(uint8Array);
      } else {
        // Create new database
        this.db = new SQL.Database();
        await this.createTables();
        await this.seedDatabase();
      }
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create tables
    const statements = [
      // Users table
      `CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Categories table
      `CREATE TABLE categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Products table
      `CREATE TABLE products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        category_id TEXT,
        material TEXT,
        colors TEXT, -- JSON string
        rating REAL DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        is_new BOOLEAN DEFAULT 0,
        is_best_seller BOOLEAN DEFAULT 0,
        stock_quantity INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )`,

      // Orders table
      `CREATE TABLE orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_method_id TEXT,
        payment_method_type TEXT,
        billing_address TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Order items table
      `CREATE TABLE order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        selected_color TEXT,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`,

      // Reviews table
      `CREATE TABLE reviews (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        user_id TEXT,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Analytics table
      `CREATE TABLE analytics (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        data TEXT, -- JSON string
        user_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Inventory table
      `CREATE TABLE inventory (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        stock_quantity INTEGER NOT NULL,
        low_stock_threshold INTEGER DEFAULT 5,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`
    ];

    statements.forEach(statement => {
      this.db!.run(statement);
    });

    // Create indexes
    const indexes = [
      'CREATE INDEX idx_products_category ON products (category_id)',
      'CREATE INDEX idx_products_price ON products (price)',
      'CREATE INDEX idx_orders_user ON orders (user_id)',
      'CREATE INDEX idx_orders_status ON orders (status)',
      'CREATE INDEX idx_order_items_order ON order_items (order_id)',
      'CREATE INDEX idx_reviews_product ON reviews (product_id)',
      'CREATE INDEX idx_analytics_type ON analytics (event_type)',
      'CREATE INDEX idx_inventory_product ON inventory (product_id)'
    ];

    indexes.forEach(index => {
      this.db!.run(index);
    });
  }

  private async seedDatabase(): Promise<void> {
    if (!this.db) return;

    // Seed categories
    const categories = [
      { id: '1', name: 'Keychains', slug: 'keychains', description: 'Stylish keychains to accessorize your keys', image: 'https://images.pexels.com/photos/6249362/pexels-photo-6249362.jpeg?auto=compress&cs=tinysrgb&w=600' },
      { id: '2', name: 'Wrist Keychains', slug: 'wrist-keychains', description: 'Convenient wrist keychains for hands-free carrying', image: 'https://images.pexels.com/photos/5442464/pexels-photo-5442464.jpeg?auto=compress&cs=tinysrgb&w=600' },
      { id: '3', name: 'Hair Accessories', slug: 'hair-accessories', description: 'Beautiful hair accessories for every style', image: 'https://images.pexels.com/photos/6663331/pexels-photo-6663331.jpeg?auto=compress&cs=tinysrgb&w=600' },
      { id: '4', name: 'Handbags', slug: 'handbags', description: 'Elegant handcrafted handbags for the modern woman', image: '/WhatsApp Image 2025-06-24 at 19.51.59_2edd5ace.jpg' }
    ];

    const categoryStmt = this.db.prepare('INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)');
    categories.forEach(cat => {
      categoryStmt.run([cat.id, cat.name, cat.slug, cat.description, cat.image]);
    });

    // Seed products
    const products = [
      {
        id: '1',
        name: 'Classic Leather Keychain',
        description: 'Premium leather keychain crafted with attention to detail',
        price: 299,
        image: 'https://images.pexels.com/photos/6249362/pexels-photo-6249362.jpeg?auto=compress&cs=tinysrgb&w=600',
        category_id: '1',
        material: 'Genuine Leather',
        colors: JSON.stringify(['Brown', 'Black', 'Tan']),
        rating: 4.8,
        review_count: 124,
        is_new: 1,
        is_best_seller: 0,
        stock_quantity: 15
      },
      {
        id: '2',
        name: 'Metallic Chain Keychain',
        description: 'Stylish metallic keychain with chain details',
        price: 199,
        image: 'https://images.pexels.com/photos/7319337/pexels-photo-7319337.jpeg?auto=compress&cs=tinysrgb&w=600',
        category_id: '1',
        material: 'Metal Alloy',
        colors: JSON.stringify(['Silver', 'Gold', 'Rose Gold']),
        rating: 4.5,
        review_count: 89,
        is_new: 0,
        is_best_seller: 0,
        stock_quantity: 25
      },
      {
        id: '3',
        name: 'Beaded Wrist Keychain',
        description: 'Comfortable beaded wrist keychain with elastic band',
        price: 349,
        image: 'https://images.pexels.com/photos/5442464/pexels-photo-5442464.jpeg?auto=compress&cs=tinysrgb&w=600',
        category_id: '2',
        material: 'Beads & Elastic',
        colors: JSON.stringify(['Multi', 'Blue', 'Pink']),
        rating: 4.7,
        review_count: 156,
        is_new: 0,
        is_best_seller: 1,
        stock_quantity: 18
      },
      {
        id: '4',
        name: 'Pearl Hair Clips Set',
        description: 'Elegant pearl hair clips set for special occasions',
        price: 449,
        image: 'https://images.pexels.com/photos/6663331/pexels-photo-6663331.jpeg?auto=compress&cs=tinysrgb&w=600',
        category_id: '3',
        material: 'Pearl & Metal',
        colors: JSON.stringify(['White', 'Cream', 'Silver']),
        rating: 4.9,
        review_count: 203,
        is_new: 1,
        is_best_seller: 0,
        stock_quantity: 22
      },
      {
        id: '5',
        name: 'Silk Hair Scrunchies',
        description: 'Luxurious silk scrunchies gentle on your hair',
        price: 249,
        image: 'https://images.pexels.com/photos/6663331/pexels-photo-6663331.jpeg?auto=compress&cs=tinysrgb&w=600',
        category_id: '3',
        material: 'Pure Silk',
        colors: JSON.stringify(['Pink', 'Lavender', 'Beige']),
        rating: 4.6,
        review_count: 178,
        is_new: 0,
        is_best_seller: 0,
        stock_quantity: 30
      },
      {
        id: '6',
        name: 'Handwoven Macrame Crossbody Bag - Red',
        description: 'Beautiful handwoven macrame crossbody bag with intricate knotwork pattern. Features the Knotayac signature label and comes with a comfortable wrist strap.',
        price: 1299,
        image: '/WhatsApp Image 2025-06-24 at 19.52.01_9bc40c6e.jpg',
        category_id: '4',
        material: 'Handwoven Macrame Cord',
        colors: JSON.stringify(['Red', 'Pink', 'Burgundy']),
        rating: 4.8,
        review_count: 334,
        is_new: 0,
        is_best_seller: 1,
        stock_quantity: 8
      },
      {
        id: '7',
        name: 'Macrame Mini Handbag - Cream & Brown',
        description: 'Elegant mini handbag with beautiful macrame pattern in cream and brown. Perfect for casual outings with leather handle for comfort.',
        price: 899,
        image: '/WhatsApp Image 2025-06-24 at 19.51.59_2edd5ace.jpg',
        category_id: '4',
        material: 'Macrame Cord & Leather Handle',
        colors: JSON.stringify(['Cream', 'Brown', 'Beige']),
        rating: 4.4,
        review_count: 267,
        is_new: 0,
        is_best_seller: 0,
        stock_quantity: 12
      },
      {
        id: '8',
        name: 'Artisan Macrame Tote - White',
        description: 'Spacious macrame tote bag with wooden handles. Features intricate handwoven patterns perfect for everyday use or special occasions.',
        price: 1199,
        image: '/WhatsApp Image 2025-06-24 at 19.52.00_ceeb7f52.jpg',
        category_id: '4',
        material: 'Macrame Cord & Wood Handles',
        colors: JSON.stringify(['White', 'Cream', 'Natural']),
        rating: 4.7,
        review_count: 145,
        is_new: 1,
        is_best_seller: 0,
        stock_quantity: 6
      },
      {
        id: '9',
        name: 'Boho Macrame Shoulder Bag - Blue',
        description: 'Stylish boho-inspired macrame shoulder bag in beautiful blue. Features leather straps and the signature Knotayac craftsmanship.',
        price: 1099,
        image: '/WhatsApp Image 2025-06-24 at 19.52.02_d4e1f86f.jpg',
        category_id: '4',
        material: 'Macrame Cord & Leather Straps',
        colors: JSON.stringify(['Blue', 'Navy', 'Teal']),
        rating: 4.6,
        review_count: 189,
        is_new: 1,
        is_best_seller: 0,
        stock_quantity: 10
      }
    ];

    const productStmt = this.db.prepare(`
      INSERT INTO products (id, name, description, price, image, category_id, material, colors, rating, review_count, is_new, is_best_seller, stock_quantity) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    products.forEach(product => {
      productStmt.run([
        product.id, product.name, product.description, product.price, product.image,
        product.category_id, product.material, product.colors, product.rating, product.review_count,
        product.is_new, product.is_best_seller, product.stock_quantity
      ]);
    });

    // Seed inventory
    products.forEach(product => {
      this.db!.run(`
        INSERT INTO inventory (id, product_id, stock_quantity, low_stock_threshold) 
        VALUES (?, ?, ?, ?)
      `, [`inv_${product.id}`, product.id, product.stock_quantity, 5]);
    });

    this.saveToStorage();
  }

  getDatabase(): Database {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  saveToStorage(): void {
    if (!this.db) return;
    
    try {
      const data = this.db.export();
      const base64 = btoa(String.fromCharCode.apply(null, Array.from(data)));
      localStorage.setItem('knotara_sqlite_db', base64);
    } catch (error) {
      console.error('Failed to save database to localStorage:', error);
    }
  }

  // Execute a query and return results
  query(sql: string, params: any[] = []): any[] {
    if (!this.db) throw new Error('Database not initialized');
    
    const stmt = this.db.prepare(sql);
    const results: any[] = [];
    
    stmt.bind(params);
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    
    return results;
  }

  // Execute a statement (INSERT, UPDATE, DELETE)
  run(sql: string, params: any[] = []): void {
    if (!this.db) throw new Error('Database not initialized');
    
    this.db.run(sql, params);
    this.saveToStorage();
  }

  // Get a single row
  get(sql: string, params: any[] = []): any | null {
    const results = this.query(sql, params);
    return results.length > 0 ? results[0] : null;
  }
}

export const sqliteDb = SQLiteDatabase.getInstance();
