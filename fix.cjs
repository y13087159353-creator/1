const fs = require('fs');

// BudgetCalculator
let b = fs.readFileSync('src/components/BudgetCalculator.tsx', 'utf-8');
b = b.replace(
  /const q = query\(collection\(db, ["']expenses["']\), orderBy\(["']createdAt["'], ["']desc["']\)\);.*?return \(\) => unsubscribe\(\);/s,
  `const unsubscribe = subscribeToExpenses((expenseData) => {\n      setExpenses(expenseData);\n      setLoading(false);\n    });\n    return () => unsubscribe();`
);
b = b.replace(
  /await addDoc\(collection\(db, ["']expenses["']\), \{/s,
  `await addExpense({`
);
b = b.replace(
  /await deleteDoc\(doc\(db, ["']expenses["'], id\)\);/s,
  `await deleteExpense(id);`
);
fs.writeFileSync('src/components/BudgetCalculator.tsx', b);

// DriverRotationTracker
let d = fs.readFileSync('src/components/DriverRotationTracker.tsx', 'utf-8');
d = d.replace(/import \{ doc, onSnapshot, setDoc \} from 'firebase\/firestore';/, '');
d = d.replace(/import \{ db \} from '\.\.\/lib\/firebase';/, `import { subscribeToDriverTracker, updateDriverTracker } from '../lib/dataService';`);
d = d.replace(
  /const unsub = onSnapshot\(doc\(db, 'shared_state', 'driver_tracker'\), \(docSnap\) => \{.*?return \(\) => unsub\(\);/s,
  `const unsub = subscribeToDriverTracker((data) => {\n      if (data.drivers) setDrivers(data.drivers);\n      if (data.currentActiveDriverIndex !== undefined) setCurrentActiveDriverIndex(data.currentActiveDriverIndex);\n    });\n    return () => unsub();`
);
d = d.replace(
  /await setDoc\(doc\(db, 'shared_state', 'driver_tracker'\), \{[\s\S]*?\}, \{ merge: true \}\);/g,
  function(match) {
    if (match.includes('currentActiveDriverIndex')) {
      return `await updateDriverTracker({ currentActiveDriverIndex: index });`;
    } else {
      return `await updateDriverTracker({ drivers: newDrivers });`;
    }
  }
);
fs.writeFileSync('src/components/DriverRotationTracker.tsx', d);

console.log("Fixed!");
