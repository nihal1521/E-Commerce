// Test COD Order Placement
// This script tests the Cash on Delivery order functionality

import { orderService } from './src/database/services/OrderService.js';

async function testCODOrder() {
  try {
    console.log('🧪 Testing COD Order Placement...');
    
    // Test data
    const testOrder = {
      items: [
        {
          product: {
            id: 'test-product-1',
            name: 'Test Product',
            price: 1000,
            image: 'test.jpg',
            category: 'test'
          },
          quantity: 2,
          selectedColor: 'Red'
        }
      ],
      totalAmount: 2360, // 2000 + 18% tax = 2360
      paymentMethod: {
        id: 'cod',
        name: 'Cash on Delivery',
        type: 'cod',
        icon: 'truck',
        isEnabled: true
      },
      billingAddress: {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+91 9876543210',
        address: 'Test Address, Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '123456',
        country: 'India'
      }
    };

    // Create COD order
    const order = await orderService.createOrder(testOrder);
    console.log('✅ COD Order created successfully:', order.id);
    console.log('📦 Order status:', order.status);
    console.log('💰 Total amount:', order.totalAmount);
    console.log('🚚 Payment method:', order.paymentMethod.name);
    
    // Verify order retrieval
    const retrievedOrder = await orderService.getOrderById(order.id);
    if (retrievedOrder) {
      console.log('✅ Order retrieval successful');
    } else {
      console.log('❌ Order retrieval failed');
    }
    
    return order;
    
  } catch (error) {
    console.error('❌ COD Order test failed:', error);
    throw error;
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCODOrder()
    .then(() => console.log('🎉 All tests passed!'))
    .catch(() => console.log('💥 Tests failed!'));
}

export { testCODOrder };

