import { Clock, Search, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useDatabase';
import { Product } from '../types';

interface SearchSuggestionsProps {
  searchQuery: string;
  onSuggestionClick: (suggestion: string) => void;
  onProductClick: () => void;
  isVisible: boolean;
}

export default function SearchSuggestions({ 
  searchQuery, 
  onSuggestionClick, 
  onProductClick,
  isVisible 
}: SearchSuggestionsProps) {
  const { products } = useProducts();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Popular search terms (could be dynamic based on analytics)
  const popularSearches = [
    'earrings',
    'necklace',
    'rings',
    'bracelets',
    'watches',
    'sunglasses',
    'bags',
    'accessories'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        localStorage.removeItem('recentSearches');
      }
    }
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setProductSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Generate text suggestions from product names and categories
    const textSuggestions = new Set<string>();
    
    products.forEach(product => {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      
      // Add matching product names
      if (name.includes(query)) {
        textSuggestions.add(product.name);
      }
      
      // Add matching categories
      if (category.includes(query)) {
        textSuggestions.add(product.category);
      }
      
      // Add partial word matches
      const words = name.split(' ');
      words.forEach(word => {
        if (word.toLowerCase().startsWith(query)) {
          textSuggestions.add(word);
        }
      });
    });

    // Filter and limit suggestions
    const filteredSuggestions = Array.from(textSuggestions)
      .filter(suggestion => suggestion.toLowerCase().includes(query))
      .slice(0, 5);

    setSuggestions(filteredSuggestions);

    // Get product suggestions
    const matchingProducts = products
      .filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
      .slice(0, 3);

    setProductSuggestions(matchingProducts);
  }, [searchQuery, products]);

  const saveSearch = (search: string) => {
    if (!search.trim()) return;
    
    const trimmedSearch = search.trim();
    const newRecentSearches = [
      trimmedSearch,
      ...recentSearches.filter(s => s !== trimmedSearch)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  };

  const handleSuggestionClick = (suggestion: string) => {
    saveSearch(suggestion);
    onSuggestionClick(suggestion);
  };

  const handleProductClick = (product: Product) => {
    saveSearch(product.name);
    onProductClick();
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto"
    >
      {/* Search Query Results */}
      {searchQuery && suggestions.length > 0 && (
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 px-3 py-2">
            Suggestions
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded text-left"
            >
              <Search className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Product Suggestions */}
      {searchQuery && productSuggestions.length > 0 && (
        <div className="border-t border-gray-100 p-2">
          <div className="text-xs font-medium text-gray-500 px-3 py-2">
            Products
          </div>
          {productSuggestions.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              onClick={() => handleProductClick(product)}
              className="flex items-center px-3 py-2 hover:bg-gray-50 rounded"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 object-cover rounded mr-3"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </div>
                <div className="text-sm text-gray-500">
                  ₹{product.price.toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {!searchQuery && recentSearches.length > 0 && (
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 px-3 py-2">
            Recent Searches
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(search)}
              className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded text-left"
            >
              <Clock className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900">{search}</span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {!searchQuery && (
        <div className={`p-2 ${recentSearches.length > 0 ? 'border-t border-gray-100' : ''}`}>
          <div className="text-xs font-medium text-gray-500 px-3 py-2">
            Popular Searches
          </div>
          {popularSearches.slice(0, 6).map((search, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(search)}
              className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded text-left"
            >
              <TrendingUp className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900 capitalize">{search}</span>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchQuery && suggestions.length === 0 && productSuggestions.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No suggestions found</p>
        </div>
      )}
    </div>
  );
}
