import { Inventory } from '../../types';
import { db } from './DatabaseService';

export class InventoryService {
  
  async getInventory(productId: string): Promise<Inventory | null> {
    return db.getInventory(productId);
  }

  async getAllInventory(): Promise<Inventory[]> {
    return db.find<Inventory>('inventory');
  }

  async updateStock(productId: string, quantity: number): Promise<Inventory | null> {
    return db.updateInventory(productId, quantity);
  }

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    return db.reserveInventory(productId, quantity);
  }

  async releaseReservedStock(productId: string, quantity: number): Promise<boolean> {
    const inventory = await this.getInventory(productId);
    if (!inventory || inventory.reservedQuantity < quantity) {
      return false;
    }

    await db.update<Inventory>('inventory', inventory.id, {
      reservedQuantity: inventory.reservedQuantity - quantity,
      lastUpdated: new Date()
    });

    return true;
  }

  async confirmReservedStock(productId: string, quantity: number): Promise<boolean> {
    const inventory = await this.getInventory(productId);
    if (!inventory || inventory.reservedQuantity < quantity) {
      return false;
    }

    await db.update<Inventory>('inventory', inventory.id, {
      quantity: inventory.quantity - quantity,
      reservedQuantity: inventory.reservedQuantity - quantity,
      lastUpdated: new Date()
    });

    return true;
  }

  async getAvailableStock(productId: string): Promise<number> {
    const inventory = await this.getInventory(productId);
    if (!inventory) return 0;
    
    return Math.max(0, inventory.quantity - inventory.reservedQuantity);
  }

  async isInStock(productId: string, requestedQuantity: number = 1): Promise<boolean> {
    const availableStock = await this.getAvailableStock(productId);
    return availableStock >= requestedQuantity;
  }

  async getLowStockItems(threshold: number = 10): Promise<Array<{
    productId: string;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
  }>> {
    const allInventory = await this.getAllInventory();
    
    return allInventory
      .filter(inv => (inv.quantity - inv.reservedQuantity) <= threshold)
      .map(inv => ({
        productId: inv.productId,
        currentStock: inv.quantity,
        reservedStock: inv.reservedQuantity,
        availableStock: inv.quantity - inv.reservedQuantity
      }));
  }

  async getOutOfStockItems(): Promise<string[]> {
    const lowStock = await this.getLowStockItems(0);
    return lowStock
      .filter(item => item.availableStock === 0)
      .map(item => item.productId);
  }

  async addInventory(productId: string, quantity: number, location: string = 'Warehouse A'): Promise<Inventory> {
    const existingInventory = await this.getInventory(productId);
    
    if (existingInventory) {
      // Update existing inventory
      return db.update<Inventory>('inventory', existingInventory.id, {
        quantity: existingInventory.quantity + quantity,
        lastUpdated: new Date()
      }) as Promise<Inventory>;
    } else {
      // Create new inventory record
      const newInventory: Inventory = {
        id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        quantity,
        reservedQuantity: 0,
        lastUpdated: new Date(),
        location
      };
      
      return db.insert<Inventory>('inventory', newInventory);
    }
  }

  async moveInventory(productId: string, fromLocation: string, toLocation: string, quantity: number): Promise<boolean> {
    // This is a simplified version - in a real system, you'd have separate inventory records per location
    const inventory = await this.getInventory(productId);
    if (!inventory || inventory.quantity < quantity) {
      return false;
    }

    // For this simple implementation, just update the location
    await db.update<Inventory>('inventory', inventory.id, {
      location: toLocation,
      lastUpdated: new Date()
    });

    return true;
  }

  async getInventoryByLocation(location: string): Promise<Inventory[]> {
    return db.find<Inventory>('inventory', { location });
  }

  async getInventoryStats(): Promise<{
    totalProducts: number;
    totalStock: number;
    totalReserved: number;
    lowStockCount: number;
    outOfStockCount: number;
    locations: string[];
  }> {
    const allInventory = await this.getAllInventory();
    const lowStock = await this.getLowStockItems(10);
    const outOfStock = await this.getOutOfStockItems();
    const locations = [...new Set(allInventory.map(inv => inv.location))];

    return {
      totalProducts: allInventory.length,
      totalStock: allInventory.reduce((sum, inv) => sum + inv.quantity, 0),
      totalReserved: allInventory.reduce((sum, inv) => sum + inv.reservedQuantity, 0),
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      locations
    };
  }

  async bulkUpdateInventory(updates: Array<{ productId: string; quantity: number }>): Promise<boolean> {
    try {
      for (const update of updates) {
        await this.updateStock(update.productId, update.quantity);
      }
      return true;
    } catch (error) {
      console.error('Bulk inventory update failed:', error);
      return false;
    }
  }
}

export const inventoryService = new InventoryService();
