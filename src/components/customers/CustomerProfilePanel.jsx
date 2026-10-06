import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Package, CheckCircle2, Clock, Edit, Trash2, Shield, UserCheck, StickyNote } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';

const CustomerProfilePanel = ({ customer, onClose, onEdit, onDelete, onStatusChange }) => {
  const { shipments } = useShipments();

  if (!customer) return null;

  // Filter shipments associated with this customer (by matching email or sender name)
  const customerShipments = shipments.filter(
    (s) =>
      s.senderEmail?.toLowerCase() === customer.email?.toLowerCase() ||
      s.sender?.toLowerCase() === customer.name?.toLowerCase() ||
      s.receiverEmail?.toLowerCase() === customer.email?.toLowerCase() ||
      s.receiver?.toLowerCase() === customer.name?.toLowerCase()
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700 border-gray-300 font-bold';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const deliveryRate = customer.totalShipments > 0
    ? Math.round((customer.deliveredCount / customer.totalShipments) * 100)
    : 100;

  return (
    <div className="w-full lg:w-[420px] bg-white border-l border-[#DCE6D2] h-full overflow-y-auto flex flex-col justify-between font-['Inter'] shadow-xl z-20 transition-all duration-300">
      
      {/* Top Panel Header */}
      <div>
        <div className="p-6 border-b border-[#EEF4E8] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
            Customer Profile
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4F7EF] text-[#698453] hover:text-[#233D19] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Avatar & Primary Details Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black border shadow-2xs ${customer.avatarBg || 'bg-emerald-100 text-emerald-800 border-emerald-300'}`}>
              {getInitials(customer.name)}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                  {customer.name}
                </h4>
                <select
                  value={customer.status}
                  onChange={(e) => onStatusChange && onStatusChange(customer.id, e.target.value)}
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                    customer.status
                  )}`}
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#698453]">
                <span className="font-mono font-bold text-[#42602D]">{customer.id}</span>
                <span>•</span>
                <span>Joined {customer.joinedDate || '2024'}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <div className="bg-[#FAFCF8] p-3 rounded-2xl border border-[#E3EDDA] text-center">
              <span className="text-[10px] font-extrabold text-[#7A9560] uppercase tracking-wider block mb-0.5">
                Shipments
              </span>
              <span className="text-lg font-extrabold text-[#233D19]">{customer.totalShipments}</span>
            </div>

            <div className="bg-[#FAFCF8] p-3 rounded-2xl border border-[#E3EDDA] text-center">
              <span className="text-[10px] font-extrabold text-[#7A9560] uppercase tracking-wider block mb-0.5">
                Delivered
              </span>
              <span className="text-lg font-extrabold text-[#2E7D32]">{customer.deliveredCount}</span>
            </div>

            <div className="bg-[#FAFCF8] p-3 rounded-2xl border border-[#E3EDDA] text-center">
              <span className="text-[10px] font-extrabold text-[#7A9560] uppercase tracking-wider block mb-0.5">
                Success
              </span>
              <span className="text-lg font-extrabold text-[#587640]">{deliveryRate}%</span>
            </div>
          </div>

          {/* Contact Details Cards */}
          <div className="space-y-3 mb-6">
            
            {/* Email */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA] flex items-center gap-3">
              <div className="p-2 bg-[#EEF4E8] rounded-xl text-[#587640]">
                <Mail className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-[#7A9560] uppercase tracking-wider">Email Address</p>
                <p className="text-xs font-semibold text-[#233D19] truncate">{customer.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA] flex items-center gap-3">
              <div className="p-2 bg-[#EEF4E8] rounded-xl text-[#587640]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#7A9560] uppercase tracking-wider">Phone Number</p>
                <p className="text-xs font-semibold text-[#233D19]">{customer.phone}</p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA] flex items-start gap-3">
              <div className="p-2 bg-[#EEF4E8] rounded-xl text-[#587640] mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#7A9560] uppercase tracking-wider">Primary Address</p>
                <p className="text-xs font-semibold text-[#233D19] leading-snug">{customer.address}</p>
              </div>
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA] flex items-start gap-3">
                <div className="p-2 bg-[#EEF4E8] rounded-xl text-[#587640] mt-0.5">
                  <StickyNote className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#7A9560] uppercase tracking-wider">Customer Notes</p>
                  <p className="text-xs text-[#3E582A] italic leading-snug">{customer.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Customer's Associated Shipments List */}
          <div className="mb-6">
            <h5 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19] mb-3 flex items-center justify-between">
              <span>Recent Associated Shipments</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#EEF4E8] text-[#486634] rounded-full">
                {customerShipments.length} total
              </span>
            </h5>

            {customerShipments.length === 0 ? (
              <div className="p-4 bg-[#FAFCF8] rounded-2xl border border-dashed border-[#D2E0C4] text-center text-xs text-[#7A9560]">
                No direct active shipments linked to email/name.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {customerShipments.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 bg-[#FAFCF8] rounded-xl border border-[#E3EDDA] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#233D19] block">{s.trackingNo}</span>
                      <span className="text-[10px] text-[#698453]">{s.destination} • {s.type}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      s.status === 'Delivered' ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]' :
                      s.status === 'In Transit' ? 'bg-[#E3F2FD] text-[#0066CC] border-[#B3E5FC]' :
                      'bg-[#FFF3E0] text-[#E65100] border-[#FFE082]'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Panel Actions */}
      <div className="p-6 border-t border-[#EEF4E8] bg-[#FAFCF8] flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(customer)}
          className="flex-1 py-3 px-4 bg-[#385429] hover:bg-[#233D19] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Customer</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(customer.id)}
          className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

    </div>
  );
};

export default CustomerProfilePanel;
