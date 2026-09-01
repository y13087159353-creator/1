import { ChecklistCategory, ExpenseRecord } from '../types';
import { io } from "socket.io-client";

// Connect to the same host (the Node.js backend)
const socket = io();

socket.on('connect', () => {
  console.log('Connected to Proxy Server for Sync!');
});

/**
 * ==========================================
 * 中转站同步 (Proxy Sync Service Layer)
 * ==========================================
 */

// === 1. 物资清单 ===
export const subscribeToChecklist = (onUpdate: (categories: ChecklistCategory[]) => void) => {
  const handler = (data: any) => onUpdate(data);
  socket.on('checklist_update', handler);
  return () => socket.off('checklist_update', handler);
};

export const updateChecklist = async (categories: ChecklistCategory[]) => {
  socket.emit('update_checklist', categories);
};

// === 2. 账本与财务 ===
export const subscribeToExpenses = (onUpdate: (expenses: ExpenseRecord[]) => void) => {
  const handler = (data: any) => onUpdate(data);
  socket.on('expenses_update', handler);
  return () => socket.off('expenses_update', handler);
};

export const addExpense = async (expense: Omit<ExpenseRecord, 'id'>) => {
  socket.emit('add_expense', expense);
};

export const deleteExpense = async (id: string) => {
  socket.emit('delete_expense', id);
};

// === 3. 司机轮换与追踪 ===
export const subscribeToDriverTracker = (onUpdate: (data: { drivers?: any[], currentActiveDriverIndex?: number }) => void) => {
  const handler = (data: any) => onUpdate(data);
  socket.on('driver_update', handler);
  return () => socket.off('driver_update', handler);
};

export const updateDriverTracker = async (data: { drivers?: any[], currentActiveDriverIndex?: number }) => {
  socket.emit('update_driver', data);
};
