import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "radiant-wallaby-3vk22",
  appId: "1:514376144553:web:ffb463aeca44ac79c0fbb8",
  apiKey: "AIzaSyBk0jfG5soeZGR2dcmfBrFw9ahr5DhNM5w",
  authDomain: "radiant-wallaby-3vk22.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-31831722-0ab8b04b-6fbc-4eeb-9952-5c04bbf49c42",
  storageBucket: "radiant-wallaby-3vk22.firebasestorage.app",
  messagingSenderId: "514376144553",
  measurementId: "",
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore (use standard getFirestore to avoid IndexedDB sandbox issues in previews)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
