import mqtt from 'mqtt';
import { ChecklistCategory, ExpenseRecord } from '../types';

// Connect to the public EMQX MQTT broker over Secure WebSockets
// Using a highly unique topic prefix to act as a "private room"
const TOPIC_PREFIX = 'tibet_tour_app_3vk22_secret_room_1029384756';

const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
  clientId: 'tibet_client_' + Math.random().toString(16).substring(2, 10),
});

client.on('connect', () => {
  console.log('Connected to EMQX Public Broker (Free Proxy Sync Active!)');
  // Subscribe to all our subtopics
  client.subscribe(`${TOPIC_PREFIX}/#`, (err) => {
    if (err) console.error('Subscription error:', err);
  });
});

// Event listeners arrays
const listeners = {
  checklist: [] as ((data: ChecklistCategory[]) => void)[],
  expenses: [] as ((data: ExpenseRecord[]) => void)[],
  driverTracker: [] as ((data: any) => void)[],
  roadbook: [] as ((data: any) => void)[],
};

// State caches to support optimistic updates and retain merges
let currentExpenses: ExpenseRecord[] = [];
let currentDriverTracker: any = {};
let currentRoadbook: any = {};

// Handle incoming messages
client.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const subtopic = topic.replace(`${TOPIC_PREFIX}/`, '');
    
    if (subtopic === 'checklist') {
      listeners.checklist.forEach(fn => fn(payload));
    } else if (subtopic === 'expenses') {
      currentExpenses = payload;
      listeners.expenses.forEach(fn => fn(payload));
    } else if (subtopic === 'driverTracker') {
      currentDriverTracker = { ...currentDriverTracker, ...payload };
      listeners.driverTracker.forEach(fn => fn(currentDriverTracker));
    } else if (subtopic === 'roadbook') {
      currentRoadbook = { ...currentRoadbook, ...payload };
      listeners.roadbook.forEach(fn => fn(currentRoadbook));
    }
  } catch (e) {
    console.error('Error parsing MQTT payload', e);
  }
});

// Helper to publish with retain: true (so late joiners get the latest state immediately)
const publishRetained = (subtopic: string, data: any) => {
  if (client.connected) {
    client.publish(`${TOPIC_PREFIX}/${subtopic}`, JSON.stringify(data), { retain: true, qos: 1 });
  }
};

/**
 * ==========================================
 * 中转站同步 (EMQX Public Broker Sync)
 * ==========================================
 */

// === 1. 物资清单 ===
export const subscribeToChecklist = (onUpdate: (categories: ChecklistCategory[]) => void) => {
  listeners.checklist.push(onUpdate);
  return () => {
    listeners.checklist = listeners.checklist.filter(fn => fn !== onUpdate);
  };
};

export const updateChecklist = async (categories: ChecklistCategory[]) => {
  publishRetained('checklist', categories);
};

// === 2. 账本与财务 ===
export const subscribeToExpenses = (onUpdate: (expenses: ExpenseRecord[]) => void) => {
  listeners.expenses.push(onUpdate);
  return () => {
    listeners.expenses = listeners.expenses.filter(fn => fn !== onUpdate);
  };
};

export const addExpense = async (expense: Omit<ExpenseRecord, 'id'>) => {
  const newEx = { id: Date.now().toString() + Math.random().toString(36).substring(7), ...expense };
  const updated = [newEx, ...currentExpenses];
  currentExpenses = updated;
  publishRetained('expenses', updated);
};

export const deleteExpense = async (id: string) => {
  const updated = currentExpenses.filter(ex => ex.id !== id);
  currentExpenses = updated;
  publishRetained('expenses', updated);
};

// === 3. 司机轮换与追踪 ===
export const subscribeToDriverTracker = (onUpdate: (data: { drivers?: any[], currentActiveDriverIndex?: number }) => void) => {
  listeners.driverTracker.push(onUpdate);
  return () => {
    listeners.driverTracker = listeners.driverTracker.filter(fn => fn !== onUpdate);
  };
};

export const updateDriverTracker = async (data: { drivers?: any[], currentActiveDriverIndex?: number }) => {
  currentDriverTracker = { ...currentDriverTracker, ...data };
  publishRetained('driverTracker', currentDriverTracker);
};

// === 4. 路书打卡与笔记 ===
export const subscribeToRoadbookState = (onUpdate: (data: { completedDays?: number[], userNotes?: Record<number, string> }) => void) => {
  listeners.roadbook.push(onUpdate);
  return () => {
    listeners.roadbook = listeners.roadbook.filter(fn => fn !== onUpdate);
  };
};

export const updateRoadbookState = async (data: { completedDays?: number[], userNotes?: Record<number, string> }) => {
  currentRoadbook = { ...currentRoadbook, ...data };
  publishRetained('roadbook', currentRoadbook);
};
