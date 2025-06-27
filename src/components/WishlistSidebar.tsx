import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useProducts } from '../hooks/useDatabase';
import { Product } from '../types';

export default function WishlistSidebar() {
  const { state, dispatch } = useApp();
  const { products } = useProducts();

  const wishlistProducts = products.filter((product: Product) => 
    state.wishlist.includes(product.id)
  );

  const addToCart = (product: Product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity: 1 }
    });
    // Show success feedback
    dispatch({ type: 'SET_CART_OPEN', payload: true });
    dispatch({ type: 'SET_WISHLIST_OPEN', payload: false });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const closeSidebar = () => {
    dispatch({ type: 'SET_WISHLIST_OPEN', payload: false });
  };

  if (!state.isWishlistOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-pink-500 mr-2" />
            <h2 className="text-lg font-semibold">Wishlist</h2>
            <span className="ml-2 bg-pink-100 text-pink-800 text-sm px-2 py-1 rounded-full">
              {state.wishlist.length}
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close wishlist"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {wishlistProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">
                Save items you love by clicking the heart icon
              </p>
              <button
                onClick={closeSidebar}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Wishlist Items */
            <div className="p-4 space-y-4">
              {wishlistProducts.map((product: Product) => (
                <div key={product.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center px-3 py-1.5 bg-pink-600 text-white text-sm rounded-md hover:bg-pink-700 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <button
              onClick={() => {
                wishlistProducts.forEach((product: Product) => addToCart(product));
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Add All to Cart ({wishlistProducts.length} items)
            </button>
            <button
              onClick={() => {
                state.wishlist.forEach(productId => 
                  dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })
                );
              }}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </>
  );
}
