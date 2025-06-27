import { Clock, MapPin, Shield, Truck } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-neutral-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-inter">
            Fast, reliable delivery to your doorstep
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-playfair text-neutral-900">Standard Delivery</h3>
                <p className="text-neutral-600 font-inter">5-7 business days</p>
              </div>
            </div>
            <ul className="space-y-3 text-neutral-600 font-inter">
              <li>• Free shipping on orders over ₹1,000</li>
              <li>• ₹99 shipping fee for orders under ₹1,000</li>
              <li>• Tracking information provided</li>
              <li>• Signature required on delivery</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-playfair text-neutral-900">Express Delivery</h3>
                <p className="text-neutral-600 font-inter">1-3 business days</p>
              </div>
            </div>
            <ul className="space-y-3 text-neutral-600 font-inter">
              <li>• ₹199 shipping fee</li>
              <li>• Priority processing</li>
              <li>• Real-time tracking</li>
              <li>• Delivered by 6 PM</li>
            </ul>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold font-playfair text-neutral-900 mb-6">Shipping Zones</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold font-inter text-neutral-900 mb-2">Zone 1</h3>
              <p className="text-sm text-neutral-600 font-inter">
                Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad
              </p>
              <p className="text-sm font-semibold text-primary-600 font-inter mt-2">
                1-2 business days
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="font-semibold font-inter text-neutral-900 mb-2">Zone 2</h3>
              <p className="text-sm text-neutral-600 font-inter">
                Other major cities and state capitals
              </p>
              <p className="text-sm font-semibold text-accent-600 font-inter mt-2">
                3-5 business days
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold font-inter text-neutral-900 mb-2">Zone 3</h3>
              <p className="text-sm text-neutral-600 font-inter">
                Remote areas and smaller towns
              </p>
              <p className="text-sm font-semibold text-primary-600 font-inter mt-2">
                5-7 business days
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-primary-600 mr-3" />
              <h3 className="text-xl font-bold font-playfair text-neutral-900">Secure Packaging</h3>
            </div>
            <p className="text-neutral-600 font-inter mb-4">
              All our products are carefully packaged to ensure they reach you in perfect condition.
            </p>
            <ul className="space-y-2 text-neutral-600 font-inter">
              <li>• Eco-friendly packaging materials</li>
              <li>• Bubble wrap protection for fragile items</li>
              <li>• Branded packaging for gift orders</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold font-playfair text-neutral-900 mb-6">Important Notes</h3>
            <ul className="space-y-3 text-neutral-600 font-inter">
              <li>• Orders placed before 2 PM are processed the same day</li>
              <li>• We don't ship on weekends and public holidays</li>
              <li>• Delivery times may vary during festival seasons</li>
              <li>• PO Box addresses are not accepted</li>
              <li>• Someone must be available to receive the package</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
