
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhAJUHDbTEKSH84z-wVi8qK5-jq1kAhcY",
  authDomain: "kista-1.firebaseapp.com",
  projectId: "kista-1",
  storageBucket: "kista-1.firebasestorage.app",
  messagingSenderId: "969903902786",
  appId: "1:969903902786:web:96db088c3179b880751ddb",
  measurementId: "G-25BBT5DG19"
};

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
