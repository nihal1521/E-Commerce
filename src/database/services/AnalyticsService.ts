import { Analytics } from '../../types';
import { db } from './DatabaseService';

export class AnalyticsService {
  
  async trackPageView(productId?: string, userId?: string, metadata?: Record<string, any>): Promise<Analytics> {
    return this.trackEvent('view', productId, userId, metadata);
  }

  async trackProductClick(productId: string, userId?: string, metadata?: Record<string, any>): Promise<Analytics> {
    return this.trackEvent('click', productId, userId, metadata);
  }

  async trackPurchase(productId: string, userId?: string, metadata?: Record<string, any>): Promise<Analytics> {
    return this.trackEvent('purchase', productId, userId, metadata);
  }

  async trackCartAdd(productId: string, userId?: string, metadata?: Record<string, any>): Promise<Analytics> {
    return this.trackEvent('cart_add', productId, userId, metadata);
  }

  async trackCartRemove(productId: string, userId?: string, metadata?: Record<string, any>): Promise<Analytics> {
    return this.trackEvent('cart_remove', productId, userId, metadata);
  }

  private async trackEvent(
    eventType: Analytics['eventType'], 
    productId?: string, 
    userId?: string, 
    metadata: Record<string, any> = {}
  ): Promise<Analytics> {
    const sessionId = this.getSessionId();
    
    const event: Omit<Analytics, 'id'> = {
      eventType,
      productId,
      userId,
      sessionId,
      timestamp: new Date(),
      metadata
    };

    return db.trackEvent(event);
  }

  async getProductAnalytics(productId: string, days: number = 30): Promise<{
    views: number;
    clicks: number;
    cartAdds: number;
    purchases: number;
    conversionRate: number;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await db.getAnalytics(undefined, startDate);
    const productAnalytics = analytics.filter(event => event.productId === productId);

    const views = productAnalytics.filter(e => e.eventType === 'view').length;
    const clicks = productAnalytics.filter(e => e.eventType === 'click').length;
    const cartAdds = productAnalytics.filter(e => e.eventType === 'cart_add').length;
    const purchases = productAnalytics.filter(e => e.eventType === 'purchase').length;

    const conversionRate = views > 0 ? (purchases / views) * 100 : 0;

    return {
      views,
      clicks,
      cartAdds,
      purchases,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  }

  async getTopProducts(days: number = 30, limit: number = 10): Promise<Array<{
    productId: string;
    views: number;
    purchases: number;
  }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await db.getAnalytics(undefined, startDate);
    const productStats = new Map<string, { views: number; purchases: number }>();

    analytics.forEach(event => {
      if (!event.productId) return;

      if (!productStats.has(event.productId)) {
        productStats.set(event.productId, { views: 0, purchases: 0 });
      }

      const stats = productStats.get(event.productId)!;
      if (event.eventType === 'view') {
        stats.views++;
      } else if (event.eventType === 'purchase') {
        stats.purchases++;
      }
    });

    return Array.from(productStats.entries())
      .map(([productId, stats]) => ({ productId, ...stats }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  async getDashboardStats(days: number = 30): Promise<{
    totalViews: number;
    totalClicks: number;
    totalPurchases: number;
    uniqueVisitors: number;
    conversionRate: number;
    topProducts: Array<{ productId: string; views: number }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await db.getAnalytics(undefined, startDate);
    
    const totalViews = analytics.filter(e => e.eventType === 'view').length;
    const totalClicks = analytics.filter(e => e.eventType === 'click').length;
    const totalPurchases = analytics.filter(e => e.eventType === 'purchase').length;
    
    const uniqueVisitors = new Set(analytics.map(e => e.sessionId)).size;
    const conversionRate = totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0;
    
    const topProducts = await this.getTopProducts(days, 5);

    return {
      totalViews,
      totalClicks,
      totalPurchases,
      uniqueVisitors,
      conversionRate: Math.round(conversionRate * 100) / 100,
      topProducts
    };
  }

  async getAnalyticsByDateRange(startDate: Date, endDate: Date, eventType?: string): Promise<Analytics[]> {
    return db.getAnalytics(eventType, startDate, endDate);
  }

  private getSessionId(): string {
    // Get or create session ID from localStorage
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  async clearOldAnalytics(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const allAnalytics = await db.find<Analytics>('analytics');
    const oldAnalytics = allAnalytics.filter(event => 
      new Date(event.timestamp) < cutoffDate
    );

    // Remove old analytics
    for (const event of oldAnalytics) {
      await db.delete('analytics', event.id);
    }

    return oldAnalytics.length;
  }
}

export const analyticsService = new AnalyticsService();
