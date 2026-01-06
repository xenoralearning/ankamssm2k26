
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA488sr_4Fype6EWrc23wLYMfA87H-hexQ",
  authDomain: "ankam-2026-leaderboard.firebaseapp.com",
  projectId: "ankam-2026-leaderboard",
  storageBucket: "ankam-2026-leaderboard.firebasestorage.app",
  messagingSenderId: "7214503352",
  appId: "1:7214503352:web:5fe56521c281b2b0ea2b4d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
