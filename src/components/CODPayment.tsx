import { MapPin, Phone, Truck, User } from 'lucide-react';
import { useState } from 'react';

interface CODPaymentProps {
  amount: number;
  onOrderConfirm: () => void;
}

export default function CODPayment({ amount, onOrderConfirm }: CODPaymentProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const handleConfirmOrder = async () => {
    setIsConfirming(true);
    
    // Simulate order confirmation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConfirming(false);
    onOrderConfirm();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Truck className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Cash on Delivery</h3>
        <p className="text-gray-600">Pay when your order is delivered</p>
      </div>

      {/* Amount */}
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Amount to Pay on Delivery</p>
        <p className="text-2xl font-bold text-green-600">₹{amount}</p>
      </div>

      {/* COD Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          How Cash on Delivery Works
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="font-semibold mr-2">1.</span>
            <span>Your order will be prepared and shipped to your address</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <span>Our delivery partner will contact you before delivery</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <span>Pay the exact amount in cash when you receive your order</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">4.</span>
            <span>Please keep the exact change ready</span>
          </li>
        </ul>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Notes (Optional)
        </label>
        <textarea
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          placeholder="Any special instructions for delivery (e.g., apartment number, best time to deliver, etc.)"
        />
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          Important Notes
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Please ensure someone is available at the delivery address</li>
          <li>• COD orders may take 1-2 extra days for processing</li>
          <li>• COD fee of ₹50 is included in the total amount</li>
          <li>• Orders above ₹2000 may require advance verification</li>
        </ul>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmOrder}
        disabled={isConfirming}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isConfirming ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Confirming Order...
          </>
        ) : (
          <>
            <User className="h-5 w-5 mr-2" />
            Confirm Cash on Delivery Order
          </>
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        <p>No payment required now. Pay when you receive your order.</p>
      </div>
    </div>
  );
}
