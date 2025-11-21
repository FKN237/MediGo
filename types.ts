
export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string; // e.g. "500mg"
  category: string;
  price: number;
  currency: string;
  requiresPrescription: boolean;
  description: string;
  treats: string[]; // List of symptoms/conditions
  sideEffects: string[];
  usage: string;
  // New detailed fields
  warnings: string[];
  interactions: string[];
  storage: string;
  manufacturer: string;
}

export interface PharmacyStock {
  medicationId: string;
  status: StockStatus;
  quantity: number;
  lastUpdated: string;
  price?: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  location: Coordinates;
  address: string;
  city: string;
  isVerified: boolean; // Certified pharmacy
  isOpen: boolean;
  phone: string;
  stock: PharmacyStock[];
}

export interface SearchResult {
  pharmacy: Pharmacy;
  medication: Medication;
  stock: PharmacyStock;
  distance: number; // in km
}

export type ViewState = 
  | 'ONBOARDING'
  | 'HOME' 
  | 'SEARCH_RESULTS' 
  | 'DRUG_DETAILS'
  | 'CATALOGUE'
  | 'PHARMACY_DETAIL' 
  | 'ADMIN_LOGIN' 
  | 'ADMIN_DASHBOARD' 
  | 'PHARMACY_LOGIN'
  | 'PHARMACY_DASHBOARD'
  | 'VERIFY_DRUG'
  | 'PROFILE'
  | 'ABOUT';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isAlternatives?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'PENDING' | 'READY' | 'COMPLETED';
  time: string;
}

export interface Report {
  id: string;
  type: 'PRICE_MISMATCH' | 'FAKE_DRUG' | 'POOR_SERVICE';
  pharmacyName: string;
  description: string;
  date: string;
  status: 'OPEN' | 'RESOLVED';
}
