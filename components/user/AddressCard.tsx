'use client';

import { IAddress } from '@/types';
import { Edit, Trash2, MapPin, CheckCircle, User, Phone } from 'lucide-react';

interface AddressCardProps {
  address: IAddress & { _id: string };
  onEdit: (address: IAddress & { _id: string }) => void;
  onDelete: (id: string) => void;
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div 
      className={`relative bg-white rounded-lg p-5 transition-all duration-200 group ${
        address.isDefault 
          ? 'border border-[#F68B1E] shadow-[0_0_0_1px_rgba(246,139,30,1)]' 
          : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute -top-3 left-4 bg-[#F68B1E] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Default Address
        </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start mb-4 mt-2">
         <div className="space-y-1">
            <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-gray-900 capitalize text-sm">{address.fullName}</h3>
            </div>
            <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">{address.phone}</p>
            </div>
         </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mb-3" />

      {/* Address Details */}
      <div className="flex items-start gap-3 mb-5">
        <MapPin className="w-4 h-4 text-[#F68B1E] mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-600 leading-relaxed">
          <p className="font-medium text-gray-800">{address.street}</p>
          <p>{address.city}, {address.state}</p>
          <p>{address.zipCode}, {address.country}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onEdit(address)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#F68B1E] border border-[#F68B1E] rounded hover:bg-orange-50 transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
        
        {/* Only allow delete if not default (optional logic, but good UX) or just allow it */}
        <button
          onClick={() => onDelete(address._id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500 border border-gray-200 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}