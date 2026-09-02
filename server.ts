import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "radiant-wallaby-3vk22",
  appId: "1:514376144553:web:ffb463aeca44ac79c0fbb8",
  apiKey: "AIzaSyBk0jfG5soeZGR2dcmfBrFw9ahr5DhNM5w",
  authDomain: "radiant-wallaby-3vk22.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-31831722-0ab8b04b-6fbc-4eeb-9952-5c04bbf49c42",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  let checklistCache: any = null;
  let expensesCache: any[] = [];
  let driverTrackerCache: any = null;
  let roadbookCache: any = null;

  try {
    const clSnap = await getDoc(doc(db, 'shared_state', 'tibet_checklist'));
    if (clSnap.exists()) checklistCache = clSnap.data().categories;

    const exSnap = await getDocs(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')));
    exSnap.forEach(d => expensesCache.push({ id: d.id, ...d.data() }));

    const drSnap = await getDoc(doc(db, 'shared_state', 'driver_tracker'));
    if (drSnap.exists()) driverTrackerCache = drSnap.data();

    const rbSnap = await getDoc(doc(db, 'shared_state', 'roadbook_state'));
    if (rbSnap.exists()) roadbookCache = rbSnap.data();
  } catch(e) {
    console.error("Firebase init load error (Safe to ignore if offline)", e);
  }

  io.on("connection", (socket) => {
    if (checklistCache) socket.emit('checklist_update', checklistCache);
    if (expensesCache.length > 0) socket.emit('expenses_update', expensesCache);
    if (driverTrackerCache) socket.emit('driver_update', driverTrackerCache);
    if (roadbookCache) socket.emit('roadbook_update', roadbookCache);

    socket.on('update_roadbook', async (data) => {
      roadbookCache = { ...roadbookCache, ...data };
      socket.broadcast.emit('roadbook_update', roadbookCache);
      try { await setDoc(doc(db, 'shared_state', 'roadbook_state'), data, { merge: true }); } catch(e){}
    });

    socket.on('update_checklist', async (categories) => {
      checklistCache = categories;
      socket.broadcast.emit('checklist_update', categories);
      try { await setDoc(doc(db, 'shared_state', 'tibet_checklist'), { categories }, { merge: true }); } catch(e){}
    });

    socket.on('add_expense', async (expense) => {
      try {
        const docRef = await addDoc(collection(db, 'expenses'), expense);
        const newEx = { id: docRef.id, ...expense };
        expensesCache = [newEx, ...expensesCache];
        io.emit('expenses_update', expensesCache);
      } catch(e) {}
    });

    socket.on('delete_expense', async (id) => {
      expensesCache = expensesCache.filter(ex => ex.id !== id);
      io.emit('expenses_update', expensesCache);
      try { await deleteDoc(doc(db, 'expenses', id)); } catch(e){}
    });

    socket.on('update_driver', async (data) => {
      driverTrackerCache = { ...driverTrackerCache, ...data };
      socket.broadcast.emit('driver_update', driverTrackerCache);
      try { await setDoc(doc(db, 'shared_state', 'driver_tracker'), data, { merge: true }); } catch(e){}
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
