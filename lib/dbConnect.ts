import mongoose, { Mongoose } from 'mongoose';

/**
 * Jedno globalne połączenie z MongoDB (cache w globalThis),
 * żeby uniknąć wielokrotnego otwierania sesji w trybie HMR / lambdach.
 */
const RAW_URI = process.env.MONGODB_URI;

// Runtime check – da przyjazny komunikat, jeśli brak zmiennej.
if (!RAW_URI) {
  throw new Error('Zdefiniuj zmienną środowiskową MONGODB_URI w .env.local');
}

// TS: Po powyższym sprawdzeniu możemy bezpiecznie założyć, że to string.
const MONGODB_URI: string = RAW_URI; // lub: process.env.MONGODB_URI!

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Deklaracja globalnego cache (ważne przy HMR w Next.js)
declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined;
}

let cached = globalThis.__mongoose;
if (!cached) {
  cached = { conn: null, promise: null };
  globalThis.__mongoose = cached;
}

export default async function dbConnect(): Promise<Mongoose> {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
