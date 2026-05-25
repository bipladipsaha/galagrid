// ============================================
// GaiaGrid — Core TypeScript Types
// ============================================

// --- Auth & Users ---
export type UserRole = 'farmer' | 'agronomist' | 'admin';

export interface GaiaUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  farmIds: string[];
  createdAt: Date;
  lastLogin: Date;
}

// --- Farms ---
export interface Farm {
  id: string;
  name: string;
  ownerId: string;
  location: { lat: number; lng: number; address: string };
  area: number; // hectares
  crops: string[];
  healthScore: number;
  sustainabilityScore: number;
  createdAt: Date;
}

// --- Sensor Data ---
export type SensorType = 'soil_moisture' | 'humidity' | 'temperature' | 'rainfall' | 'water_level' | 'soil_ph' | 'nitrogen' | 'phosphorus' | 'potassium';

export interface SensorReading {
  id: string;
  farmId: string;
  type: SensorType;
  value: number;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export interface SensorConfig {
  type: SensorType;
  label: string;
  unit: string;
  icon: string;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  color: string;
}

// --- Disease Scanning ---
export interface ScanResult {
  id: string;
  farmId: string;
  userId: string;
  imageUrl: string;
  disease: DiseaseDetection;
  rootCause: RootCauseAnalysis;
  treatments: Treatment[];
  createdAt: Date;
}

export interface DiseaseDetection {
  name: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  affectedArea: number; // percentage
  description: string;
  scientificName: string;
}

export interface RootCauseAnalysis {
  primaryCause: string;
  factors: EnvironmentalFactor[];
  reasoning: string[];
  sustainabilityImpact: number;
  riskScore: number;
  timeline: RiskEvent[];
  correlations: FactorCorrelation[];
}

export interface EnvironmentalFactor {
  name: string;
  category: 'weather' | 'soil' | 'irrigation' | 'chemical' | 'biological';
  impact: number; // 0-100
  current: number;
  optimal: number;
  unit: string;
  status: 'optimal' | 'suboptimal' | 'critical';
  description: string;
}

export interface RiskEvent {
  date: string;
  event: string;
  severity: 'low' | 'medium' | 'high';
  factor: string;
}

export interface FactorCorrelation {
  factor1: string;
  factor2: string;
  correlation: number;
  description: string;
}

// --- Treatments ---
export interface Treatment {
  id: string;
  type: 'pesticide' | 'organic' | 'irrigation' | 'nutrient' | 'cultural';
  name: string;
  description: string;
  dosage?: string;
  frequency?: string;
  cost: 'low' | 'medium' | 'high';
  effectiveness: number;
  sustainabilityScore: number;
  isOrganic: boolean;
  warnings?: string[];
}

// --- Chemical Intelligence ---
export interface Chemical {
  id: string;
  name: string;
  type: 'pesticide' | 'fertilizer' | 'herbicide' | 'fungicide';
  activeIngredient: string;
  toxicityLevel: 'low' | 'moderate' | 'high' | 'very_high';
  ecoScore: number;
  applications: ChemicalApplication[];
  interactions: ChemicalInteraction[];
  alternatives: string[];
}

export interface ChemicalApplication {
  id: string;
  chemicalId: string;
  farmId: string;
  date: Date;
  dosage: number;
  unit: string;
  cropType: string;
  appliedBy: string;
  notes: string;
}

export interface ChemicalInteraction {
  chemicalId: string;
  interactsWith: string;
  severity: 'safe' | 'caution' | 'dangerous';
  description: string;
}

// --- AI Assistant ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  references?: DataReference[];
  charts?: ChartData[];
}

export interface DataReference {
  type: 'sensor' | 'disease' | 'weather' | 'chemical';
  label: string;
  value: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'radar' | 'pie';
  title: string;
  data: Record<string, unknown>[];
}

// --- Dashboard ---
export interface DashboardMetrics {
  healthScore: number;
  sustainabilityIndex: number;
  diseaseRisk: number;
  waterUsage: number;
  yieldPrediction: number;
  activeAlerts: number;
  totalScans: number;
}

export interface Alert {
  id: string;
  farmId: string;
  type: 'disease' | 'sensor' | 'weather' | 'chemical' | 'system';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

// --- Weather ---
export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    uvIndex: number;
  };
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  humidity: number;
  precipitation: number;
  condition: string;
  icon: string;
}

// --- Admin ---
export interface RegionalOutbreak {
  id: string;
  region: string;
  disease: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  affectedFarms: number;
  firstDetected: Date;
  status: 'active' | 'contained' | 'resolved';
  coordinates: { lat: number; lng: number };
}
