import mongoose from "mongoose";

const mongoUri =
  process.env.MONGO_DB_CONNECTION_URL ?? "mongodb://localhost:27017/pms";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
