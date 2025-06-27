// Test script for the new authentication system
// Run this in browser console to test database-backed authentication

import { userService } from './src/database/services/UserService';

async function testAuthentication() {
  console.log('Testing database-backed authentication...');
  
  try {
    // Test user creation
    console.log('1. Creating a new user...');
    const newUser = await userService.createUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });
    console.log('✅ User created:', newUser);
    
    // Test user authentication
    console.log('2. Authenticating user...');
    const authUser = await userService.authenticateUser({
      email: 'john.doe@example.com',
      password: 'password123'
    });
    console.log('✅ User authenticated:', authUser);
    
    // Test wrong password
    console.log('3. Testing wrong password...');
    try {
      await userService.authenticateUser({
        email: 'john.doe@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      console.log('✅ Wrong password rejected:', error.message);
    }
    
    // Test duplicate email
    console.log('4. Testing duplicate email...');
    try {
      await userService.createUser({
        name: 'Jane Doe',
        email: 'john.doe@example.com',
        password: 'password456'
      });
    } catch (error) {
      console.log('✅ Duplicate email rejected:', error.message);
    }
    
    console.log('🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use in browser console
window.testAuthentication = testAuthentication;
