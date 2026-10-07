import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getShipmentsFromStorage, saveShipmentsToStorage } from '../services/shipmentData';
import { logActivity } from '../services/activityLogger';

const ShipmentContext = createContext();

export const generateTimelineForStatus = (status, existingTimeline = []) => {
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
        ? (matchedExisting?.time && matchedExisting.time !== 'Pending' ? matchedExisting.time : nowStr)
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

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const data = getShipmentsFromStorage();
    const sanitized = data.map((item) => ({
      ...item,
      timeline: generateTimelineForStatus(item.status || 'Pending', item.timeline || [])
    }));
    setShipments(sanitized);
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
    let updatedItem = null;
    const remaining = [];

    shipments.forEach((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          status: newStatus,
          timeline: generateTimelineForStatus(newStatus, item.timeline)
        };
      } else {
        remaining.push(item);
      }
    });

    if (updatedItem) {
      const updated = [updatedItem, ...remaining];
      saveState(updated);
      logActivity(
        `Status updated to ${newStatus}`,
        `${updatedItem.trackingNo} - ${updatedItem.sender}`,
        newStatus === 'Delivered' ? 'shipment_deliver' : 'shipment_update'
      );
      toast.success(`${updatedItem.trackingNo} status updated to: ${newStatus}`);
    }
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
    logActivity(`Bulk status updated to ${newStatus}`, `${ids.length} selected shipment(s)`, 'shipment_update');
    toast.success(`Updated status for ${ids.length} selected shipment(s) to "${newStatus}"`);
  };

  // Bulk Delete for Checkbox selection
  const bulkDeleteShipments = (ids) => {
    const updated = shipments.filter((s) => !ids.includes(s.id));
    saveState(updated);
    logActivity('Bulk shipments deleted', `${ids.length} selected shipment(s)`, 'shipment_delete');
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
    logActivity(
      'New shipment created',
      `${fullShipment.trackingNo} - ${fullShipment.sender} to ${fullShipment.receiver}`,
      'shipment_create'
    );
    toast.success(`Shipment created successfully! Tracking: ${trackingNo}`);
  };

  const updateShipment = (id, updatedFields) => {
    let updatedItem = null;
    const remaining = [];

    shipments.forEach((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...updatedFields };
        if (updatedFields.status && updatedFields.status !== item.status) {
          updatedItem.timeline = generateTimelineForStatus(updatedFields.status, item.timeline);
        }
      } else {
        remaining.push(item);
      }
    });

    if (updatedItem) {
      const updated = [updatedItem, ...remaining];
      saveState(updated);
      logActivity('Shipment details updated', `${updatedItem.trackingNo} - ${updatedItem.sender}`, 'shipment_update');
      toast.info(`Shipment details updated`);
    }
  };

  const deleteShipment = (id) => {
    const item = shipments.find((s) => s.id === id);
    const updated = shipments.filter((s) => s.id !== id);
    saveState(updated);
    logActivity('Shipment deleted', `${item ? item.trackingNo : id}`, 'shipment_delete');
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
