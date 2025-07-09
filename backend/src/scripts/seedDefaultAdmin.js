import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "john@gmail.com";
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("123456", 10);

    const admin = new User({
      email,
      password_hash: passwordHash,
      role: "admin",
      name: "John Admin",
    });

    await admin.save();
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
