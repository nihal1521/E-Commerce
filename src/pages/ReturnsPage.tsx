import { CreditCard, Package, Phone, RotateCcw } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-neutral-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-inter">
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold font-playfair text-neutral-900 mb-6">Return Policy</h2>
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-600 font-inter mb-4">
              We offer a <strong>30-day return policy</strong> from the date of delivery. Items must be returned in their original condition with all tags attached.
            </p>
            <h3 className="text-lg font-semibold font-playfair text-neutral-900 mb-3">Eligible for Return:</h3>
            <ul className="space-y-2 text-neutral-600 font-inter mb-6">
              <li>• Items in original condition with tags attached</li>
              <li>• Unused accessories and jewelry</li>
              <li>• Items with original packaging</li>
              <li>• Defective or damaged products</li>
            </ul>
            <h3 className="text-lg font-semibold font-playfair text-neutral-900 mb-3">Not Eligible for Return:</h3>
            <ul className="space-y-2 text-neutral-600 font-inter">
              <li>• Personalized or customized items</li>
              <li>• Items without original tags</li>
              <li>• Used or worn accessories</li>
              <li>• Items returned after 30 days</li>
            </ul>
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-playfair text-neutral-900 mb-8 text-center">Return Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold font-playfair text-neutral-900 mb-2">1. Contact Us</h3>
              <p className="text-neutral-600 font-inter">
                Email us at returns@knotara.com or call us to initiate a return
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="font-semibold font-playfair text-neutral-900 mb-2">2. Pack & Ship</h3>
              <p className="text-neutral-600 font-inter">
                Pack the item securely and ship using our prepaid return label
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold font-playfair text-neutral-900 mb-2">3. Get Refund</h3>
              <p className="text-neutral-600 font-inter">
                Receive your refund within 5-7 business days after we receive the item
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <div className="flex items-center mb-6">
            <RotateCcw className="h-8 w-8 text-accent-600 mr-3" />
            <h2 className="text-2xl font-bold font-playfair text-neutral-900">Exchange Policy</h2>
          </div>
          <p className="text-neutral-600 font-inter mb-4">
            We offer exchanges for size or color changes within 30 days of delivery. The exchanged item must be of equal or lesser value.
          </p>
          <h3 className="text-lg font-semibold font-playfair text-neutral-900 mb-3">Exchange Process:</h3>
          <ol className="space-y-2 text-neutral-600 font-inter">
            <li>1. Contact our customer service team</li>
            <li>2. Receive exchange authorization and shipping label</li>
            <li>3. Send the original item back to us</li>
            <li>4. We'll ship your new item within 2-3 business days</li>
          </ol>
        </div>

        {/* Refund Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold font-playfair text-neutral-900 mb-6">Refund Timeline</h3>
            <ul className="space-y-3 text-neutral-600 font-inter">
              <li>• <strong>Credit/Debit Cards:</strong> 5-7 business days</li>
              <li>• <strong>UPI/Wallets:</strong> 2-3 business days</li>
              <li>• <strong>Net Banking:</strong> 3-5 business days</li>
              <li>• <strong>Cash on Delivery:</strong> Bank transfer in 7-10 days</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold font-playfair text-neutral-900 mb-6">Need Help?</h3>
            <p className="text-neutral-600 font-inter mb-4">
              Our customer service team is here to help with any questions about returns or exchanges.
            </p>
            <div className="space-y-2">
              <p className="text-neutral-600 font-inter">
                <strong>Email:</strong> returns@knotara.com
              </p>
              <p className="text-neutral-600 font-inter">
                <strong>Phone:</strong> +91 12345 67890
              </p>
              <p className="text-neutral-600 font-inter">
                <strong>Hours:</strong> Mon-Sat, 9AM-6PM IST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
