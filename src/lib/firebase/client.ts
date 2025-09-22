import { getApps, initializeApp, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (process.env.NODE_ENV !== 'production') {
  console.debug('Firebase key prefix', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.slice(0,8));
  const missing = Object.entries(cfg)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    // Fail fast with a precise error so you never see auth/invalid-api-key again
    throw new Error(
      `Firebase web config missing: ${missing.join(
        ', '
      )}. Add them to .env.local and rebuild (Next inlines NEXT_PUBLIC_* at build time).`
    );
  }
}

export const app = getApps().length ? getApp() : initializeApp(cfg as Required<typeof cfg>);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Offline persistence (best-effort)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch(() => {});
}
