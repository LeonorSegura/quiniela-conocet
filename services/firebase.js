import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD37znfeJ8kYkiwnfHsV2LkklTXpfyNio8",
  authDomain: "e1459leonors-fdf0f.firebaseapp.com",
  projectId: "e1459leonors-fdf0f",
  storageBucket: "e1459leonors-fdf0f.firebasestorage.app",
  messagingSenderId: "207036295992",
  appId: "1:207036295992:web:285b1bb6b12e5522ba6fcd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };