import { CheckCircle, Copy, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface UPIPaymentProps {
  amount: number;
  onPaymentComplete: () => void;
}

export default function UPIPayment({ amount, onPaymentComplete }: UPIPaymentProps) {
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const merchantUpiId = 'merchant@paytm'; // Example UPI ID
  const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=Your Store&am=${amount}&cu=INR&tn=Payment for order`;

  const handleUpiPayment = async () => {
    if (!upiId) return;
    
    setIsProcessing(true);
    
    // Simulate UPI payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Smartphone className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">UPI Payment</h3>
        <p className="text-gray-600">Pay using any UPI app</p>
      </div>

      {/* Amount */}
      <div className="bg-purple-50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600">Amount to Pay</p>
        <p className="text-2xl font-bold text-purple-600">₹{amount}</p>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        {/* Option 1: Open UPI App */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Option 1: Open UPI App</h4>
          <a
            href={upiUrl}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors block text-center"
          >
            Pay with UPI App
          </a>
          <p className="text-xs text-gray-500 mt-2">This will open your default UPI app</p>
        </div>

        {/* Option 2: Manual UPI ID */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Option 2: Pay to UPI ID</h4>
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">UPI ID</p>
              <p className="font-mono text-gray-900">{merchantUpiId}</p>
            </div>
            <button
              onClick={copyUpiId}
              className="p-3 text-gray-600 hover:text-purple-600 transition-colors"
              title="Copy UPI ID"
            >
              {copied ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="yourname@upi"
              />
            </div>
            
            <button
              onClick={handleUpiPayment}
              disabled={!upiId || isProcessing}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                'Confirm Payment'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Supported UPI Apps: GPay, PhonePe, Paytm, BHIM, and more</p>
      </div>
    </div>
  );
}
