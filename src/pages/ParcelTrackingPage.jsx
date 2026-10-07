import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Layers,
  Copy,
  Calendar,
  User,
  Package,
  Scale,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  FileText,
  Headphones,
  MessageSquare,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertTriangle,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  Printer,
  ExternalLink,
  Check,
  Building2,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useShipments, generateTimelineForStatus } from '../context/ShipmentContext';
import { useCustomers } from '../context/CustomerContext';

const RECENT_SEARCHES_KEY = 'deliverly_recent_tracking_searches';

const ParcelTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { shipments = [], updateShipmentStatus } = useShipments();
  const { customers = [] } = useCustomers();

  // URL parameter extraction
  const trackingNoFromUrl = searchParams.get('trackingNo') || searchParams.get('id');

  // Derive top live tracking numbers from Shipments Page
  const liveTrackingNos = useMemo(() => {
    return shipments.slice(0, 5).map((s) => s.trackingNo);
  }, [shipments]);

  // Initial tracking ID derived from URL or top shipment in Shipments Page
  const initialTrackingNo = useMemo(() => {
    if (trackingNoFromUrl) return trackingNoFromUrl;
    return shipments.length > 0 ? shipments[0].trackingNo : 'TRK20250829001';
  }, [trackingNoFromUrl, shipments]);

  const [searchQuery, setSearchQuery] = useState(initialTrackingNo);
  const [activeTrackingNo, setActiveTrackingNo] = useState(initialTrackingNo);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Expanded timeline step index state (default to active step)
  const [expandedStepIndex, setExpandedStepIndex] = useState(2);

  // Persistent Recent Searches state derived from live shipments or localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filter out dummy default string if present
        const filtered = parsed.filter((s) => s !== 'TRK1234567890');
        if (filtered.length > 0) return filtered;
      }
    } catch (e) {
      console.error('Failed to parse recent searches', e);
    }
    return shipments.length > 0 ? shipments.slice(0, 4).map((s) => s.trackingNo) : ['TRK20250829001', 'TRK20250829002', 'TRK20250829003', 'TRK20250829004'];
  });

  // Keep recentSearches synced with live shipments when user has no custom history
  useEffect(() => {
    if (shipments.length > 0) {
      setRecentSearches((prev) => {
        const cleanPrev = prev.filter((s) => s !== 'TRK1234567890');
        if (cleanPrev.length === 0) {
          return shipments.slice(0, 4).map((s) => s.trackingNo);
        }
        return cleanPrev;
      });
    }
  }, [shipments]);

  // Multiple tracking input state
  const [multipleInput, setMultipleInput] = useState('');
  const [multiShipmentsList, setMultiShipmentsList] = useState([]);
  const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);

  // Sync active tracking number if URL search params change
  useEffect(() => {
    if (trackingNoFromUrl && trackingNoFromUrl !== activeTrackingNo) {
      setActiveTrackingNo(trackingNoFromUrl);
      setSearchQuery(trackingNoFromUrl);
    }
  }, [trackingNoFromUrl]);

  // Click outside to close search suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save recent searches to LocalStorage
  const saveRecentSearches = (newSearches) => {
    setRecentSearches(newSearches);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
    } catch (e) {
      console.error('Failed to save recent searches', e);
    }
  };

  // Live autocomplete search suggestions matching shipments array
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return shipments
      .filter(
        (s) =>
          s.trackingNo.toLowerCase().includes(q) ||
          s.sender.toLowerCase().includes(q) ||
          s.receiver.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [shipments, searchQuery]);

  // Dynamically lookup matching shipment in ShipmentContext or generate responsive fallback
  const activeParcel = useMemo(() => {
    const targetQuery = activeTrackingNo.trim().toLowerCase();
    const found = shipments.find(
      (s) => s.trackingNo.toLowerCase() === targetQuery || s.id === targetQuery
    );

    if (found) {
      // Find matching sender and receiver from CustomerContext
      const senderCust = customers.find(
        (c) => c.name.toLowerCase() === found.sender?.toLowerCase()
      );
      const receiverCust = customers.find(
        (c) => c.name.toLowerCase() === found.receiver?.toLowerCase()
      );

      const timelineNodes = generateTimelineForStatus(found.status || 'In Transit', found.timeline || []);

      return {
        id: found.id,
        trackingNo: found.trackingNo,
        status: found.status || 'In Transit',
        estimatedDelivery: found.expectedDelivery || 'Sep 26, 2026',
        remainingDays: found.status === 'Delivered' ? 'Delivered' : '2 days remaining',
        currentLocation: 'Hyderabad, Telangana',
        locationDetails: found.status,
        sender: found.sender || 'John Doe',
        senderCity: found.pickupAddress ? found.pickupAddress.split(',')[1] || 'New York, NY' : 'New York, NY',
        senderPhone: senderCust?.phone || found.senderPhone || '+1 555-0192',
        senderEmail: senderCust?.email || found.senderEmail || 'sender@example.com',
        pickupAddress: found.pickupAddress || '123 Main St, New York, NY 10001, USA',
        receiver: found.receiver || 'Sarah Wilson',
        receiverCity: found.deliveryAddress ? found.deliveryAddress.split(',')[1] || 'Los Angeles, CA' : 'Los Angeles, CA',
        receiverPhone: receiverCust?.phone || found.receiverPhone || '+1 555-0143',
        receiverEmail: receiverCust?.email || found.receiverEmail || 'receiver@example.com',
        deliveryAddress: found.deliveryAddress || '456 Market St, San Francisco, CA 94105, USA',
        type: found.type || 'Electronics',
        weight: found.weight || '2.5 kg',
        shippingDate: found.shippingDate || 'Sep 21, 2026',
        timeline: timelineNodes
      };
    }

    // Default reference parcel matching live shipment schema
    return {
      id: 'def-1',
      trackingNo: activeTrackingNo || (shipments.length > 0 ? shipments[0].trackingNo : 'TRK20250829001'),
      status: 'In Transit',
      estimatedDelivery: 'Sep 26, 2026',
      remainingDays: '2 days remaining',
      currentLocation: 'Hyderabad, Telangana',
      locationDetails: 'In Transit',
      sender: 'John Doe',
      senderCity: 'New York, NY',
      senderPhone: '+1 555-0192',
      senderEmail: 'john@example.com',
      pickupAddress: '123 Main St, New York, NY 10001, USA',
      receiver: 'Sarah Wilson',
      receiverCity: 'Los Angeles, CA',
      receiverPhone: '+1 555-0143',
      receiverEmail: 'sarah@example.com',
      deliveryAddress: '456 Market St, San Francisco, CA 94105, USA',
      type: 'Electronics',
      weight: '2.5 kg',
      shippingDate: 'Sep 21, 2026',
      timeline: [
        {
          status: 'Shipment Created',
          desc: 'Your shipment has been created successfully.',
          time: 'Sep 21, 2026 10:24 AM',
          completed: true,
          hub: 'New York Origin Facility',
          remarks: 'Order received. Manifest generated and barcode scanned.',
          scanCode: 'SCAN-809421'
        },
        {
          status: 'Picked Up',
          desc: 'Parcel picked up from sender location.',
          time: 'Sep 21, 2026 04:32 PM',
          completed: true,
          hub: 'East Coast Distribution Center',
          remarks: 'Parcel picked up by courier driver Mark Reynolds (ID #DR-409).',
          scanCode: 'SCAN-809422'
        },
        {
          status: 'In Transit',
          desc: 'Parcel is on the way to the destination.',
          time: 'Sep 22, 2026 09:15 AM',
          completed: true,
          active: true,
          hub: 'Hyderabad Gateway Hub',
          remarks: 'In transit across regional sorting hubs. On schedule for arrival.',
          scanCode: 'SCAN-809423'
        },
        {
          status: 'Out for Delivery',
          desc: 'Parcel is out for delivery.',
          time: 'Pending',
          completed: false,
          hub: 'Hyderabad Local Depot',
          remarks: 'Scheduled for local delivery driver dispatch.',
          scanCode: 'SCAN-809424'
        },
        {
          status: 'Delivered',
          desc: 'Parcel has been delivered successfully.',
          time: 'Pending',
          completed: false,
          hub: 'Destination Address',
          remarks: 'Pending final recipient handover.',
          scanCode: 'SCAN-809425'
        }
      ]
    };
  }, [shipments, customers, activeTrackingNo]);

  // Dynamic step details generator matching ShipmentDetailsPanel
  const getStepDetails = (step, idx) => {
    const locations = {
      'Shipment Created': activeParcel.pickupAddress
        ? `Origin Hub: ${activeParcel.pickupAddress}`
        : 'Origin Logistics Terminal',
      'Picked Up': activeParcel.pickupAddress
        ? `Pickup Location: ${activeParcel.pickupAddress}`
        : 'Courier Pickup Depot',
      'In Transit': 'Sorting Facility: Central Transit Hub #42 (JFK Logistics Park)',
      'Out for Delivery': activeParcel.deliveryAddress
        ? `Local Delivery Station near ${activeParcel.deliveryAddress}`
        : 'Local Delivery Dispatch Hub',
      'Delivered': activeParcel.deliveryAddress
        ? `Final Destination: ${activeParcel.deliveryAddress}`
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
      location: step.hub || locations[step.status] || 'Regional Logistics Hub',
      remark: step.remarks || remarks[step.status] || 'Status update logged into logistics tracking server.',
      agent: step.agent || agents[idx % agents.length],
      scanCode: step.scanCode || `SCAN-${809421 + idx}`
    };
  };

  // Set default expanded timeline step to active step
  useEffect(() => {
    if (activeParcel?.timeline) {
      const activeIdx = activeParcel.timeline.findIndex((t) => t.active);
      if (activeIdx !== -1) {
        setExpandedStepIndex(activeIdx);
      } else {
        const lastDoneIdx = activeParcel.timeline.filter((t) => t.completed).length - 1;
        setExpandedStepIndex(lastDoneIdx >= 0 ? lastDoneIdx : 0);
      }
    }
  }, [activeParcel]);

  // Handle Search Submission
  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning('Please enter a tracking number to search');
      return;
    }

    const cleanNo = searchQuery.trim().toUpperCase();
    setActiveTrackingNo(cleanNo);
    setSearchParams({ trackingNo: cleanNo });
    setIsSearchFocused(false);

    if (!recentSearches.includes(cleanNo)) {
      const updated = [cleanNo, ...recentSearches.filter((s) => s !== cleanNo)].slice(0, 6);
      saveRecentSearches(updated);
    }
    toast.info(`Status loaded for parcel: ${cleanNo}`);
  };

  // Handle Tag Click
  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setActiveTrackingNo(tag);
    setSearchParams({ trackingNo: tag });
    setIsSearchFocused(false);
    toast.info(`Loaded tracking status for ${tag}`);
  };

  // Clear Recent Searches History
  const handleClearHistory = () => {
    saveRecentSearches([]);
    toast.info('Cleared search history');
  };

  // Copy tracking number to clipboard
  const handleCopyTracking = () => {
    navigator.clipboard.writeText(activeParcel.trackingNo);
    toast.success(`Tracking number ${activeParcel.trackingNo} copied!`);
  };

  // Real-time Status Change directly on Tracking Page
  const handleLiveStatusChange = (newStatus) => {
    if (!activeParcel.id || activeParcel.id.startsWith('def-')) {
      toast.info(`Updated view status to "${newStatus}"`);
      return;
    }
    updateShipmentStatus(activeParcel.id, newStatus);
  };

  // Handle Track Multiple Shipments Form
  const handleTrackMultiple = (e) => {
    e?.preventDefault();
    if (!multipleInput.trim()) {
      toast.warning('Please enter comma-separated tracking numbers');
      return;
    }

    const numbers = multipleInput
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    if (numbers.length === 0) return;

    // Find matches in live shipments
    const matches = numbers.map((no) => {
      const found = shipments.find((s) => s.trackingNo.toUpperCase() === no);
      return (
        found || {
          trackingNo: no,
          status: 'In Transit',
          sender: 'Registered Sender',
          receiver: 'Registered Receiver',
          expectedDelivery: 'Sep 26, 2026'
        }
      );
    });

    setMultiShipmentsList(matches);
    setIsMultiModalOpen(true);

    // Switch main view to the first tracked parcel
    setSearchQuery(numbers[0]);
    setActiveTrackingNo(numbers[0]);
    setSearchParams({ trackingNo: numbers[0] });

    if (!recentSearches.includes(numbers[0])) {
      saveRecentSearches([numbers[0], ...recentSearches].slice(0, 6));
    }
  };

  // Print Tracking Sheet Action
  const handlePrintTracking = () => {
    window.print();
  };

  // Dynamic status badge color generator
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'In Transit':
        return 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]';
      case 'Picked Up':
      case 'Delivered':
        return 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]';
      case 'Out for Delivery':
        return 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE082]';
      case 'Pending':
        return 'bg-[#FFF8E1] text-[#F57F17] border border-[#FFE082]';
      case 'Cancelled':
      case 'Failed Delivery':
        return 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]';
      default:
        return 'bg-[#EAF3D8] text-[#587640] border border-[#DCE6D2]';
    }
  };

  // Dynamic map status details based on current parcel status
  const getMapStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return {
          currentHub: 'Hyderabad, Telangana',
          progressPercent: 15,
          progressText: '15%',
          statusText: 'Awaiting Pickup & Dispatched from Warehouse',
          nextUpdate: 'Next update in 1-2 hours'
        };
      case 'Picked Up':
        return {
          currentHub: 'Hyderabad, Telangana',
          progressPercent: 35,
          progressText: '35%',
          statusText: 'Parcel Picked Up & En Route to Gateway',
          nextUpdate: 'Next update in 2 hours'
        };
      case 'In Transit':
        return {
          currentHub: 'Hyderabad, Telangana',
          progressPercent: 65,
          progressText: '65%',
          statusText: 'Parcel is currently in transit',
          nextUpdate: 'Next update in 2-3 hours'
        };
      case 'Out for Delivery':
        return {
          currentHub: 'Hyderabad, Telangana',
          progressPercent: 90,
          progressText: '90%',
          statusText: 'Out with Delivery Driver for Handover',
          nextUpdate: 'Expected delivery today by 5:00 PM'
        };
      case 'Delivered':
        return {
          currentHub: 'Hyderabad, Telangana',
          progressPercent: 100,
          progressText: '100%',
          statusText: 'Shipment delivered successfully. Proof of delivery captured.',
          nextUpdate: 'Delivery Completed'
        };
      case 'Cancelled':
      case 'Failed Delivery':
        return {
          currentHub: 'Hyderabad, Telangana',
          progressPercent: 40,
          progressText: '40%',
          statusText: 'Delivery Exception - Address Verification Required',
          nextUpdate: 'Support agent investigating'
        };
      default:
        return {
          currentHub: 'Hyderabad, Telangana',
          progressPercent: 60,
          progressText: '60%',
          statusText: 'Parcel is currently in transit',
          nextUpdate: 'Next update in 2-3 hours'
        };
    }
  };

  const mapConfig = getMapStatusConfig(activeParcel.status);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12 font-['Inter']">
        
        {/* Header Title & Action Buttons Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3D8] flex items-center justify-center border border-[#DCE6D2] text-[#233D19] shadow-2xs">
              <MapPin className="w-6 h-6 text-[#233D19]" />
            </div>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
                Parcel Tracking
              </h1>
              <p className="text-xs sm:text-sm text-[#5C7847] mt-0.5 font-medium">
                Track your shipments in real-time and get the latest updates on your delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Print Manifest Button */}
            <button
              type="button"
              onClick={handlePrintTracking}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#DCE6D2] text-xs font-bold text-[#233D19] shadow-2xs hover:bg-[#F4F7EF] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#587640]" />
              <span className="hidden sm:inline">Print Manifest</span>
            </button>

            {/* Quick Sync Button */}
            <button
              type="button"
              onClick={() => {
                toast.success('Live parcel status synchronized with Shipment & Customer Context!');
              }}
              className="flex items-center gap-2 bg-[#2D5A27] hover:bg-[#23471E] text-white px-4 py-2 rounded-2xl border border-[#23471E] text-xs font-bold shadow-2xs transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Live Data</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search Bar & Autocomplete Suggestions Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Input with Autocomplete Container */}
                <div ref={searchContainerRef} className="flex-1 w-full relative">
                  <div className="flex items-center border border-[#DCE6D2] rounded-2xl px-4 bg-white focus-within:border-[#587640] transition shadow-2xs">
                    <Package className="w-5 h-5 text-[#587640] flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onFocus={() => setIsSearchFocused(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchFocused(true);
                      }}
                      placeholder="Search tracking number, sender, receiver..."
                      className="w-full py-3 px-3 text-xs sm:text-sm font-bold text-[#233D19] focus:outline-none bg-transparent placeholder:text-[#93A782]"
                    />
                  </div>

                  {/* Floating Suggestions Dropdown */}
                  {isSearchFocused && searchSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#DCE6D2] shadow-xl z-30 overflow-hidden divide-y divide-[#F0F5EC]">
                      <div className="p-2.5 bg-[#F9FCF7] text-[10px] font-extrabold text-[#789564] uppercase tracking-wider">
                        Matching Live Shipments ({searchSuggestions.length})
                      </div>
                      {searchSuggestions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSearchQuery(item.trackingNo);
                            setActiveTrackingNo(item.trackingNo);
                            setSearchParams({ trackingNo: item.trackingNo });
                            setIsSearchFocused(false);
                            toast.info(`Selected ${item.trackingNo}`);
                          }}
                          className="p-3 hover:bg-[#F2F7EC] cursor-pointer transition flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-7 h-7 rounded-full bg-[#EAF3D8] flex items-center justify-center text-[#587640] font-bold flex-shrink-0">
                              <Package className="w-3.5 h-3.5" />
                            </div>
                            <div className="overflow-hidden">
                              <span className="font-mono font-bold text-[#233D19] block">
                                {item.trackingNo}
                              </span>
                              <span className="text-[11px] text-[#698453] block truncate">
                                {item.sender} → {item.receiver}
                              </span>
                            </div>
                          </div>

                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${getStatusBadgeClass(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Track Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#2D5A27] hover:bg-[#23471E] text-white px-7 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Track</span>
                </button>

                {/* Track Multiple Button */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('multiple-track-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-[#F0F5EC] hover:bg-[#E2EBDC] text-[#233D19] border border-[#DCE6D2] px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0"
                >
                  <Layers className="w-4 h-4 text-[#587640]" />
                  <span>Track Multiple</span>
                </button>
              </form>

              {/* Recent Searches Tags */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-1 border-t border-[#EEF4E8]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#698453] text-[11px]">Recent Searches:</span>
                  {recentSearches.length === 0 ? (
                    <span className="text-[11px] text-[#93A782]">No search history</span>
                  ) : (
                    recentSearches.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          activeTrackingNo === tag
                            ? 'bg-[#233D19] text-white border-[#233D19]'
                            : 'bg-[#EEF4E8] text-[#233D19] border-[#DCE6D2] hover:bg-[#E1EAD8]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))
                  )}
                </div>

                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-[10px] font-bold text-[#8EA57B] hover:text-[#C62828] transition cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>
            </div>

            {/* Main Parcel Primary Info Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Delivery Progress Bar */}
              <div className="bg-[#F7F9F5] p-3.5 rounded-2xl border border-[#EEF4E8] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#233D19]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#2E7D32]" />
                    <span>Delivery Journey Progress</span>
                  </span>
                  <span className="text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                    {mapConfig.progressText} Completed
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#E1EAD8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#587640] to-[#2E7D32] rounded-full transition-all duration-500"
                    style={{ width: `${mapConfig.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Top Row Header Info (Tracking No, Est. Date) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* 1. Tracking Number & Status */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF3D8] flex items-center justify-center border border-[#DCE6D2] flex-shrink-0">
                    <Package className="w-6 h-6 text-[#233D19]" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#698453] font-medium block">Tracking Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19] tracking-tight">
                        {activeParcel.trackingNo}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyTracking}
                        title="Copy Tracking Number"
                        className="text-[#7A9560] hover:text-[#233D19] p-1 rounded transition cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Live Status Control Dropdown */}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-block px-3 py-0.5 text-[10px] font-extrabold rounded-full ${getStatusBadgeClass(
                          activeParcel.status
                        )}`}
                      >
                        ● {activeParcel.status}
                      </span>

                      {/* Select Status Dropdown */}
                      <select
                        value={activeParcel.status}
                        onChange={(e) => handleLiveStatusChange(e.target.value)}
                        className="text-[10px] font-bold bg-[#F4F8EF] border border-[#DCE6D2] rounded-md px-1.5 py-0.5 text-[#233D19] cursor-pointer focus:outline-none"
                        title="Update Status in real-time"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Failed Delivery">Failed Delivery</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Estimated Delivery Date */}
                <div className="flex items-center gap-4 lg:border-l lg:border-[#EEF4E8] lg:pl-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F8EF] flex items-center justify-center border border-[#E1EAD8] flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#587640]" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#698453] font-medium block">Estimated Delivery Date</span>
                    <span className="font-bold text-sm text-[#233D19] block">
                      {activeParcel.estimatedDelivery}
                    </span>
                    <span className="text-[11px] text-[#789564] font-medium">
                      ({activeParcel.remainingDays})
                    </span>
                  </div>
                </div>

              </div>

              {/* Horizontal Divider */}
              <div className="border-t border-[#EEF4E8]" />

              {/* Bottom 5 Parcel Attributes (Integrated with Live Customer Data) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-1">
                
                {/* Sender with Action */}
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-[#F4F8EF] flex items-center justify-center flex-shrink-0 text-[#587640] group-hover:bg-[#EAF3D8]">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-[#789564] font-semibold block">Sender</span>
                    <span className="text-xs font-bold text-[#233D19] block truncate">{activeParcel.sender}</span>
                    <a
                      href={`tel:${activeParcel.senderPhone}`}
                      className="text-[10px] text-[#587640] hover:underline flex items-center gap-1 truncate"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      {activeParcel.senderPhone}
                    </a>
                  </div>
                </div>

                {/* Receiver with Action */}
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-[#F4F8EF] flex items-center justify-center flex-shrink-0 text-[#587640] group-hover:bg-[#EAF3D8]">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-[#789564] font-semibold block">Receiver</span>
                    <span className="text-xs font-bold text-[#233D19] block truncate">{activeParcel.receiver}</span>
                    <a
                      href={`tel:${activeParcel.receiverPhone}`}
                      className="text-[10px] text-[#587640] hover:underline flex items-center gap-1 truncate"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      {activeParcel.receiverPhone}
                    </a>
                  </div>
                </div>

                {/* Parcel Type */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F4F8EF] flex items-center justify-center flex-shrink-0 text-[#587640]">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-[#789564] font-semibold block">Parcel Type</span>
                    <span className="text-xs font-bold text-[#233D19] block truncate">{activeParcel.type}</span>
                  </div>
                </div>

                {/* Weight */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F4F8EF] flex items-center justify-center flex-shrink-0 text-[#587640]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-[#789564] font-semibold block">Weight</span>
                    <span className="text-xs font-bold text-[#233D19] block truncate">{activeParcel.weight}</span>
                  </div>
                </div>

                {/* Shipping Date */}
                <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-full bg-[#F4F8EF] flex items-center justify-center flex-shrink-0 text-[#587640]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-[#789564] font-semibold block">Shipping Date</span>
                    <span className="text-xs font-bold text-[#233D19] block truncate">{activeParcel.shippingDate}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Grid: Interactive Timeline (Left) & Live Map (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Shipment Timeline (Exact Match to ShipmentDetailsPanel design) */}
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] font-['Inter']">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                      Realtime Status Timeline
                    </h3>
                    <p className="text-xs text-[#698453] mt-0.5">Click any step to inspect details</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#587640] bg-[#EEF4E8] px-3 py-1 rounded-full border border-[#DCE6D2]">
                    Live Reactive Log
                  </span>
                </div>

                <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#DCE6D2]">
                  {activeParcel.timeline &&
                    activeParcel.timeline.map((step, idx) => {
                      const isSelected = expandedStepIndex === idx;
                      const details = getStepDetails(step, idx);

                      return (
                        <div key={idx} className="relative group">
                          
                          {/* Node Dot / Status Indicator */}
                          <div
                            onClick={() => setExpandedStepIndex(isSelected ? -1 : idx)}
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
                            onClick={() => setExpandedStepIndex(isSelected ? -1 : idx)}
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

                                {/* Activity Remarks Box */}
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

              {/* Pickup & Delivery Address Details Card (Proper Alignment & Layout) */}
              <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 font-['Inter'] h-full">
                
                {/* Card Header Bar */}
                <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF3D8] text-[#233D19] flex items-center justify-center border border-[#DCE6D2] flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#233D19] leading-tight">
                        Route & Address Details
                      </h3>
                      <p className="text-[11px] text-[#698453]">Verified pickup and destination dispatch locations</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#C8E6C9] flex-shrink-0">
                    ● Verified Route
                  </span>
                </div>

                <div className="space-y-3.5 flex-1 flex flex-col justify-center">
                  
                  {/* 1. Pickup Address Card (Origin) */}
                  <div className="p-3.5 rounded-2xl bg-[#F9FCF7] border border-[#DCE6D2] space-y-2 hover:border-[#B5CC9F] transition">
                    <div className="flex items-center justify-between gap-2 border-b border-[#EEF4E8] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#EAF3D8] text-[#385429] flex items-center justify-center font-bold flex-shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-[#385429]" />
                        </div>
                        <span className="text-xs font-extrabold text-[#233D19]">Pickup Address</span>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-[#EEF4E8] text-[#587640] rounded-md border border-[#DCE6D2]">
                        ORIGIN
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#233D19] leading-relaxed pt-0.5">
                      {activeParcel.pickupAddress}
                    </p>

                    <div className="pt-1.5 border-t border-[#EEF4E8] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <User className="w-3.5 h-3.5 text-[#587640]" />
                        <span className="text-[#698453] font-medium">Sender:</span>
                        <strong className="text-[#233D19] font-bold">{activeParcel.sender}</strong>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <a
                          href={`tel:${activeParcel.senderPhone}`}
                          className="text-[#587640] hover:text-[#233D19] hover:underline flex items-center gap-1 font-bold bg-white px-2 py-0.5 rounded-md border border-[#EEF4E8]"
                          title="Call Sender"
                        >
                          <Phone className="w-3 h-3 text-[#385429]" />
                          <span>{activeParcel.senderPhone}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Route Transport Visual Divider */}
                  <div className="flex items-center justify-center gap-2 text-[#587640] my-0.5">
                    <div className="h-px bg-[#DCE6D2] flex-1" />
                    <div className="px-3 py-1 bg-[#EEF4E8] rounded-full border border-[#DCE6D2] text-[10px] font-extrabold flex items-center gap-1.5 shadow-2xs">
                      <Truck className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Direct Transport ({activeParcel.senderCity} → {activeParcel.receiverCity})</span>
                    </div>
                    <div className="h-px bg-[#DCE6D2] flex-1" />
                  </div>

                  {/* 2. Delivery Address Card (Destination) */}
                  <div className="p-3.5 rounded-2xl bg-[#F9FCF7] border border-[#DCE6D2] space-y-2 hover:border-[#B5CC9F] transition">
                    <div className="flex items-center justify-between gap-2 border-b border-[#EEF4E8] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold flex-shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                        </div>
                        <span className="text-xs font-extrabold text-[#233D19]">Delivery Address</span>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-md border border-[#C8E6C9]">
                        DESTINATION
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#233D19] leading-relaxed pt-0.5">
                      {activeParcel.deliveryAddress}
                    </p>

                    <div className="pt-1.5 border-t border-[#EEF4E8] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <User className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span className="text-[#698453] font-medium">Receiver:</span>
                        <strong className="text-[#233D19] font-bold">{activeParcel.receiver}</strong>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <a
                          href={`tel:${activeParcel.receiverPhone}`}
                          className="text-[#587640] hover:text-[#233D19] hover:underline flex items-center gap-1 font-bold bg-white px-2 py-0.5 rounded-md border border-[#EEF4E8]"
                          title="Call Receiver"
                        >
                          <Phone className="w-3 h-3 text-[#2E7D32]" />
                          <span>{activeParcel.receiverPhone}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Status Summary Banner */}
                <div className="bg-[#F7F9F5] border border-[#DCE6D2] rounded-2xl p-3 flex items-center justify-between text-xs text-[#233D19]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    <span className="font-bold text-xs">Dispatch Operations Status</span>
                  </div>
                  <span className={`px-3 py-0.5 text-[10px] font-extrabold rounded-full ${getStatusBadgeClass(activeParcel.status)}`}>
                    ● {activeParcel.status}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Right Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Shipment Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#385429]" />
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#233D19]">
                    Shipment Summary
                  </h3>
                </div>
                <Link
                  to="/shipments"
                  className="text-[11px] font-bold text-[#587640] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#698453] font-medium">Tracking Number</span>
                  <span className="font-bold font-mono text-[#233D19]">{activeParcel.trackingNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#698453] font-medium">Parcel Type</span>
                  <span className="font-bold text-[#233D19]">{activeParcel.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#698453] font-medium">Weight</span>
                  <span className="font-bold text-[#233D19]">{activeParcel.weight}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#698453] font-medium">Shipping Date</span>
                  <span className="font-bold text-[#233D19]">{activeParcel.shippingDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#698453] font-medium">Expected Delivery</span>
                  <span className="font-bold text-[#233D19]">{activeParcel.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* 2. Track Multiple Shipments Card */}
            <div id="multiple-track-section" className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#385429]" />
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#233D19]">
                  Track Multiple Shipments
                </h3>
              </div>

              <form onSubmit={handleTrackMultiple} className="space-y-3">
                <textarea
                  rows={3}
                  value={multipleInput}
                  onChange={(e) => setMultipleInput(e.target.value)}
                  placeholder="Enter tracking numbers (comma separated)"
                  className="w-full border border-[#DCE6D2] rounded-2xl p-3 text-xs font-semibold text-[#233D19] focus:outline-none focus:border-[#587640] placeholder:text-[#93A782] bg-white resize-none shadow-2xs"
                />

                <button
                  type="submit"
                  className="w-full bg-[#2D5A27] hover:bg-[#23471E] text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Track All</span>
                </button>
              </form>
            </div>

            {/* 3. Need Help? Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE6D2] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#385429]" />
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#233D19]">
                  Need Help?
                </h3>
              </div>

              <p className="text-xs text-[#698453] leading-relaxed">
                For any tracking related queries, contact our support team.
              </p>

              <button
                type="button"
                onClick={() => toast.info('Support team notified! Live agent will connect with you.')}
                className="w-full border border-[#587640] text-[#233D19] hover:bg-[#F0F5EC] py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#587640]" />
                <span>Contact Support</span>
              </button>
            </div>

            {/* 4. Decorative Priority Banner Card */}
            <div className="bg-gradient-to-br from-[#EAF3D8] to-[#DCE8C8] rounded-3xl p-5 border border-[#CDE0B8] relative overflow-hidden flex items-center gap-4 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#233D19] border border-[#DCE6D2] shadow-2xs flex-shrink-0">
                <Package className="w-6 h-6 text-[#385429]" />
              </div>
              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19] leading-snug">
                  Your Parcel<br />Our Priority
                </h4>
              </div>
            </div>

          </div>

        </div>

        {/* Multi-Shipment Tracking Modal */}
        {isMultiModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#DCE6D2] shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-[#EEF4E8] pb-4">
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#233D19]">
                    Multiple Tracking Results ({multiShipmentsList.length})
                  </h3>
                  <p className="text-xs text-[#698453]">Status summary for searched parcels</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMultiModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F4F8EF] flex items-center justify-center text-[#587640] hover:bg-[#EAF3D8] transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {multiShipmentsList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-[#EEF4E8] bg-[#F9FCF7] flex items-center justify-between gap-4 hover:border-[#DCE6D2] transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#233D19]">
                          {item.trackingNo}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#698453] mt-1">
                        {item.sender} → {item.receiver}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.trackingNo);
                        setActiveTrackingNo(item.trackingNo);
                        setSearchParams({ trackingNo: item.trackingNo });
                        setIsMultiModalOpen(false);
                      }}
                      className="px-4 py-2 bg-[#233D19] hover:bg-[#385429] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsMultiModalOpen(false)}
                  className="px-5 py-2.5 bg-[#EEF4E8] text-[#233D19] text-xs font-bold rounded-xl hover:bg-[#E1EAD8] transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ParcelTrackingPage;
