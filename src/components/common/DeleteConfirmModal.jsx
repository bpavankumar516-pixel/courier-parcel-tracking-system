import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Inter']">
      
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DCE6D2] relative z-10 text-center transform transition-all duration-200 scale-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F4F7EF] text-[#698453] hover:text-[#233D19] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Red Icon Badge */}
        <div className="w-14 h-14 bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Title & Message */}
        <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg text-[#233D19] mb-1.5">
          {title || 'Delete Confirmation'}
        </h3>
        <p className="text-xs text-[#5C7847] leading-relaxed mb-6">
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-[#EEF4E8] hover:bg-[#E2EBDB] text-[#3E582A] font-extrabold text-xs rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;
