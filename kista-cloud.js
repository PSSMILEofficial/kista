
import { db } from "./firebase-config.js";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const ALLOWED_COLLECTIONS = new Set([
  "kistaData/main/customers",
  "kistaData/main/villages",
  "kistaData/main/customerHistory"
]);

export const SYNC_STATUS = Object.freeze({
  LOCAL: "local",
  SAVING: "saving",
  SAVED: "saved",
  ERROR: "error"
});

function validateCollection(collectionName) {
  if (!ALLOWED_COLLECTIONS.has(collectionName)) {
    throw new Error("This Firestore collection is not approved for Kista.");
  }
}

function validateId(recordId) {
  if (
    typeof recordId !== "string" ||
    !recordId.trim() ||
    recordId.includes("/")
  ) {
    throw new Error("A valid document ID is required.");
  }
}

export async function saveCloudRecord(
  collectionName,
  recordId,
  record
) {
  validateCollection(collectionName);
  validateId(recordId);

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("A valid record object is required.");
  }

  await setDoc(
    doc(collection(db, collectionName), recordId),
    {
      ...record,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  return {
    status: SYNC_STATUS.SAVED,
    recordId
  };
}

export async function readCloudRecord(collectionName, recordId) {
  validateCollection(collectionName);
  validateId(recordId);

  const snapshot = await getDoc(
    doc(collection(db, collectionName), recordId)
  );

  return snapshot.exists()
    ? { id: snapshot.id, ...snapshot.data() }
    : null;
}

export async function readCloudCollection(collectionName) {
  validateCollection(collectionName);

  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}

export async function deleteCloudRecord(collectionName, recordId) {
  validateCollection(collectionName);
  validateId(recordId);

  await deleteDoc(doc(collection(db, collectionName), recordId));

  return {
    status: SYNC_STATUS.SAVED,
    recordId
  };
}
