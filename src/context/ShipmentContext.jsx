import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialShipments, getShipmentsFromStorage, saveShipmentsToStorage } from '../services/shipmentData';
import { toast } from 'react-toastify';

const ShipmentContext = createContext();

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const data = getShipmentsFromStorage();
    setShipments(data);
  }, []);

  const saveState = (newShipments) => {
    setShipments(newShipments);
    saveShipmentsToStorage(newShipments);
  };

  // Helper to generate dynamic timeline nodes based on status
  const generateTimelineForStatus = (status, existingTimeline = []) => {
    const steps = ['Shipment Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (status === 'Cancelled' || status === 'Failed Delivery') {
      return [
        { status: 'Shipment Created', time: 'Aug 29, 2026', completed: true },
        { status: 'Picked Up', time: 'Aug 30, 2026', completed: true },
        { status, time: nowStr, completed: true, active: true }
      ];
    }

    let activeIndex = -1;
    if (status === 'Pending') activeIndex = 0;
    else if (status === 'Picked Up') activeIndex = 1;
    else if (status === 'In Transit') activeIndex = 2;
    else if (status === 'Out for Delivery') activeIndex = 3;
    else if (status === 'Delivered') activeIndex = 4;

    return steps.map((stepName, idx) => {
      const isCompleted = idx <= activeIndex;
      const isActive = idx === activeIndex;
      const matchedExisting = existingTimeline.find((t) => t.status === stepName);

      return {
        status: stepName,
        time: isActive
          ? nowStr
          : matchedExisting && matchedExisting.time !== 'Pending'
          ? matchedExisting.time
          : isCompleted
          ? 'Completed'
          : 'Pending',
        completed: isCompleted,
        active: isActive
      };
    });
  };

  const updateShipmentStatus = (id, newStatus) => {
    let updatedTrackingNo = '';
    const updated = shipments.map((item) => {
      if (item.id === id) {
        updatedTrackingNo = item.trackingNo;
        return {
          ...item,
          status: newStatus,
          timeline: generateTimelineForStatus(newStatus, item.timeline)
        };
      }
      return item;
    });

    saveState(updated);
    toast.success(`${updatedTrackingNo} status updated to: ${newStatus}`);
  };

  // Bulk Status Update for Checkbox selection
  const bulkUpdateStatus = (ids, newStatus) => {
    const updated = shipments.map((item) => {
      if (ids.includes(item.id)) {
        return {
          ...item,
          status: newStatus,
          timeline: generateTimelineForStatus(newStatus, item.timeline)
        };
      }
      return item;
    });
    saveState(updated);
    toast.success(`Updated status for ${ids.length} selected shipment(s) to "${newStatus}"`);
  };

  // Bulk Delete for Checkbox selection
  const bulkDeleteShipments = (ids) => {
    const updated = shipments.filter((s) => !ids.includes(s.id));
    saveState(updated);
    toast.warn(`Deleted ${ids.length} selected shipment(s)`);
  };

  const addShipment = (newShipmentData) => {
    const id = Date.now().toString();
    const trackingNo = 'TRK' + Math.floor(100000000000 + Math.random() * 900000000000);
    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const fullShipment = {
      ...newShipmentData,
      id,
      trackingNo,
      status: newShipmentData.status || 'Pending',
      shippingDate: newShipmentData.shippingDate || nowStr,
      expectedDelivery: newShipmentData.expectedDelivery || 'Expected in 3 days',
      weight: newShipmentData.weight || '1.0 kg',
      timeline: generateTimelineForStatus(newShipmentData.status || 'Pending', [])
    };

    const updated = [fullShipment, ...shipments];
    saveState(updated);
    toast.success(`Shipment created successfully! Tracking: ${trackingNo}`);
  };

  const updateShipment = (id, updatedFields) => {
    const updated = shipments.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...updatedFields };
        if (updatedFields.status && updatedFields.status !== item.status) {
          merged.timeline = generateTimelineForStatus(updatedFields.status, item.timeline);
        }
        return merged;
      }
      return item;
    });
    saveState(updated);
    toast.info(`Shipment details updated`);
  };

  const deleteShipment = (id) => {
    const item = shipments.find((s) => s.id === id);
    const updated = shipments.filter((s) => s.id !== id);
    saveState(updated);
    toast.warn(`Shipment ${item ? item.trackingNo : id} deleted`);
  };

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        addShipment,
        updateShipment,
        deleteShipment,
        updateShipmentStatus,
        bulkUpdateStatus,
        bulkDeleteShipments
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipments = () => useContext(ShipmentContext);
