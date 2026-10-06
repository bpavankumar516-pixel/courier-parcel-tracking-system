import axios from 'axios';

const LOCAL_STORAGE_KEY = 'deliverly_customers';
const DUMMY_JSON_USERS_API = 'https://dummyjson.com/users?limit=30';

// Map DummyJSON API user object to Deliverly Customer schema
export const mapApiUserToCustomer = (user, index) => {
  const statuses = ['Active', 'Plus Member', 'Active', 'Inactive', 'Active', 'Plus Member', 'Active'];
  const status = statuses[index % statuses.length];
  const totalShipments = ((user.id * 5) % 28) + 3;
  const deliveredCount = Math.floor(totalShipments * 0.85);
  const pendingCount = totalShipments - deliveredCount;

  const avatarBgs = [
    'bg-emerald-100 text-emerald-800 border-emerald-300',
    'bg-blue-100 text-blue-800 border-blue-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-amber-100 text-amber-800 border-amber-300',
    'bg-teal-100 text-teal-800 border-teal-300',
    'bg-rose-100 text-rose-800 border-rose-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300'
  ];

  return {
    id: `CUST-${String(user.id).padStart(3, '0')}`,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    city: `${user.address?.city || 'New York'}, ${user.address?.stateCode || user.address?.state || 'NY'}`,
    address: `${user.address?.address || '123 Main St'}, ${user.address?.city || 'New York'}, ${user.address?.state || 'NY'} ${user.address?.postalCode || ''}`,
    status: status,
    totalShipments,
    deliveredCount,
    pendingCount,
    joinedDate: user.birthDate || '2024-01-15',
    notes: user.company ? `${user.company.title} at ${user.company.name}` : 'Registered Corporate Account',
    avatarUrl: user.image,
    avatarBg: avatarBgs[index % avatarBgs.length]
  };
};

// Fetch customers from DummyJSON Users API with LocalStorage caching & sync
export const fetchCustomersFromAPI = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { data: parsed, source: 'cache' };
        }
      } catch (e) {
        console.error('Failed to parse cached customer data', e);
      }
    }
  }

  // Fetch live user profiles from DummyJSON API
  const response = await axios.get(DUMMY_JSON_USERS_API);
  if (response.data && Array.isArray(response.data.users)) {
    const mapped = response.data.users.map((user, idx) => mapApiUserToCustomer(user, idx));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped));
    return { data: mapped, source: 'api' };
  }

  throw new Error('Invalid response structure from DummyJSON Users API');
};

export const getCustomersFromStorage = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveCustomersToStorage = (customers) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customers));
};
