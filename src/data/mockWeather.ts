import type { WeatherData, Alert, DashboardMetrics } from '@/types';

export const MOCK_WEATHER: WeatherData = {
  current: {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    icon: 'cloud-sun',
    uvIndex: 7,
  },
  forecast: [
    { date: 'Mon', high: 30, low: 22, humidity: 60, precipitation: 10, condition: 'Sunny', icon: 'sun' },
    { date: 'Tue', high: 29, low: 21, humidity: 65, precipitation: 20, condition: 'Partly Cloudy', icon: 'cloud-sun' },
    { date: 'Wed', high: 27, low: 20, humidity: 75, precipitation: 60, condition: 'Rainy', icon: 'cloud-rain' },
    { date: 'Thu', high: 25, low: 19, humidity: 80, precipitation: 45, condition: 'Showers', icon: 'cloud-drizzle' },
    { date: 'Fri', high: 28, low: 21, humidity: 55, precipitation: 5, condition: 'Sunny', icon: 'sun' },
    { date: 'Sat', high: 31, low: 23, humidity: 50, precipitation: 0, condition: 'Clear', icon: 'sun' },
    { date: 'Sun', high: 30, low: 22, humidity: 58, precipitation: 15, condition: 'Partly Cloudy', icon: 'cloud-sun' },
  ],
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    farmId: 'farm-1',
    type: 'sensor',
    severity: 'critical',
    title: 'Soil Moisture Critical',
    message: 'Soil moisture sensor in Field B reading 82% — exceeds safe threshold of 70%. Risk of root rot.',
    timestamp: new Date(Date.now() - 300000),
    isRead: false,
    actionUrl: '/sensors',
  },
  {
    id: 'alert-2',
    farmId: 'farm-1',
    type: 'disease',
    severity: 'warning',
    title: 'Early Blight Risk Elevated',
    message: 'AI model predicts 72% chance of Early Blight outbreak based on current humidity and temperature patterns.',
    timestamp: new Date(Date.now() - 1800000),
    isRead: false,
    actionUrl: '/scanner',
  },
  {
    id: 'alert-3',
    farmId: 'farm-1',
    type: 'weather',
    severity: 'warning',
    title: 'Heavy Rain Forecast',
    message: 'Expected 60mm rainfall on Wednesday. Consider delaying fertilizer application and ensuring drainage.',
    timestamp: new Date(Date.now() - 3600000),
    isRead: true,
    actionUrl: '/dashboard',
  },
  {
    id: 'alert-4',
    farmId: 'farm-1',
    type: 'chemical',
    severity: 'info',
    title: 'Fungicide Schedule Reminder',
    message: 'Preventive chlorothalonil application is due for Field A tomato crop. Schedule within 48 hours.',
    timestamp: new Date(Date.now() - 7200000),
    isRead: true,
    actionUrl: '/chemicals',
  },
  {
    id: 'alert-5',
    farmId: 'farm-1',
    type: 'sensor',
    severity: 'warning',
    title: 'Nitrogen Levels High',
    message: 'Nitrogen reading at 320 mg/kg in Field C — 60% above optimal. Reduce next fertilizer dose.',
    timestamp: new Date(Date.now() - 10800000),
    isRead: true,
    actionUrl: '/sensors',
  },
  {
    id: 'alert-6',
    farmId: 'farm-1',
    type: 'system',
    severity: 'info',
    title: 'Weekly Sustainability Report',
    message: 'Your farm sustainability score improved by 3 points this week. Water usage down 12%.',
    timestamp: new Date(Date.now() - 14400000),
    isRead: true,
    actionUrl: '/dashboard',
  },
];

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  healthScore: 78,
  sustainabilityIndex: 72,
  diseaseRisk: 35,
  waterUsage: 2450,
  yieldPrediction: 85,
  activeAlerts: 3,
  totalScans: 47,
};

export function generateYieldData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month) => ({
    month,
    predicted: Math.floor(60 + Math.random() * 40),
    actual: Math.floor(55 + Math.random() * 35),
    target: 80,
  }));
}

export function generateWaterUsageData() {
  return Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    usage: Math.floor(150 + Math.random() * 100),
    optimal: 180,
    rainfall: Math.floor(Math.random() * 40),
  }));
}
