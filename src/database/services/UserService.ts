import { AuthUser, UserProfile } from '../../types';
import { DatabaseService } from './DatabaseService';

export interface CreateUserData {
  name: string;
  email: string;
  password: string; // In real app, this would be hashed
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export class UserService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  // Create a new user account
  async createUser(userData: CreateUserData): Promise<AuthUser> {
    console.log('UserService: Creating user with data:', {
      name: userData.name,
      email: userData.email,
      passwordProvided: !!userData.password
    });

    // Check if user already exists
    const existingUser = await this.db.findOne<UserProfile>('users', { email: userData.email });
    if (existingUser) {
      console.error('UserService: User already exists with email:', userData.email);
      throw new Error('User with this email already exists');
    }

    console.log('UserService: No existing user found, proceeding with creation');

    // Generate unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('UserService: Generated user ID:', userId);

    // Create user profile
    const newUserProfile: UserProfile = {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: 'customer',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: true,
      },
      addresses: [],
      orders: [],
      // Store password hash (in real app, use bcrypt)
      passwordHash: userData.password, // For demo purposes, storing plain text
    };

    console.log('UserService: Created user profile object:', {
      id: newUserProfile.id,
      name: newUserProfile.name,
      email: newUserProfile.email,
      role: newUserProfile.role
    });

    // Save to database
    try {
      const savedUser = await this.db.insert<UserProfile>('users', newUserProfile);
      console.log('UserService: User saved to database successfully');

      // Return auth user (without sensitive data)
      const authUser = this.toAuthUser(savedUser);
      console.log('UserService: Returning auth user:', authUser);
      return authUser;
    } catch (error) {
      console.error('UserService: Error saving user to database:', error);
      throw error;
    }
  }

  // Authenticate user
  async authenticateUser(credentials: AuthCredentials): Promise<AuthUser> {
    const user = await this.db.findOne<UserProfile>('users', { email: credentials.email });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password (in real app, use bcrypt.compare)
    if ((user as any).passwordHash !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await this.db.update<UserProfile>('users', user.id, {
      lastLoginAt: new Date(),
    });

    return this.toAuthUser(user);
  }

  // Get user by ID
  async getUserById(userId: string): Promise<AuthUser | null> {
    const user = await this.db.findById<UserProfile>('users', userId);
    return user ? this.toAuthUser(user) : null;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.db.findOne<UserProfile>('users', { email });
    return user ? this.toAuthUser(user) : null;
  }

  // Update user profile
  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<AuthUser | null> {
    const updatedUser = await this.db.update<UserProfile>('users', userId, updates);
    return updatedUser ? this.toAuthUser(updatedUser) : null;
  }

  // Delete user account
  async deleteUser(userId: string): Promise<boolean> {
    return this.db.delete('users', userId);
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<AuthUser[]> {
    const users = await this.db.find<UserProfile>('users');
    return users.map(user => this.toAuthUser(user));
  }

  // Convert UserProfile to AuthUser (remove sensitive data)
  private toAuthUser(userProfile: UserProfile): AuthUser {
    return {
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      isVerified: userProfile.isVerified,
      avatar: userProfile.avatar,
      createdAt: userProfile.createdAt,
      lastLoginAt: userProfile.lastLoginAt,
    };
  }

  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation
  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }
}

export const userService = new UserService();
