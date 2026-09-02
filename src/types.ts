export interface DayItinerary {
  id: number;
  dayNumber: number;
  date: string; // e.g. "9月15日"
  fullDate: string; // e.g. "2026-09-15"
  weekday: string; // e.g. "周二"
  phaseId: 1 | 2 | 3;
  phaseName: string;
  from: string;
  to: string;
  routeTitle: string; // e.g. "通辽市 - 保定市"
  departureTime: string;
  arrivalTime: string;
  distanceKm: number;
  roadType: string;
  navDestination: string;
  fuelStrategy: string;
  lunch: string;
  dinner: string;
  scenery: string;
  attractions: string;
  photoSpots: string;
  hotelInfo: string;
  estimatedCostPerPerson: number; // in RMB
  costBreakdown: string;
  roadConditions: string;
  driverNotes: string;
  isRestDay?: boolean;
  startAltitude: number; // in meters
  endAltitude: number; // in meters
  maxAltitude: number; // in meters
  maxAltitudeLocation?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  riskTags: string[];
  tips: string[];
}

export interface PhaseInfo {
  id: 1 | 2 | 3;
  name: string;
  dateRange: string;
  startDay: number;
  endDay: number;
  description: string;
  totalKm: number;
  color: string;
  accentBg: string;
  borderColor: string;
}

export interface ExpenseRecord {
  id: string;
  dayNumber: number;
  category: 'fuel' | 'toll' | 'hotel' | 'food' | 'ticket' | 'supplies' | 'other';
  title: string;
  amount: number;
  paidBy: string;
  timestamp: string;
  createdAt?: number;
  notes?: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone?: string;
  carPlate?: string;
  color: string;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  icon: string;
  items: {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    required: boolean;
  }[];
}

export interface PhotoPost {
  id: string;
  sender: string;
  base64Data: string;
  caption?: string;
  timestamp: number;
}
