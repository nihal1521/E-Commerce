import { Building, Check, CreditCard, Lock, Smartphone, Truck, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../database/services/OrderService';
import { BillingAddress, CardDetails, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: 'card',
    isEnabled: true
  },
  {
    id: 'upi',
    name: 'UPI Payment',
    type: 'wallet',
    icon: 'smartphone',
    isEnabled: true
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    type: 'bank',
    icon: 'building',
    isEnabled: true
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    type: 'cod',
    icon: 'truck',
    isEnabled: true
  }
];

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state, dispatch } = useApp();
  const { authState } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'card':
        return <CreditCard className="h-6 w-6" />;
      case 'smartphone':
        return <Smartphone className="h-6 w-6" />;
      case 'building':
        return <Building className="h-6 w-6" />;
      case 'truck':
        return <Truck className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      setOrderError('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    setOrderError(null);
    
    try {
      const totalAmount = getTotalPrice() + Math.round(getTotalPrice() * 0.18); // Including tax
      
      // Create order in database
      const order = await orderService.createOrder({
        items: state.cart,
        totalAmount,
        paymentMethod: selectedPaymentMethod,
        billingAddress,
        userId: authState.user?.id
      });

      // For COD, order is immediately placed
      if (selectedPaymentMethod.type === 'cod') {
        // Clear cart and close modal
        dispatch({ type: 'CLEAR_CART' });
        setIsProcessing(false);
        onClose();
        
        // Show success message
        alert(`Order #${order.id} placed successfully! You can pay when the order is delivered.`);
        return;
      }

      // For other payment methods, simulate payment processing
      if (selectedPaymentMethod.type === 'card') {
        // Validate card details
        if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
          setOrderError('Please fill in all card details');
          setIsProcessing(false);
          return;
        }
        
        // Simulate card payment processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Update order status to confirmed
        await orderService.updateOrderStatus(order.id, 'confirmed');
      } else {
        // Simulate other payment methods (UPI, net banking)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update order status to confirmed
        await orderService.updateOrderStatus(order.id, 'confirmed');
      }
      
      // Clear cart and close modal
      dispatch({ type: 'CLEAR_CART' });
      setIsProcessing(false);
      onClose();
      
      // Show success message
      alert(`Order #${order.id} placed successfully! Payment has been processed.`);
      
    } catch (error) {
      console.error('Order placement failed:', error);
      setOrderError('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const isFormValid = () => {
    const addressValid = billingAddress.fullName && billingAddress.email && 
                        billingAddress.phone && billingAddress.address && 
                        billingAddress.city && billingAddress.state && billingAddress.zipCode;
    
    if (selectedPaymentMethod?.type === 'card') {
      return addressValid && cardDetails.cardNumber && cardDetails.expiryDate && 
             cardDetails.cvv && cardDetails.cardholderName;
    }
    
    return addressValid && selectedPaymentMethod;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <p className="text-gray-600">Complete your purchase</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <span className="font-medium">Billing Address</span>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
                </div>
                <span className="font-medium">Payment Method</span>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="font-medium">Review & Pay</span>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
              {/* Step 1: Billing Address */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={billingAddress.fullName}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={billingAddress.email}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={billingAddress.phone}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        value={billingAddress.country}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={billingAddress.address}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter your full address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={billingAddress.zipCode}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your ZIP code"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Choose Payment Method</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod?.id === method.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            selectedPaymentMethod?.id === method.id ? 'bg-purple-100' : 'bg-gray-100'
                          }`}>
                            {getIcon(method.icon)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{method.name}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod?.id === method.id
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPaymentMethod?.id === method.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Details Form */}
                  {selectedPaymentMethod?.type === 'card' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Card Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardDetails.cardholderName}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Name on card"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                          <input
                            type="text"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COD Information */}
                  {selectedPaymentMethod?.type === 'cod' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-4 flex items-center">
                        <Truck className="h-5 w-5 mr-2" />
                        Cash on Delivery
                      </h4>
                      <div className="space-y-3 text-sm text-green-800">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">✓</span>
                          <span>Pay ₹{getTotalPrice() + Math.round(getTotalPrice() * 0.18)} when your order is delivered</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">✓</span>
                          <span>No advance payment required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">✓</span>
                          <span>Our delivery partner will contact you before delivery</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">✓</span>
                          <span>Please keep exact change ready</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review & Pay */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Review Your Order</h3>
                  
                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {state.cart.map((item) => (
                        <div key={`${item.product.id}-${item.selectedColor}`} className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{item.product.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              {item.selectedColor && (
                                <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
                              )}
                            </div>
                          </div>
                          <p className="font-medium">₹{item.product.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Billing Address Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Billing Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>{billingAddress.fullName}</p>
                      <p>{billingAddress.address}</p>
                      <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                      <p>{billingAddress.country}</p>
                      <p>{billingAddress.phone}</p>
                      <p>{billingAddress.email}</p>
                    </div>
                  </div>

                  {/* Payment Method Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        {selectedPaymentMethod && getIcon(selectedPaymentMethod.icon)}
                      </div>
                      <p className="text-gray-900">{selectedPaymentMethod?.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-80 bg-gray-50 p-6 border-l">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{Math.round(getTotalPrice() * 0.18)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{getTotalPrice() + Math.round(getTotalPrice() * 0.18)}</span>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {orderError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{orderError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      (currentStep === 1 && (!billingAddress.fullName || !billingAddress.email || !billingAddress.phone || !billingAddress.address || !billingAddress.city || !billingAddress.state || !billingAddress.zipCode)) ||
                      (currentStep === 2 && !selectedPaymentMethod)
                    }
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!isFormValid() || isProcessing}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
                
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure SSL encrypted payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
