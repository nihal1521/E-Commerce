import { BarChart3, Database, Download, Package, ShoppingCart, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    analyticsService,
    db,
    exportDatabase,
    inventoryService,
    orderService,
    productService,
    resetDatabase
} from '../database';

interface DatabaseStats {
  collections: Record<string, { count: number; indexes: number }>;
  totalDocuments: number;
  lastUpdated: string;
}

export default function DatabaseAdmin() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [productStats, setProductStats] = useState<any>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [inventoryStats, setInventoryStats] = useState<any>(null);
  const [analyticsStats, setAnalyticsStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exportData, setExportData] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load general database stats
      const dbStats = await db.getStats();
      setStats(dbStats);

      // Load specific service stats
      const productStatsData = await productService.getProductStats();
      setProductStats(productStatsData);

      const orderStatsData = await orderService.getOrderStats();
      setOrderStats(orderStatsData);

      const inventoryStatsData = await inventoryService.getInventoryStats();
      setInventoryStats(inventoryStatsData);

      const analyticsStatsData = await analyticsService.getDashboardStats();
      setAnalyticsStats(analyticsStatsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportDatabase = async () => {
    try {
      const data = await exportDatabase();
      const jsonString = JSON.stringify(data, null, 2);
      setExportData(jsonString);
      
      // Create download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `database-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting database:', error);
      alert('Failed to export database');
    }
  };

  const handleResetDatabase = async () => {
    if (window.confirm('Are you sure you want to reset the database? This will remove all orders, users, and analytics data.')) {
      try {
        await resetDatabase();
        await loadDashboardData();
        alert('Database reset successfully');
      } catch (error) {
        console.error('Error resetting database:', error);
        alert('Failed to reset database');
      }
    }
  };

  const handleImportDatabase = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Here you would call importDatabase function
      console.log('Import data:', data);
      alert('Database import functionality would be implemented here');
      
    } catch (error) {
      console.error('Error importing database:', error);
      alert('Failed to import database. Please check the file format.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Database Administration</h1>
          </div>
          <p className="text-gray-600">Monitor and manage your e-commerce database</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleExportDatabase}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export Database</span>
          </button>
          
          <label className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="h-5 w-5" />
            <span>Import Database</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportDatabase}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleResetDatabase}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Database className="h-5 w-5" />
            <span>Reset Database</span>
          </button>
        </div>

        {/* Database Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
                </div>
                <Database className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Collections</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.collections).length}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.collections.products?.count || 0}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.collections.orders?.count || 0}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Stats */}
          {productStats && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Product Statistics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-semibold">{productStats.totalProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-semibold">{productStats.categoriesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Price</span>
                  <span className="font-semibold">₹{productStats.averagePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Out of Stock</span>
                  <span className="font-semibold text-red-600">{productStats.outOfStockCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Stats */}
          {orderStats && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Order Statistics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">{orderStats.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-semibold text-yellow-600">{orderStats.pendingOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Orders</span>
                  <span className="font-semibold text-green-600">{orderStats.completedOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold">₹{orderStats.totalRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Order Value</span>
                  <span className="font-semibold">₹{orderStats.averageOrderValue}</span>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Stats */}
          {inventoryStats && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Inventory Statistics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Stock</span>
                  <span className="font-semibold">{inventoryStats.totalStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reserved Stock</span>
                  <span className="font-semibold text-yellow-600">{inventoryStats.totalReserved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low Stock Items</span>
                  <span className="font-semibold text-orange-600">{inventoryStats.lowStockCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Out of Stock</span>
                  <span className="font-semibold text-red-600">{inventoryStats.outOfStockCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Locations</span>
                  <span className="font-semibold">{inventoryStats.locations.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Stats */}
          {analyticsStats && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Analytics (Last 30 Days)</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-semibold">{analyticsStats.totalViews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Clicks</span>
                  <span className="font-semibold">{analyticsStats.totalClicks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Purchases</span>
                  <span className="font-semibold">{analyticsStats.totalPurchases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unique Visitors</span>
                  <span className="font-semibold">{analyticsStats.uniqueVisitors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-green-600">{analyticsStats.conversionRate}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collection Details */}
        {stats && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Collection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indexes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(stats.collections).map(([name, info]) => (
                    <tr key={name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {info.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {info.indexes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
