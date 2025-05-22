import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 * @param {string} mongoUri - MongoDB connection string
 * @returns {Promise} MongoDB connection promise
 */
export const connectDB = async (mongoUri) => {
  try {
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise} Disconnection promise
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};

/**
 * Check if MongoDB is connected
 * @returns {boolean} Connection status
 */
export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};
