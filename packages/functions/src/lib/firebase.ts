import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Resource } from "sst";

let _db: FirebaseFirestore.Firestore | null = null;

export function getDb(): FirebaseFirestore.Firestore {
  if (_db) return _db;

  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(Resource.FirebaseServiceAccount.value);
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  _db = getFirestore();
  return _db;
}
