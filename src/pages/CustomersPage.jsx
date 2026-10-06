import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCustomers } from '../context/CustomerContext';
import CustomerProfilePanel from '../components/customers/CustomerProfilePanel';
import CustomerFormDrawer from '../components/customers/CustomerFormDrawer';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import {
  Search,
  Filter,
  Plus,
  LayoutList,
  LayoutGrid,
  Users,
  UserCheck,
  Award,
  UserX,
  Mail,
  Phone,
  MapPin,
  Package,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  XCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Loader2
} from 'lucide-react';

const CustomerAvatar = ({ customer, size = 'w-10 h-10', textSize = 'text-xs' }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`${size} rounded-xl flex items-center justify-center font-bold ${textSize} border overflow-hidden flex-shrink-0 ${
        customer.avatarBg || 'bg-emerald-100 text-emerald-800 border-emerald-300'
      }`}
    >
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
  );
};

const CustomersPage = () => {
  const {
    customers,
    selectedCustomer,
    isProfileDrawerOpen,
    isFormDrawerOpen,
    editingCustomer,
    isLoading,
    error,
    refreshFromAPI,
    openProfileDrawer,
    closeProfileDrawer,
    openFormDrawer,
    closeFormDrawer,
    addCustomer,
    updateCustomer,
    updateCustomerStatus,
    deleteCustomer
  } = useCustomers();

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  // Local State
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique cities
  const availableCities = useMemo(() => {
    const cities = customers.map((c) => c.city);
    return ['All', ...Array.from(new Set(cities))];
  }, [customers]);

  // Metrics
  const metrics = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === 'Active').length;
    const plus = customers.filter((c) => c.status === 'Plus Member' || c.status === 'Plus' || c.status === 'VIP').length;
    const inactive = customers.filter((c) => c.status === 'Inactive').length;
    return { total, active, plus, inactive };
  }, [customers]);

  // Filter & Sort
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query) ||
          customer.city.toLowerCase().includes(query) ||
          customer.id.toLowerCase().includes(query);

        const matchesCity = cityFilter === 'All' || customer.city === cityFilter;
        const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;

        return matchesSearch && matchesCity && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'shipments') return b.totalShipments - a.totalShipments;
        if (sortBy === 'date') return new Date(b.joinedDate) - new Date(a.joinedDate);
        return 0;
      });
  }, [customers, searchQuery, cityFilter, statusFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedCustomers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCityFilter('All');
    setStatusFilter('All');
    setSortBy('name');
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Plus Member':
      case 'Plus':
      case 'VIP':
        return 'bg-purple-100 text-purple-800 border border-purple-300 font-bold';
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700 border border-gray-300 font-bold';
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

  const triggerDeleteCustomer = (custOrId, e) => {
    if (e) e.stopPropagation();
    let target = custOrId;
    if (typeof custOrId === 'string') {
      target = customers.find((c) => c.id === custOrId);
    }
    setDeletingCustomer(target);
    setDeleteModalOpen(true);
  };

  const handleConfirmDeleteCustomer = () => {
    if (!deletingCustomer) return;
    deleteCustomer(deletingCustomer.id);
    setDeletingCustomer(null);
  };

  const handleFormSubmit = (data) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
    } else {
      addCustomer(data);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-full min-h-[calc(100vh-80px)] overflow-hidden font-['Inter'] relative">
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#233D19] tracking-tight">
                Customer Management
              </h1>
              <p className="text-xs text-[#698453] mt-0.5">
                Manage registered customer accounts, shipping histories, and tiers.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={refreshFromAPI}
                className="px-4 py-2.5 bg-[#EEF4E8] hover:bg-[#E1EAD8] text-[#3E582A] rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#DCE6D2] shadow-2xs transition duration-200 cursor-pointer"
                title="Sync fresh live customer data from DummyJSON Users API"
              >
                <RefreshCw className="w-4 h-4 text-[#587640]" />
                <span>Sync Live API</span>
              </button>

              <button
                onClick={() => openFormDrawer(null)}
                className="px-5 py-2.5 bg-[#385429] hover:bg-[#233D19] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Customer</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-[#EEF4E8] rounded-xl text-[#587640]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#7A9560]">Total Customers</p>
                <p className="text-xl font-extrabold text-[#233D19]">{metrics.total}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800">Active Accounts</p>
                <p className="text-xl font-extrabold text-emerald-900">{metrics.active}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-700">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-800">Plus Members</p>
                <p className="text-xl font-extrabold text-purple-900">{metrics.plus}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DCE6D2] shadow-2xs flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Inactive Accounts</p>
                <p className="text-xl font-extrabold text-gray-900">{metrics.inactive}</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#DCE6D2] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#7A9560] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers by name, email, phone, city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-[#F7F9F5] border border-[#E1EAD8] rounded-xl text-xs text-[#233D19] placeholder-[#8EA57B] focus:outline-none focus:ring-2 focus:ring-[#587640] transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-[#F7F9F5] border border-[#E1EAD8] rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] cursor-pointer"
              >
                <option value="All">All Cities</option>
                {availableCities.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-[#F7F9F5] border border-[#E1EAD8] rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] cursor-pointer"
              >
                <option value="All">All Tiers</option>
                <option value="Active">Active</option>
                <option value="Plus Member">Plus Member</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[#F7F9F5] border border-[#E1EAD8] rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="shipments">Sort by Shipments</option>
                <option value="date">Sort by Joined Date</option>
              </select>

              {(searchQuery || cityFilter !== 'All' || statusFilter !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="p-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition border border-red-200 flex items-center gap-1 font-bold"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}

              <div className="flex items-center bg-[#F7F9F5] p-1 border border-[#E1EAD8] rounded-xl ml-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'table'
                      ? 'bg-white text-[#233D19] shadow-2xs font-bold'
                      : 'text-[#7A9560] hover:text-[#233D19]'
                  }`}
                  title="Table View"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#233D19] shadow-2xs font-bold'
                      : 'text-[#7A9560] hover:text-[#233D19]'
                  }`}
                  title="Card View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Table / Grid */}
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[#DCE6D2] p-16 text-center shadow-2xs">
              <Loader2 className="w-10 h-10 text-[#385429] animate-spin mx-auto mb-3" />
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                Fetching Live Customers...
              </h3>
              <p className="text-xs text-[#698453] mt-1">
                Loading real customer account records from DummyJSON Users API.
              </p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#DCE6D2] p-12 text-center">
              <Users className="w-12 h-12 text-[#9BB388] mx-auto mb-3" />
              <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19]">
                No Customers Found
              </h3>
              <p className="text-xs text-[#698453] mt-1 max-w-sm mx-auto">
                No matching customer accounts found with the current search query or filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-[#EEF4E8] text-[#3E582A] text-xs font-bold rounded-xl hover:bg-[#E1EAD8] transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'table' ? (
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
                            paginatedCustomers.length > 0 &&
                            paginatedCustomers.every((c) => selectedIds.includes(c.id))
                          }
                          className="rounded border-[#DCE6D2] text-[#385429] focus:ring-[#587640] cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">City / Region</th>
                      <th className="py-3.5 px-4">Shipments</th>
                      <th className="py-3.5 px-4">Tier Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5EC] text-xs font-medium text-[#233D19]">
                    {paginatedCustomers.map((customer) => {
                      const isSelected = selectedIds.includes(customer.id);
                      return (
                        <tr
                          key={customer.id}
                          onClick={() => openProfileDrawer(customer)}
                          className={`hover:bg-[#F9FBF7] transition cursor-pointer ${
                            isSelected ? 'bg-[#F2F7EC]' : ''
                          }`}
                        >
                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleSelectRow(customer.id, e)}
                              className="rounded border-[#DCE6D2] text-[#385429] focus:ring-[#587640] cursor-pointer"
                            />
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <CustomerAvatar customer={customer} size="w-10 h-10" textSize="text-xs" />
                              <div>
                                <span className="font-extrabold text-[#233D19] block">{customer.name}</span>
                                <span className="text-[10px] font-mono text-[#7A9560]">{customer.id}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div>
                              <p className="text-xs text-[#233D19]">{customer.email}</p>
                              <p className="text-[11px] text-[#698453]">{customer.phone}</p>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F7EF] rounded-lg text-[#3E582A] font-semibold text-[11px]">
                              <MapPin className="w-3 h-3 text-[#587640]" />
                              {customer.city}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#233D19]">{customer.totalShipments}</span>
                              <span className="text-[10px] text-[#698453]">({customer.deliveredCount} delivered)</span>
                            </div>
                          </td>

                          <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={customer.status}
                              onChange={(e) => updateCustomerStatus(customer.id, e.target.value)}
                              className={`px-3 py-1 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                                customer.status
                              )}`}
                            >
                              <option value="Active">Active</option>
                              <option value="Plus Member">Plus Member</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </td>

                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openProfileDrawer(customer)}
                                className="p-1.5 hover:bg-[#EEF4E8] text-[#587640] rounded-lg transition"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openFormDrawer(customer)}
                                className="p-1.5 hover:bg-[#EEF4E8] text-[#587640] rounded-lg transition"
                                title="Edit Customer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => triggerDeleteCustomer(customer, e)}
                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                                title="Delete Customer"
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

              {/* Pagination */}
              <div className="p-4 border-t border-[#EEF4E8] bg-[#F7F9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#698453]">
                <div>
                  Showing{' '}
                  <span className="font-bold text-[#233D19]">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCustomers.length)}
                  </span>{' '}
                  to{' '}
                  <span className="font-bold text-[#233D19]">
                    {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
                  </span>{' '}
                  of <span className="font-bold text-[#233D19]">{filteredCustomers.length}</span> customers
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => openProfileDrawer(customer)}
                    className="bg-white p-5 rounded-2xl border border-[#DCE6D2] shadow-2xs hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <CustomerAvatar customer={customer} size="w-12 h-12" textSize="text-sm" />

                        <div onClick={(e) => e.stopPropagation()}>
                          <select
                            value={customer.status}
                            onChange={(e) => updateCustomerStatus(customer.id, e.target.value)}
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                              customer.status
                            )}`}
                          >
                            <option value="Active">Active</option>
                            <option value="Plus Member">Plus Member</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-[#233D19] group-hover:text-[#385429] transition">
                        {customer.name}
                      </h4>
                      <p className="text-[10px] font-mono text-[#7A9560] mb-3">{customer.id}</p>

                      <div className="space-y-2 text-xs text-[#587640] mb-4">
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-[#7A9560]" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-[#7A9560]" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#7A9560]" />
                          <span className="truncate">{customer.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EEF4E8] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#7A9560] font-bold block">TOTAL SHIPMENTS</span>
                        <span className="font-extrabold text-[#233D19] text-sm">{customer.totalShipments}</span>
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openFormDrawer(customer)}
                          className="p-1.5 hover:bg-[#EEF4E8] text-[#587640] rounded-lg transition"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => triggerDeleteCustomer(customer, e)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Pagination Footer */}
              <div className="mt-6 p-4 bg-white rounded-2xl border border-[#DCE6D2] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#698453]">
                <div>
                  Showing{' '}
                  <span className="font-bold text-[#233D19]">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCustomers.length)}
                  </span>{' '}
                  to{' '}
                  <span className="font-bold text-[#233D19]">
                    {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
                  </span>{' '}
                  of <span className="font-bold text-[#233D19]">{filteredCustomers.length}</span> customers
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-[#DCE6D2] hover:bg-[#F4F7EF] disabled:opacity-40 disabled:hover:bg-transparent transition text-[#233D19]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Customer Profile Side Drawer Panel */}
        {isProfileDrawerOpen && selectedCustomer && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px] transition-opacity"
              onClick={closeProfileDrawer}
            />
            <CustomerProfilePanel
              customer={selectedCustomer}
              onClose={closeProfileDrawer}
              onEdit={(cust) => {
                closeProfileDrawer();
                openFormDrawer(cust);
              }}
              onDelete={(id) => triggerDeleteCustomer(id)}
              onStatusChange={updateCustomerStatus}
            />
          </>
        )}

        {/* Customer Add/Edit Form Side Drawer Panel */}
        {isFormDrawerOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px] transition-opacity"
              onClick={closeFormDrawer}
            />
            <CustomerFormDrawer
              isOpen={isFormDrawerOpen}
              onClose={closeFormDrawer}
              onSubmit={handleFormSubmit}
              initialData={editingCustomer}
            />
          </>
        )}

        {/* Custom Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Customer Account?"
          message={`Are you sure you want to delete customer "${
            deletingCustomer ? deletingCustomer.name : ''
          }" (${deletingCustomer ? deletingCustomer.id : ''})? This record will be permanently deleted.`}
          onConfirm={handleConfirmDeleteCustomer}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingCustomer(null);
          }}
        />

      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
