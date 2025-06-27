import { BillingAddress, CartItem, Order, PaymentMethod } from '../../types';
import { db } from './DatabaseService';

export class OrderService {
  
  async createOrder(orderData: {
    items: CartItem[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    billingAddress: BillingAddress;
    userId?: string;
  }): Promise<Order> {
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      billingAddress: orderData.billingAddress,
      status: 'pending',
      createdAt: new Date(),
      userId: orderData.userId
    };

    return db.insert<Order>('orders', order);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return db.findById<Order>('orders', orderId);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return db.getUserOrders(userId);
  }

  async getAllOrders(options: any = {}): Promise<Order[]> {
    return db.find<Order>('orders', {}, options);
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    return db.update<Order>('orders', orderId, { status });
  }

  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    return db.find<Order>('orders', { status });
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    const allOrders = await this.getAllOrders();
    return allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    const orders = await this.getAllOrders();
    const pending = orders.filter(o => o.status === 'pending').length;
    const completed = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalOrders: orders.length,
      pendingOrders: pending,
      completedOrders: completed,
      totalRevenue,
      averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0
    };
  }

  async cancelOrder(orderId: string): Promise<Order | null> {
    const order = await this.getOrderById(orderId);
    if (!order || order.status !== 'pending') {
      return null;
    }

    return this.updateOrderStatus(orderId, 'cancelled');
  }

  async processOrder(orderId: string): Promise<Order | null> {
    const order = await this.getOrderById(orderId);
    if (!order || order.status !== 'pending') {
      return null;
    }

    // Simulate order processing
    const updatedOrder = await this.updateOrderStatus(orderId, 'confirmed');
    
    // Here you would typically:
    // 1. Process payment
    // 2. Update inventory
    // 3. Send confirmation email
    // 4. Create shipping label
    
    return updatedOrder;
  }
}

export const orderService = new OrderService();
