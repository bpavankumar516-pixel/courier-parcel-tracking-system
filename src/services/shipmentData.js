// Centralized Shipment Data Service with LocalStorage persistence

const STORAGE_KEY = 'deliverly_shipments';

export const initialShipments = [
  {
    id: '1',
    trackingNo: 'TRK20250829001',
    sender: 'John Doe',
    senderEmail: 'john@example.com',
    senderPhone: '+1 555-0192',
    receiver: 'Sarah Wilson',
    receiverEmail: 'sarah@example.com',
    receiverPhone: '+1 555-0143',
    pickupAddress: '123 Main St, New York, NY 10001, USA',
    deliveryAddress: '456 Market St, San Francisco, CA 94105, USA',
    type: 'Documents',
    weight: '0.5 kg',
    shippingDate: 'Aug 29, 2026',
    expectedDelivery: 'Sep 02, 2026',
    status: 'In Transit',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 29, 2026 10:30 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 30, 2026 09:15 AM', completed: true },
      { status: 'In Transit', time: 'Aug 31, 2026 02:45 PM', completed: true, active: true },
      { status: 'Expected Delivery', time: 'Sep 02, 2026', completed: false }
    ]
  },
  {
    id: '2',
    trackingNo: 'TRK20250829002',
    sender: 'Mike Johnson',
    senderEmail: 'mike.j@example.com',
    senderPhone: '+1 555-0188',
    receiver: 'Emily Davis',
    receiverEmail: 'emily.d@example.com',
    receiverPhone: '+1 555-0177',
    pickupAddress: '789 Broadway, Boston, MA 02108, USA',
    deliveryAddress: '321 Ocean Ave, Los Angeles, CA 90001, USA',
    type: 'Electronics',
    weight: '2.3 kg',
    shippingDate: 'Aug 28, 2026',
    expectedDelivery: 'Sep 01, 2026',
    status: 'Picked Up',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 28, 2026 11:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 29, 2026 08:30 AM', completed: true, active: true },
      { status: 'In Transit', time: 'Pending', completed: false },
      { status: 'Expected Delivery', time: 'Sep 01, 2026', completed: false }
    ]
  },
  {
    id: '3',
    trackingNo: 'TRK20250829003',
    sender: 'Acme Corp',
    senderEmail: 'orders@acme.com',
    senderPhone: '+1 555-0122',
    receiver: 'Robert Smith',
    receiverEmail: 'robert.s@example.com',
    receiverPhone: '+1 555-0133',
    pickupAddress: '55 Commerce Way, Chicago, IL 60601, USA',
    deliveryAddress: '888 Pine St, Seattle, WA 98101, USA',
    type: 'Clothing',
    weight: '1.2 kg',
    shippingDate: 'Aug 27, 2026',
    expectedDelivery: 'Aug 31, 2026',
    status: 'Delivered',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 27, 2026 09:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 27, 2026 02:00 PM', completed: true },
      { status: 'In Transit', time: 'Aug 28, 2026 08:00 AM', completed: true },
      { status: 'Delivered', time: 'Aug 31, 2026 04:15 PM', completed: true, active: true }
    ]
  },
  {
    id: '4',
    trackingNo: 'TRK20250829004',
    sender: 'David Brown',
    senderEmail: 'david.b@example.com',
    senderPhone: '+1 555-0144',
    receiver: 'Lisa Anderson',
    receiverEmail: 'lisa.a@example.com',
    receiverPhone: '+1 555-0155',
    pickupAddress: '101 Maple Rd, Houston, TX 77001, USA',
    deliveryAddress: '202 Oak St, Denver, CO 80201, USA',
    type: 'Fragile',
    weight: '4.8 kg',
    shippingDate: 'Aug 26, 2026',
    expectedDelivery: 'Aug 30, 2026',
    status: 'Out for Delivery',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 26, 2026 08:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 26, 2026 01:30 PM', completed: true },
      { status: 'In Transit', time: 'Aug 27, 2026 10:00 AM', completed: true },
      { status: 'Out for Delivery', time: 'Aug 30, 2026 07:30 AM', completed: true, active: true }
    ]
  },
  {
    id: '5',
    trackingNo: 'TRK20250829005',
    sender: 'Sarah Wilson',
    senderEmail: 'sarah.w@example.com',
    senderPhone: '+1 555-0166',
    receiver: 'Jessica Taylor',
    receiverEmail: 'jessica.t@example.com',
    receiverPhone: '+1 555-0177',
    pickupAddress: '505 Cedar St, Seattle, WA 98101, USA',
    deliveryAddress: '606 Birch Ave, Portland, OR 97201, USA',
    type: 'Documents',
    weight: '0.3 kg',
    shippingDate: 'Aug 29, 2026',
    expectedDelivery: 'Sep 03, 2026',
    status: 'Pending',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 29, 2026 03:00 PM', completed: true, active: true },
      { status: 'Picked Up', time: 'Pending', completed: false },
      { status: 'In Transit', time: 'Pending', completed: false },
      { status: 'Expected Delivery', time: 'Sep 03, 2026', completed: false }
    ]
  },
  {
    id: '6',
    trackingNo: 'TRK20250829006',
    sender: 'Global Tech Ltd',
    senderEmail: 'logistics@globaltech.com',
    senderPhone: '+1 555-0199',
    receiver: 'Daniel Wilson',
    receiverEmail: 'daniel.w@example.com',
    receiverPhone: '+1 555-0211',
    pickupAddress: '12 Tech Park, San Jose, CA 95110, USA',
    deliveryAddress: '123 Commerce St, Dallas, TX 75201, USA',
    type: 'Electronics',
    weight: '7.2 kg',
    shippingDate: 'Aug 25, 2026',
    expectedDelivery: 'Aug 29, 2026',
    status: 'Failed Delivery',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 25, 2026 09:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 25, 2026 03:00 PM', completed: true },
      { status: 'In Transit', time: 'Aug 26, 2026 11:00 AM', completed: true },
      { status: 'Failed Delivery', time: 'Aug 29, 2026 05:30 PM', completed: true, active: true }
    ]
  },
  {
    id: '7',
    trackingNo: 'TRK20250829007',
    sender: 'Amanda Clark',
    senderEmail: 'amanda.c@example.com',
    senderPhone: '+1 555-0322',
    receiver: 'Kevin Martin',
    receiverEmail: 'kevin.m@example.com',
    receiverPhone: '+1 555-0333',
    pickupAddress: '400 Peachtree St, Atlanta, GA 30308, USA',
    deliveryAddress: '999 Market St, San Francisco, CA 94103, USA',
    type: 'Clothing',
    weight: '1.1 kg',
    shippingDate: 'Aug 24, 2026',
    expectedDelivery: 'Aug 28, 2026',
    status: 'Delivered',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 24, 2026 10:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 24, 2026 04:00 PM', completed: true },
      { status: 'In Transit', time: 'Aug 26, 2026 09:00 AM', completed: true },
      { status: 'Delivered', time: 'Aug 28, 2026 02:10 PM', completed: true, active: true }
    ]
  },
  {
    id: '8',
    trackingNo: 'TRK20250829008',
    sender: 'James Taylor',
    senderEmail: 'james.t@example.com',
    senderPhone: '+1 555-0444',
    receiver: 'Rachel Green',
    receiverEmail: 'rachel.g@example.com',
    receiverPhone: '+1 555-0555',
    pickupAddress: '777 Sunset Blvd, Los Angeles, CA 90028, USA',
    deliveryAddress: '888 Fifth Ave, New York, NY 10021, USA',
    type: 'Electronics',
    weight: '3.4 kg',
    shippingDate: 'Aug 29, 2026',
    expectedDelivery: 'Sep 04, 2026',
    status: 'In Transit',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 29, 2026 11:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 29, 2026 04:30 PM', completed: true },
      { status: 'In Transit', time: 'Aug 30, 2026 10:15 AM', completed: true, active: true },
      { status: 'Expected Delivery', time: 'Sep 04, 2026', completed: false }
    ]
  },
  {
    id: '9',
    trackingNo: 'TRK20250829009',
    sender: 'Patricia Moore',
    senderEmail: 'patricia.m@example.com',
    senderPhone: '+1 555-0666',
    receiver: 'Thomas Jackson',
    receiverEmail: 'thomas.j@example.com',
    receiverPhone: '+1 555-0777',
    pickupAddress: '123 Pine Tree Ln, Miami, FL 33101, USA',
    deliveryAddress: '456 Birch Wood Rd, Chicago, IL 60602, USA',
    type: 'Fragile',
    weight: '2.8 kg',
    shippingDate: 'Aug 28, 2026',
    expectedDelivery: 'Sep 01, 2026',
    status: 'Out for Delivery',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 28, 2026 09:30 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 28, 2026 03:15 PM', completed: true },
      { status: 'In Transit', time: 'Aug 29, 2026 08:00 AM', completed: true },
      { status: 'Out for Delivery', time: 'Aug 31, 2026 08:00 AM', completed: true, active: true }
    ]
  },
  {
    id: '10',
    trackingNo: 'TRK20250829010',
    sender: 'Christopher White',
    senderEmail: 'chris.w@example.com',
    senderPhone: '+1 555-0888',
    receiver: 'Barbara Harris',
    receiverEmail: 'barbara.h@example.com',
    receiverPhone: '+1 555-0999',
    pickupAddress: '999 Willow Creek Dr, Austin, TX 78701, USA',
    deliveryAddress: '111 Magnolia Ave, Orlando, FL 32801, USA',
    type: 'Documents',
    weight: '0.4 kg',
    shippingDate: 'Aug 27, 2026',
    expectedDelivery: 'Aug 30, 2026',
    status: 'Delivered',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 27, 2026 08:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 27, 2026 01:00 PM', completed: true },
      { status: 'In Transit', time: 'Aug 28, 2026 09:00 AM', completed: true },
      { status: 'Delivered', time: 'Aug 30, 2026 11:45 AM', completed: true, active: true }
    ]
  },
  {
    id: '11',
    trackingNo: 'TRK20250829011',
    sender: 'Sophia Martinez',
    senderEmail: 'sophia.m@example.com',
    senderPhone: '+1 555-1122',
    receiver: 'William Taylor',
    receiverEmail: 'william.t@example.com',
    receiverPhone: '+1 555-1133',
    pickupAddress: '300 Lake Shore Dr, Chicago, IL 60611, USA',
    deliveryAddress: '700 Ocean Blvd, Miami, FL 33139, USA',
    type: 'Fragile',
    weight: '3.2 kg',
    shippingDate: 'Aug 30, 2026',
    expectedDelivery: 'Sep 04, 2026',
    status: 'In Transit',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 30, 2026 09:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 30, 2026 02:15 PM', completed: true },
      { status: 'In Transit', time: 'Aug 31, 2026 11:30 AM', completed: true, active: true },
      { status: 'Expected Delivery', time: 'Sep 04, 2026', completed: false }
    ]
  },
  {
    id: '12',
    trackingNo: 'TRK20250829012',
    sender: 'Alexander Wright',
    senderEmail: 'alex.w@example.com',
    senderPhone: '+1 555-2233',
    receiver: 'Olivia King',
    receiverEmail: 'olivia.k@example.com',
    receiverPhone: '+1 555-2244',
    pickupAddress: '500 Embarcadero, San Francisco, CA 94105, USA',
    deliveryAddress: '400 Pike St, Seattle, WA 98101, USA',
    type: 'Electronics',
    weight: '1.8 kg',
    shippingDate: 'Aug 29, 2026',
    expectedDelivery: 'Sep 02, 2026',
    status: 'Out for Delivery',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 29, 2026 08:30 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 29, 2026 01:00 PM', completed: true },
      { status: 'In Transit', time: 'Aug 30, 2026 09:45 AM', completed: true },
      { status: 'Out for Delivery', time: 'Sep 01, 2026 07:15 AM', completed: true, active: true }
    ]
  },
  {
    id: '13',
    trackingNo: 'TRK20250829013',
    sender: 'Ethan Scott',
    senderEmail: 'ethan.s@example.com',
    senderPhone: '+1 555-3344',
    receiver: 'Ava Green',
    receiverEmail: 'ava.g@example.com',
    receiverPhone: '+1 555-3355',
    pickupAddress: '150 Boylston St, Boston, MA 02116, USA',
    deliveryAddress: '250 Peachtree Rd, Atlanta, GA 30305, USA',
    type: 'Documents',
    weight: '0.4 kg',
    shippingDate: 'Aug 26, 2026',
    expectedDelivery: 'Aug 29, 2026',
    status: 'Delivered',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 26, 2026 10:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 26, 2026 03:30 PM', completed: true },
      { status: 'In Transit', time: 'Aug 27, 2026 08:15 AM', completed: true },
      { status: 'Delivered', time: 'Aug 29, 2026 01:20 PM', completed: true, active: true }
    ]
  },
  {
    id: '14',
    trackingNo: 'TRK20250829014',
    sender: 'Logistics Direct Hub',
    senderEmail: 'hub@logisticsdirect.com',
    senderPhone: '+1 555-4455',
    receiver: 'Liam Adams',
    receiverEmail: 'liam.a@example.com',
    receiverPhone: '+1 555-4466',
    pickupAddress: '800 Elm St, Dallas, TX 75202, USA',
    deliveryAddress: '900 Main St, Houston, TX 77002, USA',
    type: 'General',
    weight: '5.0 kg',
    shippingDate: 'Aug 30, 2026',
    expectedDelivery: 'Sep 03, 2026',
    status: 'Picked Up',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 30, 2026 11:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 31, 2026 09:30 AM', completed: true, active: true },
      { status: 'In Transit', time: 'Pending', completed: false },
      { status: 'Expected Delivery', time: 'Sep 03, 2026', completed: false }
    ]
  },
  {
    id: '15',
    trackingNo: 'TRK20250829015',
    sender: 'Mia Baker',
    senderEmail: 'mia.b@example.com',
    senderPhone: '+1 555-5566',
    receiver: 'Benjamin Nelson',
    receiverEmail: 'ben.n@example.com',
    receiverPhone: '+1 555-5577',
    pickupAddress: '100 Camelback Rd, Phoenix, AZ 85012, USA',
    deliveryAddress: '600 17th St, Denver, CO 80202, USA',
    type: 'Clothing',
    weight: '2.1 kg',
    shippingDate: 'Aug 31, 2026',
    expectedDelivery: 'Sep 05, 2026',
    status: 'Pending',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 31, 2026 02:00 PM', completed: true, active: true },
      { status: 'Picked Up', time: 'Pending', completed: false },
      { status: 'In Transit', time: 'Pending', completed: false },
      { status: 'Expected Delivery', time: 'Sep 05, 2026', completed: false }
    ]
  },
  {
    id: '16',
    trackingNo: 'TRK20250829016',
    sender: 'Charlotte Carter',
    senderEmail: 'charlotte.c@example.com',
    senderPhone: '+1 555-6677',
    receiver: 'Lucas Mitchell',
    receiverEmail: 'lucas.m@example.com',
    receiverPhone: '+1 555-6688',
    pickupAddress: '450 Harbor Dr, San Diego, CA 92101, USA',
    deliveryAddress: '350 Las Vegas Blvd, Las Vegas, NV 89109, USA',
    type: 'Electronics',
    weight: '4.5 kg',
    shippingDate: 'Aug 30, 2026',
    expectedDelivery: 'Sep 03, 2026',
    status: 'In Transit',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 30, 2026 10:15 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 30, 2026 04:00 PM', completed: true },
      { status: 'In Transit', time: 'Aug 31, 2026 01:10 PM', completed: true, active: true },
      { status: 'Expected Delivery', time: 'Sep 03, 2026', completed: false }
    ]
  },
  {
    id: '17',
    trackingNo: 'TRK20250829017',
    sender: 'Amelia Perez',
    senderEmail: 'amelia.p@example.com',
    senderPhone: '+1 555-7788',
    receiver: 'Henry Roberts',
    receiverEmail: 'henry.r@example.com',
    receiverPhone: '+1 555-7799',
    pickupAddress: '200 Market St, Philadelphia, PA 19106, USA',
    deliveryAddress: '100 Pratt St, Baltimore, MD 21201, USA',
    type: 'Documents',
    weight: '0.2 kg',
    shippingDate: 'Aug 27, 2026',
    expectedDelivery: 'Aug 30, 2026',
    status: 'Delivered',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 27, 2026 09:30 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 27, 2026 02:45 PM', completed: true },
      { status: 'In Transit', time: 'Aug 28, 2026 08:30 AM', completed: true },
      { status: 'Delivered', time: 'Aug 30, 2026 03:00 PM', completed: true, active: true }
    ]
  },
  {
    id: '18',
    trackingNo: 'TRK20250829018',
    sender: 'Oliver Evans',
    senderEmail: 'oliver.e@example.com',
    senderPhone: '+1 555-8899',
    receiver: 'Evelyn Turner',
    receiverEmail: 'evelyn.t@example.com',
    receiverPhone: '+1 555-8800',
    pickupAddress: '500 Woodward Ave, Detroit, MI 48226, USA',
    deliveryAddress: '800 Nicollet Mall, Minneapolis, MN 55402, USA',
    type: 'Fragile',
    weight: '6.0 kg',
    shippingDate: 'Aug 28, 2026',
    expectedDelivery: 'Sep 01, 2026',
    status: 'Failed Delivery',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 28, 2026 08:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 28, 2026 01:15 PM', completed: true },
      { status: 'In Transit', time: 'Aug 29, 2026 10:00 AM', completed: true },
      { status: 'Failed Delivery', time: 'Sep 01, 2026 05:45 PM', completed: true, active: true }
    ]
  },
  {
    id: '19',
    trackingNo: 'TRK20250829019',
    sender: 'Harper Phillips',
    senderEmail: 'harper.p@example.com',
    senderPhone: '+1 555-9900',
    receiver: 'Sebastian Campbell',
    receiverEmail: 'sebastian.c@example.com',
    receiverPhone: '+1 555-9911',
    pickupAddress: '1600 Pennsylvania Ave, Washington, DC 20500, USA',
    deliveryAddress: '350 Fifth Ave, New York, NY 10118, USA',
    type: 'Clothing',
    weight: '1.5 kg',
    shippingDate: 'Aug 31, 2026',
    expectedDelivery: 'Sep 04, 2026',
    status: 'Picked Up',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 31, 2026 09:00 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 31, 2026 03:30 PM', completed: true, active: true },
      { status: 'In Transit', time: 'Pending', completed: false },
      { status: 'Expected Delivery', time: 'Sep 04, 2026', completed: false }
    ]
  },
  {
    id: '20',
    trackingNo: 'TRK20250829020',
    sender: 'Jameson Parker',
    senderEmail: 'jameson.p@example.com',
    senderPhone: '+1 555-0011',
    receiver: 'Victoria Stewart',
    receiverEmail: 'victoria.s@example.com',
    receiverPhone: '+1 555-0022',
    pickupAddress: '200 Beale St, Memphis, TN 38103, USA',
    deliveryAddress: '500 Broadway, Nashville, TN 37203, USA',
    type: 'General',
    weight: '8.4 kg',
    shippingDate: 'Aug 30, 2026',
    expectedDelivery: 'Sep 02, 2026',
    status: 'Out for Delivery',
    timeline: [
      { status: 'Shipment Created', time: 'Aug 30, 2026 07:30 AM', completed: true },
      { status: 'Picked Up', time: 'Aug 30, 2026 12:00 PM', completed: true },
      { status: 'In Transit', time: 'Aug 31, 2026 08:30 AM', completed: true },
      { status: 'Out for Delivery', time: 'Sep 02, 2026 07:00 AM', completed: true, active: true }
    ]
  }
];

export const getShipmentsFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialShipments));
    return initialShipments;
  }
  try {
    const parsed = JSON.parse(data);
    // If stored array has fewer shipments than initial mock, merge or refresh
    if (parsed.length < initialShipments.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialShipments));
      return initialShipments;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse shipments from localStorage', e);
    return initialShipments;
  }
};

export const saveShipmentsToStorage = (shipments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
};
