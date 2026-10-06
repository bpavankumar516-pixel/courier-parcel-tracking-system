import React from 'react';
import { X, User, MapPin, Weight, Tag, Calendar, CheckCircle2, Clock, AlertCircle, Edit, Trash2, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const ShipmentDetailsPanel = ({ shipment, onClose, onEdit, onDelete, onStatusChange }) => {
  if (!shipment) return null;

  const getStatusBadge = (status) => {
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

  const handleDownloadCSV = () => {
    const headers = [
      'Tracking No',
      'Sender',
      'Sender Email',
      'Receiver',
      'Receiver Email',
      'Pickup Address',
      'Delivery Address',
      'Type',
      'Weight',
      'Shipping Date',
      'Expected Delivery',
      'Status'
    ];

    const row = [
      `"${shipment.trackingNo}"`,
      `"${shipment.sender}"`,
      `"${shipment.senderEmail || ''}"`,
      `"${shipment.receiver}"`,
      `"${shipment.receiverEmail || ''}"`,
      `"${(shipment.pickupAddress || '').replace(/"/g, '""')}"`,
      `"${(shipment.deliveryAddress || '').replace(/"/g, '""')}"`,
      `"${shipment.type}"`,
      `"${shipment.weight}"`,
      `"${shipment.shippingDate}"`,
      `"${shipment.expectedDelivery}"`,
      `"${shipment.status}"`
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shipment_${shipment.trackingNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Downloaded CSV manifest for ${shipment.trackingNo}`);
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-full lg:w-[440px] bg-white border-l border-[#DCE6D2] shadow-2xl z-50 overflow-y-auto flex flex-col justify-between font-['Inter'] transition-all duration-300">
      
      {/* Top Panel Header */}
      <div>
        <div className="p-6 border-b border-[#EEF4E8] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
            Shipment Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4F7EF] text-[#698453] hover:text-[#233D19] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracking ID & Status Bar */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h4 className="font-mono text-base font-extrabold text-[#233D19] tracking-tight">
              {shipment.trackingNo}
            </h4>
            <select
              value={shipment.status}
              onChange={(e) => onStatusChange && onStatusChange(shipment.id, e.target.value)}
              className={`px-3 py-1 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                shipment.status
              )}`}
            >
              <option value="In Transit">In Transit</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Delivered">Delivered</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Failed Delivery">Failed Delivery</option>
            </select>
          </div>

          {/* 2-Column Info Grid Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            
            {/* Sender */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA]">
              <div className="flex items-center gap-2 text-[#7A9560] text-[11px] font-bold mb-1">
                <User className="w-3.5 h-3.5 text-[#587640]" />
                <span>Sender</span>
              </div>
              <p className="text-xs font-bold text-[#233D19] truncate">{shipment.sender}</p>
              <p className="text-[10px] text-[#698453] truncate">{shipment.senderEmail}</p>
            </div>

            {/* Receiver */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA]">
              <div className="flex items-center gap-2 text-[#7A9560] text-[11px] font-bold mb-1">
                <User className="w-3.5 h-3.5 text-[#587640]" />
                <span>Receiver</span>
              </div>
              <p className="text-xs font-bold text-[#233D19] truncate">{shipment.receiver}</p>
              <p className="text-[10px] text-[#698453] truncate">{shipment.receiverEmail}</p>
            </div>

            {/* Pickup Address */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA]">
              <div className="flex items-center gap-2 text-[#7A9560] text-[11px] font-bold mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#587640]" />
                <span>Pickup Address</span>
              </div>
              <p className="text-[11px] text-[#233D19] leading-tight font-medium line-clamp-2">
                {shipment.pickupAddress}
              </p>
            </div>

            {/* Delivery Address */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA]">
              <div className="flex items-center gap-2 text-[#7A9560] text-[11px] font-bold mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#587640]" />
                <span>Delivery Address</span>
              </div>
              <p className="text-[11px] text-[#233D19] leading-tight font-medium line-clamp-2">
                {shipment.deliveryAddress}
              </p>
            </div>

            {/* Type & Weight */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA]">
              <div className="flex items-center gap-2 text-[#7A9560] text-[11px] font-bold mb-1">
                <Tag className="w-3.5 h-3.5 text-[#587640]" />
                <span>Parcel Type</span>
              </div>
              <p className="text-xs font-bold text-[#233D19]">{shipment.type}</p>
              <p className="text-[10px] text-[#698453]">Weight: {shipment.weight}</p>
            </div>

            {/* Dates */}
            <div className="bg-[#FAFCF8] p-3.5 rounded-2xl border border-[#E3EDDA]">
              <div className="flex items-center gap-2 text-[#7A9560] text-[11px] font-bold mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#587640]" />
                <span>Shipping Date</span>
              </div>
              <p className="text-xs font-bold text-[#233D19]">{shipment.shippingDate}</p>
              <p className="text-[10px] text-[#698453]">Exp: {shipment.expectedDelivery}</p>
            </div>

          </div>

          {/* Vertical Tracking Status Timeline */}
          <div className="mb-6">
            <h5 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19] mb-4">
              Status Timeline
            </h5>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCE6D2]">
              {shipment.timeline &&
                shipment.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    
                    {/* Node Dot / Check Indicator */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.active
                          ? 'bg-[#385429] text-white ring-4 ring-[#EAF2E3]'
                          : step.completed
                          ? 'bg-[#2E7D32] text-white'
                          : 'bg-[#E0E0E0] text-gray-500'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-extrabold ${
                            step.active
                              ? 'text-[#233D19]'
                              : step.completed
                              ? 'text-[#2E7D32]'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.status}
                        </span>
                        <span className="text-[10px] font-semibold text-[#7A9560]">{step.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel Actions Bar */}
      <div className="p-6 border-t border-[#EEF4E8] bg-[#FAFCF8] flex items-center gap-2">
        <button
          type="button"
          onClick={handleDownloadCSV}
          className="py-3 px-3 bg-[#EEF4E8] hover:bg-[#E0EBD8] text-[#233D19] font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition border border-[#D0DFC6] cursor-pointer"
          title="Download CSV Manifest"
        >
          <Download className="w-4 h-4 text-[#385429]" />
          <span>Download</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(shipment)}
          className="flex-1 py-3 px-3 bg-[#385429] hover:bg-[#233D19] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(shipment.id)}
          className="py-3 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

    </div>
  );
};

export default ShipmentDetailsPanel;
