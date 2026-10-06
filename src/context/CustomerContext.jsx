import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCustomersFromAPI, getCustomersFromStorage, saveCustomersToStorage } from '../services/customerData';
import { toast } from 'react-toastify';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers from API or local storage cache
  const loadCustomers = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await fetchCustomersFromAPI(forceRefresh);
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError(err.message || 'Failed to fetch customer data');
      toast.error('Could not fetch live customer data. Using fallback.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(false);
  }, []);

  const refreshFromAPI = async () => {
    const loadingToast = toast.loading('Syncing customer data from DummyJSON Users API...');
    try {
      const { data } = await fetchCustomersFromAPI(true);
      setCustomers(data);
      toast.update(loadingToast, {
        render: 'Successfully synced live user data from DummyJSON API!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      toast.update(loadingToast, {
        render: 'Failed to sync API data: ' + err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

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
