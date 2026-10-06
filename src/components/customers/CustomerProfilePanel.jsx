import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  ShieldCheck,
  UserCheck,
  StickyNote,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
  Truck
} from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';

const CustomerProfilePanel = ({ customer, onClose, onEdit, onDelete, onStatusChange }) => {
  const { shipments } = useShipments();
  const [imgError, setImgError] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);

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
      case 'Plus Member':
      case 'Plus':
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

  const getShipmentStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return 'bg-[#E3F2FD] text-[#0066CC] border border-[#B3E5FC]';
      case 'Picked Up':
      case 'Delivered':
        return 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]';
      case 'Out for Delivery':
        return 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE082] font-bold';
      case 'Pending':
        return 'bg-[#FFF8E1] text-[#F57F17] border border-[#FFE082]';
      case 'Cancelled':
      case 'Failed Delivery':
        return 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]';
      default:
        return 'bg-gray-100 text-gray-700';
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
    <div className="fixed top-0 right-0 h-screen w-full sm:w-[520px] md:w-[580px] lg:w-[620px] xl:w-[660px] bg-white border-l border-[#DCE6D2] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between font-['Inter'] shadow-2xl z-50 transition-all duration-300">
      
      {/* Top Panel Header */}
      <div>
        <div className="p-6 border-b border-[#EEF4E8] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
              Customer Profile
            </h3>
            <p className="text-xs text-[#698453]">View registered customer profile, shipping statistics, and activity history</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F4F7EF] text-[#698453] hover:text-[#233D19] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Avatar & Primary Details Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black border shadow-2xs overflow-hidden flex-shrink-0 ${customer.avatarBg || 'bg-emerald-100 text-emerald-800 border-emerald-300'}`}>
              {customer.avatarUrl && !imgError ? (
                <img
                  src={customer.avatarUrl}
                  alt={customer.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                getInitials(customer.name)
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19]">
                  {customer.name}
                </h4>
                <select
                  value={customer.status}
                  onChange={(e) => onStatusChange && onStatusChange(customer.id, e.target.value)}
                  className={`px-3 py-1 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                    customer.status
                  )}`}
                >
                  <option value="Active">Active</option>
                  <option value="Plus Member">Plus Member</option>
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
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA] text-center">
              <span className="text-[10px] font-extrabold text-[#7A9560] uppercase tracking-wider block mb-0.5">
                Shipments
              </span>
              <span className="text-xl font-extrabold text-[#233D19]">{customer.totalShipments}</span>
            </div>

            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA] text-center">
              <span className="text-[10px] font-extrabold text-[#7A9560] uppercase tracking-wider block mb-0.5">
                Delivered
              </span>
              <span className="text-xl font-extrabold text-[#2E7D32]">{customer.deliveredCount}</span>
            </div>

            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA] text-center">
              <span className="text-[10px] font-extrabold text-[#7A9560] uppercase tracking-wider block mb-0.5">
                Success Rate
              </span>
              <span className="text-xl font-extrabold text-[#587640]">{deliveryRate}%</span>
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
                  <p className="text-[10px] font-bold text-[#7A9560] uppercase tracking-wider">Customer Account Notes</p>
                  <p className="text-xs text-[#3E582A] italic leading-snug">{customer.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Customer's Associated Shipments Accordion List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19]">
                Associated Shipments History
              </h5>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#EEF4E8] text-[#486634] rounded-full">
                {customerShipments.length} total
              </span>
            </div>

            {customerShipments.length === 0 ? (
              <div className="p-4 bg-[#FAFCF8] rounded-2xl border border-dashed border-[#D2E0C4] text-center text-xs text-[#7A9560]">
                No direct active shipments linked to email or customer name.
              </div>
            ) : (
              <div className="space-y-3">
                {customerShipments.map((s) => {
                  const isExpanded = selectedShipmentId === s.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedShipmentId(isExpanded ? null : s.id)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isExpanded
                          ? 'bg-white border-[#385429] shadow-md ring-2 ring-[#385429]/15'
                          : 'bg-white border-[#E1EAD8] hover:border-[#B5CC9F] hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-xs text-[#233D19]">{s.trackingNo}</span>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${getShipmentStatusBadge(s.status)}`}>
                              {s.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#698453] mt-0.5 font-medium">
                            {s.type} • Weight: {s.weight}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#587640] font-medium">
                          <span>{s.shippingDate}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#385429]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#7A9560]" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Shipment Details Box */}
                      {isExpanded && (
                        <div className="mt-3.5 pt-3.5 border-t border-[#EEF4E8] space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out">
                          
                          {/* Sender & Receiver */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-[#F7F9F5] p-2.5 rounded-xl border border-[#E1EAD8]">
                              <span className="text-[10px] font-bold text-[#7A9560] uppercase tracking-wider block">Sender</span>
                              <span className="font-bold text-[#233D19] truncate block">{s.sender}</span>
                            </div>
                            <div className="bg-[#F7F9F5] p-2.5 rounded-xl border border-[#E1EAD8]">
                              <span className="text-[10px] font-bold text-[#7A9560] uppercase tracking-wider block">Receiver</span>
                              <span className="font-bold text-[#233D19] truncate block">{s.receiver}</span>
                            </div>
                          </div>

                          {/* Pickup & Delivery */}
                          <div className="bg-[#F7F9F5] p-2.5 rounded-xl border border-[#E1EAD8] space-y-1.5 text-xs">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#587640] flex-shrink-0 mt-0.5" />
                              <span className="text-[11px] text-[#233D19]"><strong className="text-[#385429]">From:</strong> {s.pickupAddress}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#385429] flex-shrink-0 mt-0.5" />
                              <span className="text-[11px] text-[#233D19]"><strong className="text-[#385429]">To:</strong> {s.deliveryAddress}</span>
                            </div>
                          </div>

                          {/* Dates info */}
                          <div className="flex items-center justify-between text-[11px] bg-[#EEF4E8] p-2 rounded-xl border border-[#DCE6D2] font-semibold text-[#233D19]">
                            <span>Dispatched: {s.shippingDate}</span>
                            <span>Expected: {s.expectedDelivery}</span>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Footer Bar */}
      <div className="sticky bottom-0 bg-white border-t border-[#EEF4E8] px-6 py-3.5 z-20 shadow-sm flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => onEdit(customer)}
          className="px-4 py-2 bg-[#385429] hover:bg-[#233D19] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Customer</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(customer.id)}
          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

    </div>
  );
};

export default CustomerProfilePanel;
