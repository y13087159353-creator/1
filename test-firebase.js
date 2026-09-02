import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "radiant-wallaby-3vk22",
  appId: "1:514376144553:web:ffb463aeca44ac79c0fbb8",
  apiKey: "AIzaSyBk0jfG5soeZGR2dcmfBrFw9ahr5DhNM5w",
  authDomain: "radiant-wallaby-3vk22.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-31831722-0ab8b04b-6fbc-4eeb-9952-5c04bbf49c42",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function test() {
  try {
    console.log("Fetching checklist...");
    const clSnap = await getDoc(doc(db, 'shared_state', 'tibet_checklist'));
    console.log("Checklist exists:", clSnap.exists());
    if(clSnap.exists()) {
        console.log("Data:", clSnap.data());
    } else {
        console.log("Setting dummy data...");
        await setDoc(doc(db, 'shared_state', 'tibet_checklist'), { categories: [] }, { merge: true });
        console.log("Set doc successful!");
    }
  } catch(e) {
    console.error("Error:", e);
  }
}
test();
