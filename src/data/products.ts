import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Keychains',
    slug: 'keychains',
    image: 'https://images.pexels.com/photos/6249362/pexels-photo-6249362.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Stylish keychains to accessorize your keys'
  },
  {
    id: '2',
    name: 'Wrist Keychains',
    slug: 'wrist-keychains',
    image: 'https://images.pexels.com/photos/5442464/pexels-photo-5442464.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Convenient wrist keychains for hands-free carrying'
  },
  {
    id: '3',
    name: 'Hair Accessories',
    slug: 'hair-accessories',
    image: 'https://images.pexels.com/photos/6663331/pexels-photo-6663331.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Beautiful hair accessories for every style'
  },
  {
    id: '4',
    name: 'Handbags',
    slug: 'handbags',
    image: '/WhatsApp Image 2025-06-24 at 19.51.59_2edd5ace.jpg',
    description: 'Elegant handcrafted handbags for the modern woman'
  }
];

export const products: Product[] = [
  // Keychains
  {
    id: '1',
    name: 'Classic Leather Keychain',
    price: 299,
    originalPrice: 399,
    image: 'https://images.pexels.com/photos/6249362/pexels-photo-6249362.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/6249362/pexels-photo-6249362.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7319337/pexels-photo-7319337.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'keychains',
    description: 'Premium leather keychain crafted with attention to detail',
    material: 'Genuine Leather',
    colors: ['Brown', 'Black', 'Tan'],
    isNew: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Metallic Chain Keychain',
    price: 199,
    image: 'https://images.pexels.com/photos/7319337/pexels-photo-7319337.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/7319337/pexels-photo-7319337.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'keychains',
    description: 'Stylish metallic keychain with chain details',
    material: 'Metal Alloy',
    colors: ['Silver', 'Gold', 'Rose Gold'],
    rating: 4.5,
    reviews: 89
  },
  // Wrist Keychains
  {
    id: '3',
    name: 'Beaded Wrist Keychain',
    price: 349,
    image: 'https://images.pexels.com/photos/5442464/pexels-photo-5442464.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/5442464/pexels-photo-5442464.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'wrist-keychains',
    description: 'Comfortable beaded wrist keychain with elastic band',
    material: 'Beads & Elastic',
    colors: ['Multi', 'Blue', 'Pink'],
    isBestSeller: true,
    rating: 4.7,
    reviews: 156
  },
  // Hair Accessories
  {
    id: '4',
    name: 'Pearl Hair Clips Set',
    price: 449,
    originalPrice: 599,
    image: 'https://images.pexels.com/photos/6663331/pexels-photo-6663331.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/6663331/pexels-photo-6663331.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'hair-accessories',
    description: 'Elegant pearl hair clips set for special occasions',
    material: 'Pearl & Metal',
    colors: ['White', 'Cream', 'Silver'],
    isNew: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: '5',
    name: 'Silk Hair Scrunchies',
    price: 249,
    image: 'https://images.pexels.com/photos/6663331/pexels-photo-6663331.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/6663331/pexels-photo-6663331.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'hair-accessories',
    description: 'Luxurious silk scrunchies gentle on your hair',
    material: 'Pure Silk',
    colors: ['Pink', 'Lavender', 'Beige'],
    rating: 4.6,
    reviews: 178
  },
  // Handbags - Updated with your images
  {
    id: '6',
    name: 'Handwoven Macrame Crossbody Bag - Red',
    price: 1299,
    originalPrice: 1599,
    image: '/WhatsApp Image 2025-06-24 at 19.52.01_9bc40c6e.jpg',
    images: [
      '/WhatsApp Image 2025-06-24 at 19.52.01_9bc40c6e.jpg'
    ],
    category: 'handbags',
    description: 'Beautiful handwoven macrame crossbody bag with intricate knotwork pattern. Features the Knotayac signature label and comes with a comfortable wrist strap.',
    material: 'Handwoven Macrame Cord',
    colors: ['Red', 'Pink', 'Burgundy'],
    isBestSeller: true,
    rating: 4.8,
    reviews: 334
  },
  {
    id: '7',
    name: 'Macrame Mini Handbag - Cream & Brown',
    price: 899,
    image: '/WhatsApp Image 2025-06-24 at 19.51.59_2edd5ace.jpg',
    images: [
      '/WhatsApp Image 2025-06-24 at 19.51.59_2edd5ace.jpg'
    ],
    category: 'handbags',
    description: 'Elegant mini handbag with beautiful macrame pattern in cream and brown. Perfect for casual outings with leather handle for comfort.',
    material: 'Macrame Cord & Leather Handle',
    colors: ['Cream', 'Brown', 'Beige'],
    rating: 4.4,
    reviews: 267
  },
  {
    id: '8',
    name: 'Artisan Macrame Tote - White',
    price: 1199,
    image: '/WhatsApp Image 2025-06-24 at 19.52.00_ceeb7f52.jpg',
    images: [
      '/WhatsApp Image 2025-06-24 at 19.52.00_ceeb7f52.jpg'
    ],
    category: 'handbags',
    description: 'Spacious macrame tote bag with wooden handles. Features intricate handwoven patterns perfect for everyday use or special occasions.',
    material: 'Macrame Cord & Wood Handles',
    colors: ['White', 'Cream', 'Natural'],
    isNew: true,
    rating: 4.7,
    reviews: 145
  },
  {
    id: '9',
    name: 'Boho Macrame Shoulder Bag - Blue',
    price: 1099,
    image: '/WhatsApp Image 2025-06-24 at 19.52.02_d4e1f86f.jpg',
    images: [
      '/WhatsApp Image 2025-06-24 at 19.52.02_d4e1f86f.jpg'
    ],
    category: 'handbags',
    description: 'Stylish boho-inspired macrame shoulder bag in beautiful blue. Features leather straps and the signature Knotayac craftsmanship.',
    material: 'Macrame Cord & Leather Straps',
    colors: ['Blue', 'Navy', 'Teal'],
    isNew: true,
    rating: 4.6,
    reviews: 189
  }
];