import mongoose from 'mongoose';

// Type for mongoose cache
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend global type for mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

// Cache the connection to reuse in serverless environments
let cached: MongooseCache;

if (!global.mongoose) {
  cached = global.mongoose = { conn: null, promise: null };
} else {
  cached = global.mongoose;
}

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // If already connected, return
    if (cached.conn) {
      return;
    }

    // If connection is in progress, wait for it
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(mongoURI, opts).then((mongooseInstance) => {
        console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      });
    }

    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Error connecting to MongoDB:', error);
    // Don't exit process in serverless - let Vercel handle it
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;

