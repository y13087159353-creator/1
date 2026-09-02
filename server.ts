import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "local_db.json");

// Define default data structure
const defaultData = {
  checklist: null,
  expenses: [],
  driverTracker: null,
  roadbook: null
};

let dbData = { ...defaultData };

// Load data from local JSON file
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    dbData = { ...defaultData, ...JSON.parse(raw) };
    console.log("Local database loaded successfully.");
  } catch (e) {
    console.error("Error reading local DB file:", e);
  }
}

// Helper to save data to local JSON file
const saveDB = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing to local DB file:", e);
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    // 1. Send initial state to the newly connected client
    if (dbData.checklist) socket.emit('checklist_update', dbData.checklist);
    if (dbData.expenses && dbData.expenses.length > 0) socket.emit('expenses_update', dbData.expenses);
    if (dbData.driverTracker) socket.emit('driver_update', dbData.driverTracker);
    if (dbData.roadbook) socket.emit('roadbook_update', dbData.roadbook);

    // 2. Handle Checklists updates
    socket.on('update_checklist', (categories) => {
      dbData.checklist = categories;
      saveDB();
      socket.broadcast.emit('checklist_update', categories); // Sync to other clients
    });

    // 3. Handle Expenses updates
    socket.on('add_expense', (expense) => {
      const newEx = { id: Date.now().toString() + Math.random().toString(36).substring(7), ...expense };
      dbData.expenses = [newEx, ...(dbData.expenses || [])];
      saveDB();
      io.emit('expenses_update', dbData.expenses); // Sync to all clients including sender
    });

    socket.on('delete_expense', (id) => {
      dbData.expenses = (dbData.expenses || []).filter((ex: any) => ex.id !== id);
      saveDB();
      io.emit('expenses_update', dbData.expenses);
    });

    // 4. Handle Driver Tracker updates
    socket.on('update_driver', (data) => {
      dbData.driverTracker = { ...(dbData.driverTracker || {}), ...data };
      saveDB();
      socket.broadcast.emit('driver_update', dbData.driverTracker);
    });

    // 5. Handle Roadbook completion updates
    socket.on('update_roadbook', (data) => {
      dbData.roadbook = { ...(dbData.roadbook || {}), ...data };
      saveDB();
      socket.broadcast.emit('roadbook_update', dbData.roadbook);
    });
  });

  // Vite middleware for development or Static files for production
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
