import { db } from './firebase';
import { collection, doc, onSnapshot, setDoc, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ChecklistCategory, ExpenseRecord } from '../types';

/**
 * ==========================================
 * 数据服务层 (Data Service Layer)
 * ==========================================
 * 您的程序员朋友接手后，只需要修改这个文件，
 * 将下面 Firebase 的代码替换为腾讯云开发 (CloudBase) 
 * 的对应增删改查逻辑即可，无需修改任何组件的 UI 代码！
 */

// 1. 物资清单 (Tibet Checklist)
export const subscribeToChecklist = (onUpdate: (categories: ChecklistCategory[]) => void) => {
  return onSnapshot(doc(db, 'shared_state', 'tibet_checklist'), (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data().categories);
    }
  });
};

export const updateChecklist = async (categories: ChecklistCategory[]) => {
  await setDoc(doc(db, 'shared_state', 'tibet_checklist'), { categories }, { merge: true });
};


// 2. 账本与财务 (Budget Calculator)
export const subscribeToExpenses = (onUpdate: (expenses: ExpenseRecord[]) => void) => {
  const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const expenseData: ExpenseRecord[] = [];
    snapshot.forEach((doc) => {
      expenseData.push({ id: doc.id, ...doc.data() } as ExpenseRecord);
    });
    onUpdate(expenseData);
  });
};

export const addExpense = async (expense: Omit<ExpenseRecord, 'id'>) => {
  await addDoc(collection(db, 'expenses'), expense);
};

export const deleteExpense = async (id: string) => {
  await deleteDoc(doc(db, 'expenses', id));
};


// 3. 司机轮换与追踪 (Driver Rotation Tracker)
export const subscribeToDriverTracker = (onUpdate: (data: { drivers?: any[], currentActiveDriverIndex?: number }) => void) => {
  return onSnapshot(doc(db, 'shared_state', 'driver_tracker'), (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data());
    }
  });
};

export const updateDriverTracker = async (data: { drivers?: any[], currentActiveDriverIndex?: number }) => {
  await setDoc(doc(db, 'shared_state', 'driver_tracker'), data, { merge: true });
};
