// Initial mock data for Customers module
export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 234-5678',
    city: 'New York, NY',
    address: '742 Evergreen Terrace, New York, NY 10001',
    status: 'Active',
    totalShipments: 18,
    deliveredCount: 15,
    pendingCount: 3,
    joinedDate: '2024-01-15',
    notes: 'Prefers morning delivery. Frequent sender.',
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'CUST-002',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    phone: '+1 (555) 876-5432',
    city: 'Los Angeles, CA',
    address: '100 Sunset Blvd, Los Angeles, CA 90028',
    status: 'VIP',
    totalShipments: 34,
    deliveredCount: 31,
    pendingCount: 3,
    joinedDate: '2023-11-20',
    notes: 'Corporate client - Logistics Express Inc.',
    avatarBg: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'CUST-003',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 345-6789',
    city: 'Chicago, IL',
    address: '456 Michigan Ave, Chicago, IL 60611',
    status: 'Active',
    totalShipments: 12,
    deliveredCount: 10,
    pendingCount: 2,
    joinedDate: '2024-02-10',
    notes: 'Leave packages with front desk security.',
    avatarBg: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'CUST-004',
    name: 'David Brown',
    email: 'david.b@example.com',
    phone: '+1 (555) 901-2345',
    city: 'Houston, TX',
    address: '789 Main Street, Houston, TX 77002',
    status: 'Inactive',
    totalShipments: 5,
    deliveredCount: 5,
    pendingCount: 0,
    joinedDate: '2023-08-05',
    notes: 'Account currently inactive.',
    avatarBg: 'bg-gray-100 text-gray-700 border-gray-300'
  },
  {
    id: 'CUST-005',
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    phone: '+1 (555) 456-7890',
    city: 'Phoenix, AZ',
    address: '321 Camelback Rd, Phoenix, AZ 85016',
    status: 'VIP',
    totalShipments: 28,
    deliveredCount: 26,
    pendingCount: 2,
    joinedDate: '2023-09-12',
    notes: 'High volume sender. Priority handling required.',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'CUST-006',
    name: 'Robert Smith',
    email: 'robert.smith@example.com',
    phone: '+1 (555) 678-9012',
    city: 'Miami, FL',
    address: '555 Ocean Drive, Miami, FL 33139',
    status: 'Active',
    totalShipments: 14,
    deliveredCount: 12,
    pendingCount: 2,
    joinedDate: '2024-03-01',
    notes: 'Signature required upon delivery.',
    avatarBg: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  {
    id: 'CUST-007',
    name: 'Jessica Taylor',
    email: 'jessica.t@example.com',
    phone: '+1 (555) 789-0123',
    city: 'Seattle, WA',
    address: '888 Pine St, Seattle, WA 98101',
    status: 'Active',
    totalShipments: 21,
    deliveredCount: 19,
    pendingCount: 2,
    joinedDate: '2023-12-01',
    notes: 'Call before delivery.',
    avatarBg: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'CUST-008',
    name: 'Daniel Wilson',
    email: 'daniel.w@example.com',
    phone: '+1 (555) 890-1234',
    city: 'Dallas, TX',
    address: '123 Commerce St, Dallas, TX 75201',
    status: 'Active',
    totalShipments: 9,
    deliveredCount: 8,
    pendingCount: 1,
    joinedDate: '2024-01-22',
    notes: 'Standard delivery terms.',
    avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  {
    id: 'CUST-009',
    name: 'Amanda Clark',
    email: 'amanda.c@example.com',
    phone: '+1 (555) 901-3456',
    city: 'Atlanta, GA',
    address: '400 Peachtree St, Atlanta, GA 30308',
    status: 'VIP',
    totalShipments: 30,
    deliveredCount: 28,
    pendingCount: 2,
    joinedDate: '2023-10-18',
    notes: 'E-commerce partner account.',
    avatarBg: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'CUST-010',
    name: 'Kevin Martin',
    email: 'kevin.m@example.com',
    phone: '+1 (555) 012-3456',
    city: 'San Francisco, CA',
    address: '999 Market St, San Francisco, CA 94103',
    status: 'Active',
    totalShipments: 16,
    deliveredCount: 14,
    pendingCount: 2,
    joinedDate: '2024-02-18',
    notes: 'Tech startup account.',
    avatarBg: 'bg-sky-100 text-sky-800 border-sky-300'
  }
];

const LOCAL_STORAGE_KEY = 'deliverly_customers';

export const getCustomersFromStorage = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse customer data from localStorage', e);
    return INITIAL_CUSTOMERS;
  }
};

export const saveCustomersToStorage = (customers) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customers));
};
