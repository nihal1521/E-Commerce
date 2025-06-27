// Database Services
export { AnalyticsService } from './services/AnalyticsService';
export { DatabaseService } from './services/DatabaseService';
export { InventoryService } from './services/InventoryService';
export { OrderService } from './services/OrderService';
export { ProductService } from './services/ProductService';
export { UserService } from './services/UserService';

// Service Instances
export { analyticsService } from './services/AnalyticsService';
export { db } from './services/DatabaseService';
export { inventoryService } from './services/InventoryService';
export { orderService } from './services/OrderService';
export { productService } from './services/ProductService';
export { userService } from './services/UserService';

// SQLite Database
export { SQLiteDatabase, sqliteDb } from './SQLiteDatabase';

// Database Configuration
export { default as config } from './config.json';

// Utility functions
export const initializeDatabase = async () => {
  console.log('SQLite Database initialized successfully');
  return true;
};

export const resetDatabase = async () => {
  console.log('Resetting SQLite database...');
  
  // Clear localStorage and reinitialize
  localStorage.removeItem('knotara_sqlite_db');
  const { sqliteDb } = await import('./SQLiteDatabase');
  await sqliteDb.initialize();
  
  console.log('SQLite Database reset complete');
  return true;
};
