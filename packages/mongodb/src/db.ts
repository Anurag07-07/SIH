import mongoose from 'mongoose';

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  const uri = process.env.DATABASE_URL;
  console.log(uri);
  
  if (!uri) throw new Error(`DATABASE_URL not set ${uri}`);

  await mongoose.connect(uri);
  isConnected = true;

  console.log('MongoDB connected');
}
