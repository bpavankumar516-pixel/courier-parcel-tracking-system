import React, { useState, useMemo } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useShipments } from "../context/ShipmentContext";
import ShipmentDetailsPanel from "../components/shipments/ShipmentDetailsPanel";
import ShipmentFormDrawer from "../components/shipments/ShipmentFormDrawer";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  LayoutList,
  LayoutGrid,
  User,
  MapPin,
  Calendar,
  Weight,
  Truck,
  CheckCircle2,
  XCircle,
  CheckSquare,
  Square,
  X,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

const ShipmentsPage = () => {
  const {
    shipments,
    addShipment,
    updateShipment,
    deleteShipment,
    updateShipmentStatus,
    bulkUpdateStatus,
    bulkDeleteShipments,
  } = useShipments();

  const [selectedShipment, setSelectedShipment] = useState(null);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTarget, setDeletingTarget] = useState(null);

  // View Mode: 'table' | 'grid'
  const [viewMode, setViewMode] = useState("table");

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Sort by Date");

  // Checkbox selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedBulkStatus, setSelectedBulkStatus] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Real-time metric summary stats (Total, Pending Pickup, In Transit, Out for Delivery, Delivered, Cancelled)
  const metrics = useMemo(() => {
    const total = shipments.length;
    const pending = shipments.filter(
      (s) => s.status === "Pending" || s.status === "Picked Up",
    ).length;
    const inTransit = shipments.filter((s) => s.status === "In Transit").length;
    const outForDelivery = shipments.filter(
      (s) => s.status === "Out for Delivery",
    ).length;
    const delivered = shipments.filter((s) => s.status === "Delivered").length;
    const cancelled = shipments.filter(
      (s) => s.status === "Cancelled" || s.status === "Failed Delivery",
    ).length;
    return { total, pending, inTransit, outForDelivery, delivered, cancelled };
  }, [shipments]);

  // Filtered & Sorted Shipments
  const filteredShipments = useMemo(() => {
    return shipments
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.trackingNo.toLowerCase().includes(query) ||
          item.sender.toLowerCase().includes(query) ||
          item.receiver.toLowerCase().includes(query);

        const matchesType =
          selectedType === "All Types" || item.type === selectedType;
        const matchesStatus =
          selectedStatus === "All Statuses" || item.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "Sort by Weight") {
          const wA = parseFloat(a.weight) || 0;
          const wB = parseFloat(b.weight) || 0;
          return wB - wA;
        }
        if (sortBy === "Sort by Tracking No") {
          return a.trackingNo.localeCompare(b.trackingNo);
        }
        return (
          new Date(b.shippingDate || "2026-01-01") -
          new Date(a.shippingDate || "2026-01-01")
        );
      });
  }, [shipments, searchQuery, selectedType, selectedStatus, sortBy]);

  // Paginated chunk
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage) || 1;
  const currentShipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(start, start + itemsPerPage);
  }, [filteredShipments, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("All Types");
    setSelectedStatus("All Statuses");
    setSortBy("Sort by Date");
    setCurrentPage(1);
    toast.info("Filters cleared");
  };

  // Checkbox Select All Toggle
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentShipments.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Checkbox Select Individual Row Toggle
  const handleSelectOne = (id, e) => {
    if (e) e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Download / Export CSV for Checked Items in Floating Toolbar
  const handleExportSelectedCSV = () => {
    if (selectedIds.length === 0) return;
    const targetShipments = shipments.filter((s) => selectedIds.includes(s.id));

    const headers = [
      "Tracking No",
      "Sender",
      "Sender Email",
      "Receiver",
      "Receiver Email",
      "Pickup Address",
      "Delivery Address",
      "Type",
      "Weight",
      "Shipping Date",
      "Expected Delivery",
      "Status",
    ];

    const rows = targetShipments.map((s) => [
      `"${s.trackingNo}"`,
      `"${s.sender}"`,
      `"${s.senderEmail || ""}"`,
      `"${s.receiver}"`,
      `"${s.receiverEmail || ""}"`,
      `"${(s.pickupAddress || "").replace(/"/g, '""')}"`,
      `"${(s.deliveryAddress || "").replace(/"/g, '""')}"`,
      `"${s.type}"`,
      `"${s.weight}"`,
      `"${s.shippingDate}"`,
      `"${s.expectedDelivery}"`,
      `"${s.status}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `deliverly_shipments_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      `Exported ${targetShipments.length} selected shipment(s) to CSV!`,
    );
  };

  // Bulk Action: Status Change for checked items
  const handleApplyBulkStatus = (status) => {
    if (!status || selectedIds.length === 0) return;
    bulkUpdateStatus(selectedIds, status);
    setSelectedBulkStatus("");
  };

  // Bulk Action: Delete Trigger
  const triggerBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) return;
    setDeletingTarget({ isBulk: true, ids: selectedIds });
    setDeleteModalOpen(true);
  };

  // Single Delete Trigger
  const triggerSingleDeleteConfirm = (shipmentOrId, e) => {
    if (e) e.stopPropagation();
    let target = shipmentOrId;
    if (typeof shipmentOrId === "string") {
      target = shipments.find((s) => s.id === shipmentOrId);
    }
    setDeletingTarget({ isBulk: false, shipment: target });
    setDeleteModalOpen(true);
  };

  // Modal Confirm Callback
  const handleConfirmDelete = () => {
    if (!deletingTarget) return;

    if (deletingTarget.isBulk) {
      bulkDeleteShipments(deletingTarget.ids);
      setSelectedIds([]);
    } else if (deletingTarget.shipment) {
      deleteShipment(deletingTarget.shipment.id);
      if (
        selectedShipment &&
        selectedShipment.id === deletingTarget.shipment.id
      ) {
        setSelectedShipment(null);
      }
    }
    setDeletingTarget(null);
  };

  const handleCreateNew = () => {
    setEditingShipment(null);
    setFormDrawerOpen(true);
  };

  const handleEdit = (shipment, e) => {
    if (e) e.stopPropagation();
    setEditingShipment(shipment);
    setFormDrawerOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingShipment) {
      updateShipment(editingShipment.id, data);
    } else {
      addShipment(data);
    }
    setFormDrawerOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Transit":
        return "bg-[#E3F2FD] text-[#0066CC] border border-[#B3E5FC]";
      case "Picked Up":
      case "Delivered":
        return "bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]";
      case "Out for Delivery":
        return "bg-[#FFF3E0] text-[#E65100] border border-[#FFE082] font-bold";
      case "Pending":
        return "bg-[#FFF8E1] text-[#F57F17] border border-[#FFE082]";
      case "Cancelled":
      case "Failed Delivery":
        return "bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-full min-h-[calc(100vh-80px)] overflow-hidden font-['Inter'] relative">
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Top Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3D8] flex items-center justify-center border border-[#DCE6D2] text-[#233D19] shadow-2xs">
                <Truck className="w-6 h-6 text-[#233D19]" />
              </div>
              <div>
                <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#233D19] tracking-tight">
                  Shipments
                </h1>
                <p className="text-xs sm:text-sm text-[#5C7847] mt-0.5 font-medium">
                  Create, view, filter, track, and manage all parcel shipments.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateNew}
              className="px-5 py-2.5 bg-[#385429] hover:bg-[#233D19] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition duration-200 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span> Create New Shipment</span>
            </button>
          </div>

          {/* Metric Summary Cards Grid (6-Card Layout including Pending Pickup & Out for Delivery) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total Shipments */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-3">
              <div className="p-2.5 bg-[#EEF4E8] rounded-xl text-[#587640] flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-[#7A9560] truncate">
                  Total Shipments
                </p>
                <p className="text-lg font-extrabold text-[#233D19]">
                  {metrics.total}
                </p>
              </div>
            </div>

            {/* Pending Pickup */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-amber-800 truncate">
                  Pending Pickup
                </p>
                <p className="text-lg font-extrabold text-amber-900">
                  {metrics.pending}
                </p>
              </div>
            </div>

            {/* In Transit */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-700 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-blue-800 truncate">
                  In Transit
                </p>
                <p className="text-lg font-extrabold text-blue-900">
                  {metrics.inTransit}
                </p>
              </div>
            </div>

            {/* Out for Delivery */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-700 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-orange-800 truncate">
                  Out for Delivery
                </p>
                <p className="text-lg font-extrabold text-orange-900">
                  {metrics.outForDelivery}
                </p>
              </div>
            </div>

            {/* Delivered */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-emerald-800 truncate">
                  Delivered
                </p>
                <p className="text-lg font-extrabold text-emerald-900">
                  {metrics.delivered}
                </p>
              </div>
            </div>

            {/* Cancelled / Failed */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-700 flex-shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-rose-800 truncate">
                  Cancelled / Failed
                </p>
                <p className="text-lg font-extrabold text-rose-900">
                  {metrics.cancelled}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Checkbox Bulk Action Toolbar with Download CSV & Delete */}
          {selectedIds.length > 0 && (
            <div className="bg-[#233D19] text-white p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fadeIn border border-[#385429]">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white/20 rounded-full font-mono text-xs font-extrabold flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-amber-300" />
                  <span>{selectedIds.length} Selected</span>
                </div>
                <span className="text-xs text-[#C5E0AB] font-medium hidden sm:inline">
                  Perform bulk actions on checked shipments
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Bulk Status Dropdown */}
                <select
                  value={selectedBulkStatus}
                  onChange={(e) => {
                    setSelectedBulkStatus(e.target.value);
                    handleApplyBulkStatus(e.target.value);
                  }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 focus:outline-none cursor-pointer transition"
                >
                  <option value="" className="text-black font-semibold">
                    Bulk Change Status...
                  </option>
                  <option
                    value="Picked Up"
                    className="text-black font-semibold"
                  >
                    Mark as Picked Up
                  </option>
                  <option
                    value="In Transit"
                    className="text-black font-semibold"
                  >
                    Mark as In Transit
                  </option>
                  <option
                    value="Out for Delivery"
                    className="text-black font-semibold"
                  >
                    Mark as Out for Delivery
                  </option>
                  <option
                    value="Delivered"
                    className="text-black font-semibold"
                  >
                    Mark as Delivered
                  </option>
                  <option
                    value="Cancelled"
                    className="text-black font-semibold"
                  >
                    Mark as Cancelled
                  </option>
                </select>

                {/* Download Selected CSV Button */}
                <button
                  type="button"
                  onClick={handleExportSelectedCSV}
                  className="px-3.5 py-2 bg-[#587640] hover:bg-[#486634] text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs cursor-pointer border border-[#6F8E54]"
                  title="Download CSV for selected shipments"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV ({selectedIds.length})</span>
                </button>

                {/* Bulk Delete Button */}
                <button
                  type="button"
                  onClick={triggerBulkDeleteConfirm}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Delete selected shipments"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected ({selectedIds.length})</span>
                </button>

                {/* Deselect All */}
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="p-2 hover:bg-white/20 text-[#C5E0AB] hover:text-white rounded-xl transition cursor-pointer"
                  title="Deselect All"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Search, Filter & View Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#DCE6D2] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#7A9560] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Tracking ID, Sender, Receiver..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-[#F7F9F5] border border-[#E1EAD8] rounded-xl text-xs text-[#233D19] placeholder-[#8EA57B] focus:outline-none focus:ring-2 focus:ring-[#587640] transition"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-[#F7F9F5] border border-[#E1EAD8] rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] cursor-pointer"
              >
                <option value="All Types">All Parcel Types</option>
                <option value="Electronics">Electronics</option>
                <option value="Documents">Documents</option>
                <option value="Clothing">Clothing</option>
                <option value="Fragile">Fragile</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-[#F7F9F5] border border-[#E1EAD8] rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="In Transit">In Transit</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Delivered">Delivered</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Failed Delivery">Failed Delivery</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[#F7F9F5] border border-[#E1EAD8] rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] cursor-pointer"
              >
                <option value="Sort by Date">Sort by Latest Date</option>
                <option value="Sort by Tracking No">Sort by Tracking ID</option>
                <option value="Sort by Weight">Sort by Parcel Weight</option>
              </select>

              {/* Clear Filters */}
              {(searchQuery ||
                selectedType !== "All Types" ||
                selectedStatus !== "All Statuses") && (
                <button
                  onClick={handleClearFilters}
                  className="p-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition border border-red-200 flex items-center gap-1 font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}

              {/* View Mode Switcher Toggle */}
              <div className="flex items-center bg-[#F7F9F5] p-1 border border-[#E1EAD8] rounded-xl ml-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "table"
                      ? "bg-white text-[#233D19] shadow-2xs font-bold"
                      : "text-[#7A9560] hover:text-[#233D19]"
                  }`}
                  title="Table View"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-white text-[#233D19] shadow-2xs font-bold"
                      : "text-[#7A9560] hover:text-[#233D19]"
                  }`}
                  title="Card View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Display */}
          {filteredShipments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#DCE6D2] p-12 text-center">
              <Package className="w-12 h-12 text-[#9BB388] mx-auto mb-3" />
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                No Shipments Found
              </h3>
              <p className="text-xs text-[#698453] mt-1 max-w-sm mx-auto">
                No matching shipments found with the current search query or
                filter criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-[#EEF4E8] text-[#3E582A] text-xs font-bold rounded-xl hover:bg-[#E1EAD8] transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "table" ? (
            /* Table View */
            <div className="bg-white rounded-2xl border border-[#DCE6D2] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F9F5] border-b border-[#E1EAD8] text-[11px] font-extrabold text-[#587640] uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            currentShipments.length > 0 &&
                            currentShipments.every((s) =>
                              selectedIds.includes(s.id),
                            )
                          }
                          className="w-4 h-4 rounded border-[#DCE6D2] text-[#385429] focus:ring-[#587640] cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4">Tracking No</th>
                      <th className="py-3.5 px-4">Sender</th>
                      <th className="py-3.5 px-4">Receiver</th>
                      <th className="py-3.5 px-4">Type & Weight</th>
                      <th className="py-3.5 px-4">Shipping Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5EC] text-xs font-medium text-[#233D19]">
                    {currentShipments.map((shipment) => {
                      const isSelected = selectedIds.includes(shipment.id);
                      return (
                        <tr
                          key={shipment.id}
                          onClick={() => setSelectedShipment(shipment)}
                          className={`hover:bg-[#F9FBF7] transition cursor-pointer ${
                            isSelected
                              ? "bg-[#F2F7EC] border-l-4 border-l-[#385429]"
                              : ""
                          }`}
                        >
                          <td
                            className="py-4 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleSelectOne(shipment.id, e)}
                              className="w-4 h-4 rounded border-[#DCE6D2] text-[#385429] focus:ring-[#587640] cursor-pointer"
                            />
                          </td>

                          {/* Tracking No */}
                          <td className="py-4 px-4">
                            <span className="font-mono font-extrabold text-[#233D19]">
                              {shipment.trackingNo}
                            </span>
                          </td>

                          {/* Sender */}
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-bold text-[#233D19]">
                                {shipment.sender}
                              </p>
                              <p className="text-[10px] text-[#698453] truncate max-w-[140px]">
                                {shipment.pickupAddress}
                              </p>
                            </div>
                          </td>

                          {/* Receiver */}
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-bold text-[#233D19]">
                                {shipment.receiver}
                              </p>
                              <p className="text-[10px] text-[#698453] truncate max-w-[140px]">
                                {shipment.deliveryAddress}
                              </p>
                            </div>
                          </td>

                          {/* Type & Weight */}
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F7EF] rounded-lg text-[#3E582A] font-semibold text-[11px]">
                              {shipment.type} ({shipment.weight})
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-4 px-4 text-[#698453] font-medium">
                            {shipment.shippingDate}
                          </td>

                          {/* Live Interactive Status Dropdown Pill */}
                          <td
                            className="py-4 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              value={shipment.status}
                              onChange={(e) =>
                                updateShipmentStatus(
                                  shipment.id,
                                  e.target.value,
                                )
                              }
                              className={`px-3 py-1 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                                shipment.status,
                              )}`}
                            >
                              <option value="In Transit">In Transit</option>
                              <option value="Picked Up">Picked Up</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Out for Delivery">
                                Out for Delivery
                              </option>
                              <option value="Pending">Pending</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Failed Delivery">
                                Failed Delivery
                              </option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td
                            className="py-4 px-4 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedShipment(shipment)}
                                className="p-1.5 hover:bg-[#EEF4E8] text-[#587640] rounded-lg transition cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleEdit(shipment, e)}
                                className="p-1.5 hover:bg-[#EEF4E8] text-[#587640] rounded-lg transition cursor-pointer"
                                title="Edit Shipment"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) =>
                                  triggerSingleDeleteConfirm(shipment, e)
                                }
                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition cursor-pointer"
                                title="Delete Shipment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Pagination */}
              <div className="p-4 border-t border-[#EEF4E8] bg-[#F7F9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#698453]">
                <div>
                  Showing{" "}
                  <span className="font-bold text-[#233D19]">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      filteredShipments.length,
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-[#233D19]">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredShipments.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#233D19]">
                    {filteredShipments.length}
                  </span>{" "}
                  shipments
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-[#DCE6D2] hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition text-[#233D19]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-bold text-[#233D19]">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="p-1.5 rounded-lg border border-[#DCE6D2] hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition text-[#233D19]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Card Grid View */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {currentShipments.map((shipment) => {
                  const isSelected = selectedIds.includes(shipment.id);
                  return (
                    <div
                      key={shipment.id}
                      onClick={() => setSelectedShipment(shipment)}
                      className={`bg-white p-5 rounded-2xl border ${
                        isSelected
                          ? "border-[#385429] ring-2 ring-[#587640]/30 bg-[#F9FBF7]"
                          : "border-[#DCE6D2]"
                      } shadow-2xs hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between group relative`}
                    >
                      {/* Checkbox badge on card top left */}
                      <div
                        className="absolute top-3 left-3 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(shipment.id, e)}
                          className="w-4 h-4 rounded border-[#DCE6D2] text-[#385429] focus:ring-[#587640] cursor-pointer"
                        />
                      </div>

                      <div>
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-2 mb-3 pl-6">
                          <span className="font-mono font-extrabold text-sm text-[#233D19] block group-hover:text-[#385429] transition">
                            {shipment.trackingNo}
                          </span>

                          <div onClick={(e) => e.stopPropagation()}>
                            <select
                              value={shipment.status}
                              onChange={(e) =>
                                updateShipmentStatus(
                                  shipment.id,
                                  e.target.value,
                                )
                              }
                              className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                                shipment.status,
                              )}`}
                            >
                              <option value="In Transit">In Transit</option>
                              <option value="Picked Up">Picked Up</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Out for Delivery">
                                Out for Delivery
                              </option>
                              <option value="Pending">Pending</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Failed Delivery">
                                Failed Delivery
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* Addresses */}
                        <div className="space-y-2 text-xs text-[#3E582A] mb-4 bg-[#FAFCF8] p-3 rounded-xl border border-[#E3EDDA]">
                          <div>
                            <span className="text-[10px] font-bold text-[#7A9560] block">
                              SENDER
                            </span>
                            <span className="font-bold text-[#233D19]">
                              {shipment.sender}
                            </span>
                            <p className="text-[11px] text-[#698453] truncate">
                              {shipment.pickupAddress}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#E3EDDA]">
                            <span className="text-[10px] font-bold text-[#7A9560] block">
                              RECEIVER
                            </span>
                            <span className="font-bold text-[#233D19]">
                              {shipment.receiver}
                            </span>
                            <p className="text-[11px] text-[#698453] truncate">
                              {shipment.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-[#EEF4E8] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-[#7A9560] font-bold block">
                            TYPE & WEIGHT
                          </span>
                          <span className="font-bold text-[#233D19]">
                            {shipment.type} ({shipment.weight})
                          </span>
                        </div>

                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleEdit(shipment, e)}
                            className="p-1.5 hover:bg-[#EEF4E8] text-[#587640] rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) =>
                              triggerSingleDeleteConfirm(shipment, e)
                            }
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grid Pagination Footer */}
              <div className="mt-6 p-4 bg-white rounded-2xl border border-[#DCE6D2] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#698453]">
                <div>
                  Showing{" "}
                  <span className="font-bold text-[#233D19]">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      filteredShipments.length,
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-[#233D19]">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredShipments.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#233D19]">
                    {filteredShipments.length}
                  </span>{" "}
                  shipments
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-[#DCE6D2] hover:bg-[#F4F7EF] disabled:opacity-40 disabled:hover:bg-transparent transition text-[#233D19]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-bold text-[#233D19]">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="p-1.5 rounded-lg border border-[#DCE6D2] hover:bg-[#F4F7EF] disabled:opacity-40 disabled:hover:bg-transparent transition text-[#233D19]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipment Details Drawer Panel (Overlay) */}
        {selectedShipment && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px] transition-opacity"
              onClick={() => setSelectedShipment(null)}
            />
            <ShipmentDetailsPanel
              shipment={selectedShipment}
              onClose={() => setSelectedShipment(null)}
              onEdit={(s) => {
                setSelectedShipment(null);
                setEditingShipment(s);
                setFormDrawerOpen(true);
              }}
              onDelete={(id) => triggerSingleDeleteConfirm(id)}
              onStatusChange={updateShipmentStatus}
            />
          </>
        )}

        {/* Shipment Create/Edit Form Drawer (Overlay) */}
        {formDrawerOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px] transition-opacity"
              onClick={() => setFormDrawerOpen(false)}
            />
            <ShipmentFormDrawer
              isOpen={formDrawerOpen}
              onClose={() => setFormDrawerOpen(false)}
              onSubmit={handleFormSubmit}
              initialData={editingShipment}
            />
          </>
        )}

        {/* Custom Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          title={
            deletingTarget?.isBulk
              ? "Delete Selected Shipments?"
              : "Delete Shipment?"
          }
          message={
            deletingTarget?.isBulk
              ? `Are you sure you want to delete ${deletingTarget.ids.length} selected shipments? This action cannot be undone.`
              : `Are you sure you want to delete shipment "${
                  deletingTarget?.shipment
                    ? deletingTarget.shipment.trackingNo
                    : ""
                }"? This record will be permanently removed.`
          }
          onConfirm={handleConfirmDelete}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingTarget(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default ShipmentsPage;
