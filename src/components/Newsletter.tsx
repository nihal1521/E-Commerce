import { CheckCircle, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="h-16 w-16 text-white mx-auto mb-6 opacity-90" />
        
        <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white mb-4">
          Stay in Style
        </h2>
        
        <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed font-inter">
          Get exclusive access to new collections, special offers, and style tips. 
          Join our community of fashion lovers!
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center text-white">
            <CheckCircle className="h-6 w-6 mr-2" />
            <span className="text-lg font-medium font-inter">Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-full text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-4 focus:ring-white/30 font-inter"
              />
              <button
                type="submit"
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold font-inter hover:bg-neutral-100 transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        )}

        <p className="text-sm text-primary-100 mt-6 opacity-80 font-inter">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}