// Centralized Real-time System Activity Logger

const STORAGE_KEY = 'deliverly_activities';

const initialActivities = [
  {
    id: 'act-1',
    title: 'New shipment created',
    subtitle: 'TRK20250829001 - John Doe to Sarah Wilson',
    time: 'Just now',
    type: 'shipment_create'
  },
  {
    id: 'act-2',
    title: 'Status updated to In Transit',
    subtitle: 'TRK20250829002 - Mike Johnson',
    time: '12 mins ago',
    type: 'shipment_update'
  },
  {
    id: 'act-3',
    title: 'Live API customers synced',
    subtitle: 'DummyJSON Users API (30 accounts)',
    time: '25 mins ago',
    type: 'customer_sync'
  },
  {
    id: 'act-4',
    title: 'Parcel delivered successfully',
    subtitle: 'TRK20250829003 - Acme Corp',
    time: '1 hour ago',
    type: 'shipment_deliver'
  },
  {
    id: 'act-5',
    title: 'Customer account updated',
    subtitle: 'Terry Medhurst - Set to Plus Member',
    time: '2 hours ago',
    type: 'customer_update'
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

  const newEntry = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    subtitle,
    time: timeStr,
    type
  };

  const updated = [newEntry, ...current].slice(0, 20); // Keep 20 recent logs
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Notify active listeners for real-time reactivity
  window.dispatchEvent(new CustomEvent('deliverly_activity_log', { detail: updated }));
  return updated;
};
