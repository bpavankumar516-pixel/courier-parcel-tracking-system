import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  MapPin,
  Weight,
  Tag,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  Truck,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { toast } from 'react-toastify';

const ShipmentDetailsPanel = ({ shipment, onClose, onEdit, onDelete, onStatusChange }) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  useEffect(() => {
    if (shipment?.timeline && shipment.timeline.length > 0) {
      const activeIdx = shipment.timeline.findIndex((t) => t.active);
      if (activeIdx !== -1) {
        setSelectedStepIndex(activeIdx);
      } else {
        setSelectedStepIndex(shipment.timeline.length - 1);
      }
    }
  }, [shipment]);

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

  const getStepDetails = (step, idx) => {
    const locations = {
      'Shipment Created': shipment.pickupAddress
        ? `Origin Hub: ${shipment.pickupAddress}`
        : 'Origin Logistics Dispatch Terminal',
      'Picked Up': shipment.pickupAddress
        ? `Pickup Location: ${shipment.pickupAddress}`
        : 'Courier Pickup Hub',
      'In Transit': 'Sorting Facility: Central Transit Hub #42 (JFK Logistics Park)',
      'Out for Delivery': shipment.deliveryAddress
        ? `Local Delivery Station near ${shipment.deliveryAddress}`
        : 'Local Delivery Dispatch Hub',
      'Delivered': shipment.deliveryAddress
        ? `Final Destination: ${shipment.deliveryAddress}`
        : 'Recipient Handover Location',
      'Cancelled': 'Logistics Operations Office - Order Cancelled',
      'Failed Delivery': 'Regional Dispatch Terminal - Recipient Unavailable'
    };

    const remarks = {
      'Shipment Created': 'Shipping manifest created. Waybill barcode scanned and queued for carrier pickup.',
      'Picked Up': 'Package verified, weighed, and picked up by courier driver. In transit to sorting hub.',
      'In Transit': 'Package sorted at main hub and loaded onto express transport vehicle #TRK-882.',
      'Out for Delivery': 'Parcel loaded into local delivery van. Courier driver en route for final delivery.',
      'Delivered': 'Shipment delivered successfully. Proof of delivery signature captured digitally.',
      'Cancelled': 'Shipment process halted. Customer or sender requested cancellation.',
      'Failed Delivery': 'Attempted delivery at address, but recipient was unavailable. Re-attempt queued.'
    };

    const agents = [
      'Driver: Mark Reynolds (ID #DR-409)',
      'Agent: Sarah Jenkins (Dispatch #DS-210)',
      'Courier: Alex Vance (Express #EX-882)',
      'Officer: David Miller (Logistics #LG-104)'
    ];

    return {
      location: locations[step.status] || 'Regional Logistics Hub',
      remark: remarks[step.status] || 'Status update logged into logistics tracking server.',
      agent: agents[idx % agents.length],
      scanCode: `SCAN-80942${idx + 1}`
    };
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-full sm:w-[520px] md:w-[580px] lg:w-[620px] xl:w-[660px] bg-white border-l border-[#DCE6D2] shadow-2xl z-50 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between font-['Inter'] transition-all duration-300">
      
      {/* Top Panel Header */}
      <div>
        <div className="p-6 border-b border-[#EEF4E8] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
              Shipment Details
            </h3>
            <p className="text-xs text-[#698453]">View logistics tracking, timeline, and parcel information</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F4F7EF] text-[#698453] hover:text-[#233D19] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracking ID & Status Bar */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <span className="text-[10px] font-bold text-[#7A9560] uppercase tracking-wider block">Tracking ID</span>
              <h4 className="font-mono text-lg font-extrabold text-[#233D19] tracking-tight">
                {shipment.trackingNo}
              </h4>
            </div>
            <select
              value={shipment.status}
              onChange={(e) => onStatusChange && onStatusChange(shipment.id, e.target.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(
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

          {/* Interactive Realtime Status Timeline */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-[#233D19]">
                Realtime Status Timeline
              </h5>
              <span className="text-[11px] font-semibold text-[#698453]">
                Click any step to inspect details
              </span>
            </div>

            <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#DCE6D2]">
              {shipment.timeline &&
                shipment.timeline.map((step, idx) => {
                  const isSelected = selectedStepIndex === idx;
                  const details = getStepDetails(step, idx);

                  return (
                    <div key={idx} className="relative group">
                      
                      {/* Node Dot / Status Indicator */}
                      <div
                        onClick={() => setSelectedStepIndex(isSelected ? -1 : idx)}
                        className={`absolute -left-7 top-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-300 ${
                          step.active
                            ? 'bg-[#385429] text-white ring-4 ring-[#EAF2E3] scale-110 shadow-xs'
                            : step.completed
                            ? 'bg-[#2E7D32] text-white'
                            : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Main Step Header Card */}
                      <div
                        onClick={() => setSelectedStepIndex(isSelected ? -1 : idx)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#385429] shadow-md ring-2 ring-[#385429]/15'
                            : 'bg-white border-[#E1EAD8] hover:border-[#B5CC9F] hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold ${
                                step.active
                                  ? 'text-[#233D19]'
                                  : step.completed
                                  ? 'text-[#2E7D32]'
                                  : 'text-gray-500'
                              }`}
                            >
                              {step.status}
                            </span>

                            {step.active && (
                              <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-bold text-[9px] rounded-full animate-pulse">
                                Live Active
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] font-medium text-[#698453]">
                            <span>{step.time}</span>
                            {isSelected ? (
                              <ChevronUp className="w-4 h-4 text-[#385429] transition-transform" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#7A9560] transition-transform" />
                            )}
                          </div>
                        </div>

                        {/* Interactive Realtime Expanded Details Box */}
                        {isSelected && (
                          <div className="mt-3.5 pt-3.5 border-t border-[#EEF4E8] space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out">
                            
                            {/* Location Box */}
                            <div className="bg-[#F7F9F5] p-3 rounded-xl border border-[#E1EAD8] flex items-start gap-2.5">
                              <div className="p-1.5 bg-[#EEF4E8] text-[#385429] rounded-lg mt-0.5 flex-shrink-0">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-[10px] font-extrabold text-[#7A9560] uppercase tracking-wider block">
                                  Current Location / Hub
                                </span>
                                <span className="text-xs font-bold text-[#233D19] leading-tight block mt-0.5">
                                  {details.location}
                                </span>
                              </div>
                            </div>

                            {/* Remarks Box */}
                            <div className="bg-[#F7F9F5] p-3 rounded-xl border border-[#E1EAD8] flex items-start gap-2.5">
                              <div className="p-1.5 bg-[#EEF4E8] text-[#385429] rounded-lg mt-0.5 flex-shrink-0">
                                <AlertCircle className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <span className="text-[10px] font-extrabold text-[#7A9560] uppercase tracking-wider block">
                                  Activity Remarks
                                </span>
                                <span className="text-xs text-[#233D19] font-medium leading-snug block mt-0.5">
                                  {details.remark}
                                </span>
                              </div>
                            </div>

                            {/* Officer & Monospace Security Scan Badges */}
                            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              <div className="flex items-center gap-2 bg-[#EEF4E8] px-3 py-1.5 rounded-xl border border-[#DCE6D2]">
                                <User className="w-3.5 h-3.5 text-[#385429]" />
                                <span className="text-xs font-bold text-[#233D19]">{details.agent}</span>
                              </div>

                              <div className="flex items-center gap-1.5 bg-[#233D19] text-white px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold shadow-2xs">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#8EA57B]" />
                                <span>{details.scanCode}</span>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Footer Bar */}
      <div className="sticky bottom-0 bg-white border-t border-[#EEF4E8] px-6 py-3.5 z-20 shadow-sm flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={handleDownloadCSV}
          className="px-3.5 py-2 bg-[#EEF4E8] hover:bg-[#E0EBD8] text-[#233D19] font-bold text-xs rounded-xl flex items-center gap-1.5 border border-[#D0DFC6] shadow-2xs transition cursor-pointer"
          title="Download CSV Manifest"
        >
          <Download className="w-4 h-4 text-[#385429]" />
          <span>Download</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(shipment)}
          className="px-4 py-2 bg-[#385429] hover:bg-[#233D19] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Shipment</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(shipment.id)}
          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

    </div>
  );
};

export default ShipmentDetailsPanel;
