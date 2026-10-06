import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCustomersFromStorage, saveCustomersToStorage } from '../services/customerData';
import { toast } from 'react-toastify';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Load initial customer state
  useEffect(() => {
    const loadedCustomers = getCustomersFromStorage();
    setCustomers(loadedCustomers);
  }, []);

  // Save to LocalStorage whenever customers change
  const updateCustomersState = (newCustomers) => {
    setCustomers(newCustomers);
    saveCustomersToStorage(newCustomers);
  };

  // Drawer Controls
  const openProfileDrawer = (customer) => {
    setSelectedCustomer(customer);
    setIsProfileDrawerOpen(true);
  };

  const closeProfileDrawer = () => {
    setIsProfileDrawerOpen(false);
    setSelectedCustomer(null);
  };

  const openFormDrawer = (customer = null) => {
    setEditingCustomer(customer);
    setIsFormDrawerOpen(true);
  };

  const closeFormDrawer = () => {
    setIsFormDrawerOpen(false);
    setEditingCustomer(null);
  };

  // Add Customer
  const addCustomer = (customerData) => {
    const avatarBgs = [
      'bg-emerald-100 text-emerald-800 border-emerald-300',
      'bg-blue-100 text-blue-800 border-blue-300',
      'bg-purple-100 text-purple-800 border-purple-300',
      'bg-amber-100 text-amber-800 border-amber-300',
      'bg-teal-100 text-teal-800 border-teal-300'
    ];
    const randomBg = avatarBgs[Math.floor(Math.random() * avatarBgs.length)];

    const newCustomer = {
      ...customerData,
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      totalShipments: 0,
      deliveredCount: 0,
      pendingCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      avatarBg: randomBg
    };

    const updated = [newCustomer, ...customers];
    updateCustomersState(updated);
    toast.success(`Customer ${newCustomer.name} added successfully!`);
    closeFormDrawer();
  };

  // Update Customer
  const updateCustomer = (id, updatedFields) => {
    const updated = customers.map((c) => {
      if (c.id === id) {
        const newObj = { ...c, ...updatedFields };
        if (selectedCustomer && selectedCustomer.id === id) {
          setSelectedCustomer(newObj);
        }
        return newObj;
      }
      return c;
    });
    updateCustomersState(updated);
    toast.info(`Customer details updated`);
    closeFormDrawer();
  };

  // Update Status directly
  const updateCustomerStatus = (id, newStatus) => {
    const updated = customers.map((c) => {
      if (c.id === id) {
        const newObj = { ...c, status: newStatus };
        if (selectedCustomer && selectedCustomer.id === id) {
          setSelectedCustomer(newObj);
        }
        return newObj;
      }
      return c;
    });
    updateCustomersState(updated);
    toast.success(`Customer status updated to ${newStatus}`);
  };

  // Delete Customer
  const deleteCustomer = (id) => {
    const cust = customers.find((c) => c.id === id);
    const updated = customers.filter((c) => c.id !== id);
    updateCustomersState(updated);
    toast.warn(`Customer ${cust ? cust.name : id} deleted`);
    if (selectedCustomer && selectedCustomer.id === id) {
      closeProfileDrawer();
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        selectedCustomer,
        isProfileDrawerOpen,
        isFormDrawerOpen,
        editingCustomer,
        openProfileDrawer,
        closeProfileDrawer,
        openFormDrawer,
        closeFormDrawer,
        addCustomer,
        updateCustomer,
        updateCustomerStatus,
        deleteCustomer
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};
