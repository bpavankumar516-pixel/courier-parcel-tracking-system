import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Mail, Phone, MapPin, StickyNote, Building } from 'lucide-react';

const CustomerFormDrawer = ({ isOpen, onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      status: 'Active',
      notes: ''
    }
  });

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        city: initialData.city || '',
        address: initialData.address || '',
        status: initialData.status || 'Active',
        notes: initialData.notes || ''
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        status: 'Active',
        notes: ''
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-full sm:w-[440px] lg:w-[440px] bg-white border-l border-[#DCE6D2] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between font-['Inter'] shadow-2xl z-50 transition-all duration-300">
      <div>
        {/* Form Drawer Header */}
        <div className="p-6 border-b border-[#EEF4E8] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
              {isEdit ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <p className="text-xs text-[#698453]">
              {isEdit ? 'Update customer profile information' : 'Register a new customer account'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4F7EF] text-[#698453] hover:text-[#233D19] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Inputs Container */}
        <form id="customer-form" onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#587640]" />
              <span>Full Name <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Wilson"
              {...register('name', { required: 'Full name is required' })}
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.name ? 'border-red-500' : 'border-[#DCE6D2]'
              } rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] transition`}
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#587640]" />
              <span>Email Address <span className="text-red-500">*</span></span>
            </label>
            <input
              type="email"
              placeholder="e.g. sarah.w@example.com"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.email ? 'border-red-500' : 'border-[#DCE6D2]'
              } rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] transition`}
            />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#587640]" />
              <span>Phone Number <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. +1 (555) 234-5678"
              {...register('phone', { required: 'Phone number is required' })}
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.phone ? 'border-red-500' : 'border-[#DCE6D2]'
              } rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] transition`}
            />
            {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          {/* City / State */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#587640]" />
              <span>City / Region <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. New York, NY"
              {...register('city', { required: 'City is required' })}
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.city ? 'border-red-500' : 'border-[#DCE6D2]'
              } rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] transition`}
            />
            {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city.message}</p>}
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#587640]" />
              <span>Full Address <span className="text-red-500">*</span></span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 742 Evergreen Terrace, New York, NY 10001"
              {...register('address', { required: 'Full address is required' })}
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.address ? 'border-red-500' : 'border-[#DCE6D2]'
              } rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] transition resize-none`}
            />
            {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address.message}</p>}
          </div>

          {/* Customer Status */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1.5">
              Customer Tier / Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-2.5 bg-white border border-[#DCE6D2] rounded-xl text-xs text-[#233D19] font-semibold focus:outline-none focus:ring-2 focus:ring-[#587640] transition"
            >
              <option value="Active">Active Customer</option>
              <option value="Plus Member">Plus Member Account</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1.5 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-[#587640]" />
              <span>Internal Notes / Preferences</span>
            </label>
            <textarea
              rows={3}
              placeholder="Special instructions or preferences..."
              {...register('notes')}
              className="w-full px-4 py-2.5 bg-white border border-[#DCE6D2] rounded-xl text-xs text-[#233D19] font-medium focus:outline-none focus:ring-2 focus:ring-[#587640] transition resize-none"
            />
          </div>

        </form>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-6 border-t border-[#EEF4E8] bg-[#FAFCF8] flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-[#EEF4E8] hover:bg-[#E2EBDB] text-[#3E582A] font-extrabold text-xs rounded-xl transition text-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="customer-form"
          className="flex-1 py-3 px-4 bg-[#385429] hover:bg-[#233D19] text-white font-extrabold text-xs rounded-xl shadow-sm transition text-center"
        >
          {isEdit ? 'Save Changes' : 'Create Customer'}
        </button>
      </div>
    </div>
  );
};

export default CustomerFormDrawer;
