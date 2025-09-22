import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { RRule } from 'rrule';

admin.initializeApp();
const db = admin.firestore();

// Expand subscription events when a base event with meta.rrule is created
export const onSubscriptionCreate = functions.firestore
  .document('events/{id}')
  .onCreate(async (snap, ctx) => {
    const e = snap.data();
    if (e?.kind !== 'subscription' || !e?.meta?.rrule) return;
    const rule = RRule.fromString(e.meta.rrule as string);
    const to = new Date(); to.setMonth(to.getMonth() + 12); // materialize 12 months
    const dates = rule.between(new Date(), to, true);
    const batch = db.batch();
    for (const d of dates) {
      const ref = db.collection('events').doc();
      batch.set(ref, { ...e, date: d.toISOString().slice(0,10), createdAt: admin.firestore.FieldValue.serverTimestamp() });
    }
    await batch.commit();
  });

// Aggregate monthly inflow/outflow when any event changes
export const onEventWrite = functions.firestore
  .document('events/{id}')
  .onWrite(async (change, ctx) => {
    const after = change.after.exists ? change.after.data() : null;
    const before = change.before.exists ? change.before.data() : null;
    const target = after ?? before; if (!target) return;
    const { uid, date } = target as any; if (!uid || !date) return;

    // Compute YYYY-MM bucket
    const ym = date.slice(0,7);
    const snap = await db.collection('events').where('uid','==',uid).where('date','>=', ym+'-01').where('date','<=', ym+'-31').get();
    let inflow = 0, outflow = 0;
    for (const d of snap.docs) {
      const amt = Number(d.get('amount') || 0);
      if (amt >= 0) inflow += amt; else outflow += amt;
    }
    await db.collection('aggregates').doc(uid).collection('monthly').doc(ym).set({ inflow, outflow, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  });
