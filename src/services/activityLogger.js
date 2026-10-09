// Centralized Real-time System Activity & Notification Logger

const STORAGE_KEY = 'deliverly_activities';

const initialActivities = [
  {
    id: 'act-1',
    title: 'New shipment created',
    subtitle: 'TRK20250829001 - John Doe to Sarah Wilson',
    time: 'Just now',
    timestamp: Date.now() - 60000,
    type: 'shipment_create',
    category: 'Shipment',
    trackingNo: 'TRK20250829001',
    unread: true
  },
  {
    id: 'act-2',
    title: 'Status updated to In Transit',
    subtitle: 'TRK20250829002 - Mike Johnson',
    time: '12 mins ago',
    timestamp: Date.now() - 720000,
    type: 'shipment_update',
    category: 'Shipment',
    trackingNo: 'TRK20250829002',
    unread: true
  },
  {
    id: 'act-3',
    title: 'Live API customers synced',
    subtitle: 'DummyJSON Users API (30 accounts)',
    time: '25 mins ago',
    timestamp: Date.now() - 1500000,
    type: 'customer_sync',
    category: 'System',
    unread: false
  },
  {
    id: 'act-4',
    title: 'Parcel delivered successfully',
    subtitle: 'TRK20250829003 - Acme Corp',
    time: '1 hour ago',
    timestamp: Date.now() - 3600000,
    type: 'shipment_deliver',
    category: 'Shipment',
    trackingNo: 'TRK20250829003',
    unread: false
  },
  {
    id: 'act-5',
    title: 'Customer account updated',
    subtitle: 'Terry Medhurst - Set to Plus Member',
    time: '2 hours ago',
    timestamp: Date.now() - 7200000,
    type: 'customer_update',
    category: 'Customer',
    unread: false
  }
];

export const getActivitiesFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialActivities));
    return initialActivities;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialActivities;
  } catch (e) {
    return initialActivities;
  }
};

export const logActivity = (title, subtitle, type = 'general') => {
  const current = getActivitiesFromStorage();
  const timeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Extract tracking number if present in title or subtitle
  const trkMatch = (title + ' ' + subtitle).match(/TRK\d+/i);
  const trackingNo = trkMatch ? trkMatch[0].toUpperCase() : null;

  // Derive Category
  let category = 'System';
  if (type.startsWith('shipment')) category = 'Shipment';
  else if (type.startsWith('customer')) category = 'Customer';
  else if (type.includes('alert') || type.includes('delete') || type.includes('exception')) category = 'Alert';

  const newEntry = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    subtitle,
    time: timeStr,
    timestamp: Date.now(),
    type,
    category,
    trackingNo,
    unread: true
  };

  const updated = [newEntry, ...current].slice(0, 50); // Keep up to 50 recent logs
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Dispatch global custom event for real-time UI updates
  window.dispatchEvent(new CustomEvent('deliverly_activity_log', { detail: updated }));
  return updated;
};

export const markActivityAsRead = (id) => {
  const current = getActivitiesFromStorage();
  const updated = current.map((item) =>
    item.id === id ? { ...item, unread: false } : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('deliverly_activity_log', { detail: updated }));
  return updated;
};

export const markAllActivitiesAsRead = () => {
  const current = getActivitiesFromStorage();
  const updated = current.map((item) => ({ ...item, unread: false }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('deliverly_activity_log', { detail: updated }));
  return updated;
};
