import { Building, CreditCard, Smartphone, Truck } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
}

export function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {
  const getIcon = () => {
    switch (method.icon) {
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

  return (
    <div
      onClick={onSelect}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          isSelected ? 'bg-purple-100' : 'bg-gray-100'
        }`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{method.name}</p>
        </div>
        <div className={`w-4 h-4 rounded-full border-2 ${
          isSelected
            ? 'border-purple-500 bg-purple-500'
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <div className="w-full h-full rounded-full bg-white scale-50"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export const paymentMethods: PaymentMethod[] = [
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
