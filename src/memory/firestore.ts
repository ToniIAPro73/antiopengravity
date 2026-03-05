import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from '../config/env.js';

export const app = initializeApp({
  credential: cert(config.GOOGLE_APPLICATION_CREDENTIALS)
});

export const db = getFirestore(app);
