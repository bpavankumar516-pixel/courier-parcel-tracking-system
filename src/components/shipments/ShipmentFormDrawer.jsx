import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, MapPin, Package, Weight, Tag, Calendar } from 'lucide-react';

const ShipmentFormDrawer = ({ isOpen, onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      sender: '',
      senderEmail: '',
      senderPhone: '',
      receiver: '',
      receiverEmail: '',
      receiverPhone: '',
      pickupAddress: '',
      deliveryAddress: '',
      type: 'Electronics',
      weight: '1.0 kg',
      status: 'Pending'
    }
  });

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        sender: initialData.sender || '',
        senderEmail: initialData.senderEmail || '',
        senderPhone: initialData.senderPhone || '',
        receiver: initialData.receiver || '',
        receiverEmail: initialData.receiverEmail || '',
        receiverPhone: initialData.receiverPhone || '',
        pickupAddress: initialData.pickupAddress || '',
        deliveryAddress: initialData.deliveryAddress || '',
        type: initialData.type || 'Electronics',
        weight: initialData.weight || '1.0 kg',
        status: initialData.status || 'Pending'
      });
    } else {
      reset({
        sender: '',
        senderEmail: '',
        senderPhone: '',
        receiver: '',
        receiverEmail: '',
        receiverPhone: '',
        pickupAddress: '',
        deliveryAddress: '',
        type: 'Electronics',
        weight: '1.0 kg',
        status: 'Pending'
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-full lg:w-[440px] bg-white border-l border-[#DCE6D2] shadow-2xl z-50 overflow-y-auto flex flex-col justify-between font-['Inter'] transition-all duration-300">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-[#EEF4E8] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19]">
              {isEdit ? 'Edit Shipment' : 'Create New Shipment'}
            </h3>
            <p className="text-xs text-[#698453]">
              {isEdit ? 'Update parcel logistics details' : 'Dispatch a new parcel package'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4F7EF] text-[#698453] hover:text-[#233D19] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Inputs */}
        <form id="shipment-form" onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          
          {/* Sender & Receiver Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#385429] mb-1">
                Sender Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register('sender', { required: 'Sender name is required' })}
                className={`w-full px-3 py-2 bg-white border ${
                  errors.sender ? 'border-red-500' : 'border-[#DCE6D2]'
                } rounded-xl text-xs text-[#233D19] font-medium focus:ring-2 focus:ring-[#587640] focus:outline-none`}
              />
              {errors.sender && <p className="text-[10px] text-red-500 mt-0.5">{errors.sender.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#385429] mb-1">
                Receiver Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Sarah Wilson"
                {...register('receiver', { required: 'Receiver name is required' })}
                className={`w-full px-3 py-2 bg-white border ${
                  errors.receiver ? 'border-red-500' : 'border-[#DCE6D2]'
                } rounded-xl text-xs text-[#233D19] font-medium focus:ring-2 focus:ring-[#587640] focus:outline-none`}
              />
              {errors.receiver && <p className="text-[10px] text-red-500 mt-0.5">{errors.receiver.message}</p>}
            </div>
          </div>

          {/* Contact Emails */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#385429] mb-1">Sender Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                {...register('senderEmail')}
                className="w-full px-3 py-2 bg-white border border-[#DCE6D2] rounded-xl text-xs text-[#233D19] focus:ring-2 focus:ring-[#587640] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#385429] mb-1">Receiver Email</label>
              <input
                type="email"
                placeholder="sarah@example.com"
                {...register('receiverEmail')}
                className="w-full px-3 py-2 bg-white border border-[#DCE6D2] rounded-xl text-xs text-[#233D19] focus:ring-2 focus:ring-[#587640] focus:outline-none"
              />
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#587640]" />
              <span>Pickup Address <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="123 Main St, New York, NY 10001"
              {...register('pickupAddress', { required: 'Pickup address is required' })}
              className={`w-full px-3 py-2 bg-white border ${
                errors.pickupAddress ? 'border-red-500' : 'border-[#DCE6D2]'
              } rounded-xl text-xs text-[#233D19] font-medium focus:ring-2 focus:ring-[#587640] focus:outline-none`}
            />
            {errors.pickupAddress && <p className="text-[10px] text-red-500 mt-0.5">{errors.pickupAddress.message}</p>}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#587640]" />
              <span>Delivery Address <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="456 Market St, San Francisco, CA 94105"
              {...register('deliveryAddress', { required: 'Delivery address is required' })}
              className={`w-full px-3 py-2 bg-white border ${
                errors.deliveryAddress ? 'border-red-500' : 'border-[#DCE6D2]'
              } rounded-xl text-xs text-[#233D19] font-medium focus:ring-2 focus:ring-[#587640] focus:outline-none`}
            />
            {errors.deliveryAddress && <p className="text-[10px] text-red-500 mt-0.5">{errors.deliveryAddress.message}</p>}
          </div>

          {/* Package Type & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#385429] mb-1">Type</label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 bg-white border border-[#DCE6D2] rounded-xl text-xs text-[#233D19] font-medium"
              >
                <option value="Electronics">Electronics</option>
                <option value="Documents">Documents</option>
                <option value="Clothing">Clothing</option>
                <option value="Fragile">Fragile</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#385429] mb-1">Weight</label>
              <input
                type="text"
                placeholder="1.2 kg"
                {...register('weight')}
                className="w-full px-3 py-2 bg-white border border-[#DCE6D2] rounded-xl text-xs text-[#233D19]"
              />
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-bold text-[#385429] mb-1">Initial Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-white border border-[#DCE6D2] rounded-xl text-xs text-[#233D19] font-bold"
            >
              <option value="Pending">Pending</option>
              <option value="Picked Up">Picked Up</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

        </form>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-6 border-t border-[#EEF4E8] bg-[#FAFCF8] flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-[#EEF4E8] hover:bg-[#E2EBDB] text-[#3E582A] font-extrabold text-xs rounded-xl transition text-center cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="shipment-form"
          className="flex-1 py-3 px-4 bg-[#385429] hover:bg-[#233D19] text-white font-extrabold text-xs rounded-xl shadow-sm transition text-center cursor-pointer"
        >
          {isEdit ? 'Save Changes' : 'Dispatch Shipment'}
        </button>
      </div>
    </div>
  );
};

export default ShipmentFormDrawer;
