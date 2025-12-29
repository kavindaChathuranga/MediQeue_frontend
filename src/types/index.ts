// Patient types
export interface Patient {
  id: string;
  name: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  allergies: string[];
  chronicConditions: string[];
  createdAt: Date;
}

// Queue types
export type TokenStatus = 'waiting' | 'in-room' | 'urgent' | 'completed' | 'skipped';

export interface QueueToken {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  status: TokenStatus;
  consultationCompleted?: boolean;
  queueType: 'opd' | 'specialist';
  doctorId?: string;
  doctorName?: string;
  estimatedWaitTime: number;
  position: number;
  createdAt: Date;
  calledAt?: Date;
}

// Consultation types
export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  symptoms: string;
  diagnosis: string;
  notes: string;
  prescriptions: Prescription[];
  createdAt: Date;
}

export interface Prescription {
  id: string;
  drugId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Inventory types
export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  unit: string;
  reorderLevel: number;
  batches: DrugBatch[];
}

export interface DrugBatch {
  id: string;
  drugId: string;
  batchNumber: string;
  expiryDate: Date;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  receivedAt: Date;
}

// User types
export type UserRole = 'receptionist' | 'doctor' | 'pharmacist' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Invoice types
export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'insurance';
  status: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Doctor types
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  available: boolean;
  roomNumber: string;
}
