import * as admin from 'firebase-admin';

// Initialize once; prefer ADC (Application Default Credentials) in dev/studio.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch {
    // Ignore reinit or credential race in hot reload
  }
}

export const adminDb = admin.firestore();
