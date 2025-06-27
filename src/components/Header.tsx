import { Heart, LogOut, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/products';
import SearchSuggestions from './SearchSuggestions';

export default function Header() {
  const { state, dispatch } = useApp();
  const { authState, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: searchInput.trim() });
      navigate('/search');
      setShowSuggestions(false);
      setShowMobileSearch(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    dispatch({ type: 'SET_SEARCH_QUERY', payload: suggestion });
    navigate('/search');
    setShowSuggestions(false);
    setShowMobileSearch(false);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setShowSuggestions(value.length > 0 || true); // Show suggestions even when empty for recent/popular searches
  };

  const handleSearchInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleAuthAction = () => {
    if (authState.isAuthenticated) {
      logout();
    } else {
      dispatch({ type: 'TOGGLE_AUTH_MODAL' });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-neutral-200">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 py-2 text-center text-sm">
        <p className="text-white font-medium">✨ Free shipping on orders above ₹999 | 30-day returns ✨</p>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-bold text-2xl font-caveat shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              Knotara
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 relative group"
              >
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search, User, Wishlist, Cart */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block relative" ref={searchContainerRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onFocus={handleSearchInputFocus}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
              <SearchSuggestions
                searchQuery={searchInput}
                onSuggestionClick={handleSuggestionClick}
                onProductClick={() => setShowSuggestions(false)}
                isVisible={showSuggestions}
              />
            </div>

            {/* Mobile search button */}
            <button 
              className="md:hidden p-2"
              aria-label="Search products"
            >
              <Search className="h-6 w-6 text-gray-600" />
            </button>

            {/* User */}
            <button
              onClick={handleAuthAction}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center"
              aria-label={authState.isAuthenticated ? 'Sign out' : 'Sign in'}
            >
              {authState.isAuthenticated ? (
                <>
                  <LogOut className="h-6 w-6 text-gray-600" />
                  <span className="hidden md:ml-2 md:block text-sm text-gray-700">
                    {authState.user?.name || 'Sign Out'}
                  </span>
                </>
              ) : (
                <User className="h-6 w-6 text-gray-600" />
              )}
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_WISHLIST' })}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="View wishlist"
            >
              <Heart className="h-6 w-6 text-gray-600" />
              {state.wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingBag className="h-6 w-6 text-gray-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            {/* Mobile navigation */}
            <nav className="space-y-2">
              {categories.map(category => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-gray-700 hover:text-pink-600 font-medium border-b border-gray-100"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}