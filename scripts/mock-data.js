// /scripts/mock-data.js
// Mock data for shipments, vehicles, and drivers

export const shipments = [
  {
    id: 'SHP001',
    trackingId: 'LC360-2025-001',
    sender: { name: 'ABC Traders', city: 'Mumbai', address: '123 MG Road' },
    receiver: { name: 'XYZ Stores', city: 'Pune', address: '456 FC Road' },
    assignedDriver: 'DRV001',
    status: 'in-transit',
    estimatedArrival: '2025-11-09T14:30:00Z',
    weight: 250,
    priority: 'express',
    routeCoords: [
      { x: 150, y: 450 }, // Mumbai
      { x: 200, y: 430 },
      { x: 250, y: 410 },
      { x: 280, y: 400 }  // Pune
    ]
  },
  {
    id: 'SHP002',
    trackingId: 'LC360-2025-002',
    sender: { name: 'Tech Solutions', city: 'Delhi', address: '789 CP' },
    receiver: { name: 'Metro Mart', city: 'Bangalore', address: '321 MG Road' },
    assignedDriver: 'DRV002',
    status: 'out-for-delivery',
    estimatedArrival: '2025-11-09T16:00:00Z',
    weight: 180,
    priority: 'standard',
    routeCoords: [
      { x: 500, y: 120 }, // Delhi
      { x: 480, y: 200 },
      { x: 450, y: 300 },
      { x: 420, y: 400 },
      { x: 380, y: 500 }  // Bangalore
    ]
  },
  {
    id: 'SHP003',
    trackingId: 'LC360-2025-003',
    sender: { name: 'Fashion Hub', city: 'Mumbai', address: '555 SV Road' },
    receiver: { name: 'Style Store', city: 'Delhi', address: '777 Connaught Place' },
    assignedDriver: 'DRV003',
    status: 'in-transit',
    estimatedArrival: '2025-11-09T18:00:00Z',
    weight: 120,
    priority: 'standard',
    routeCoords: [
      { x: 150, y: 450 }, // Mumbai
      { x: 200, y: 400 },
      { x: 300, y: 300 },
      { x: 400, y: 200 },
      { x: 500, y: 120 }  // Delhi
    ]
  }
];

export const vehicles = [
  {
    id: 'VEH001',
    registrationNumber: 'MH-01-AB-1234',
    type: 'truck',
    fuelEfficiency: 12.5,
    lastMaintenance: '2025-10-15',
    ecoScore: 8.2,
    currentLocation: { lat: 19.0760, lon: 72.8777 }
  },
  {
    id: 'VEH002',
    registrationNumber: 'DL-02-CD-5678',
    type: 'van',
    fuelEfficiency: 15.3,
    lastMaintenance: '2025-10-20',
    ecoScore: 8.8,
    currentLocation: { lat: 28.7041, lon: 77.1025 }
  },
  {
    id: 'VEH003',
    registrationNumber: 'KA-03-EF-9012',
    type: 'truck',
    fuelEfficiency: 11.8,
    lastMaintenance: '2025-10-10',
    ecoScore: 7.9,
    currentLocation: { lat: 12.9716, lon: 77.5946 }
  }
];

export const drivers = [
  {
    id: 'DRV001',
    name: 'Rajesh Kumar',
    rating: 4.8,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    onTimePercent: 96.5,
    totalDeliveries: 1248,
    earnings: 125000,
    vehicleAssigned: 'VEH001',
    ecoScore: 8.2
  },
  {
    id: 'DRV002',
    name: 'Priya Sharma',
    rating: 4.9,
    walletAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFF958023239c6A063',
    onTimePercent: 98.2,
    totalDeliveries: 1456,
    earnings: 145000,
    vehicleAssigned: 'VEH002',
    ecoScore: 8.8
  },
  {
    id: 'DRV003',
    name: 'Mohammed Ali',
    rating: 4.7,
    walletAddress: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
    onTimePercent: 94.8,
    totalDeliveries: 1102,
    earnings: 110000,
    vehicleAssigned: 'VEH003',
    ecoScore: 7.9
  },
  {
    id: 'DRV004',
    name: 'Sunita Patel',
    rating: 4.9,
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    onTimePercent: 97.5,
    totalDeliveries: 1389,
    earnings: 138000,
    ecoScore: 8.5
  },
  {
    id: 'DRV005',
    name: 'Arjun Singh',
    rating: 4.6,
    walletAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    onTimePercent: 93.2,
    totalDeliveries: 987,
    earnings: 98000,
    ecoScore: 7.6
  }
];

// Mock analytics data
export const analyticsData = {
  dailyDeliveries: [
    { date: '2025-10-26', count: 145 },
    { date: '2025-10-27', count: 152 },
    { date: '2025-10-28', count: 138 },
    { date: '2025-10-29', count: 161 },
    { date: '2025-10-30', count: 148 },
    { date: '2025-10-31', count: 155 },
    { date: '2025-11-01', count: 142 },
    { date: '2025-11-02', count: 158 },
    { date: '2025-11-03', count: 163 },
    { date: '2025-11-04', count: 149 },
    { date: '2025-11-05', count: 156 },
    { date: '2025-11-06', count: 168 },
    { date: '2025-11-07', count: 171 },
    { date: '2025-11-08', count: 165 }
  ],
  co2ByRoute: [
    { route: 'Mumbai-Pune', co2: 145, distance: 150 },
    { route: 'Delhi-Jaipur', co2: 268, distance: 280 },
    { route: 'Bangalore-Chennai', co2: 312, distance: 350 },
    { route: 'Mumbai-Ahmedabad', co2: 425, distance: 525 },
    { route: 'Delhi-Chandigarh', co2: 205, distance: 245 }
  ]
};