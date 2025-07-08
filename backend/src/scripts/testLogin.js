import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import User from "../models/user.model.js";
import { connectDB, disconnectDB } from "../db/connection.js";

config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/educare_db";

async function testLogin() {
  try {
    console.log("🔍 Testing login process...");
    
    // Connect to database
    await connectDB(MONGO_URI);
    
    // Test credentials
    const testEmail = "roberto.silva@gmail.com";
    const testPassword = "parent123";
    const testRole = "parent";
    
    console.log(`\n🧪 Testing login with:`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   Role: ${testRole}`);
    
    // Step 1: Find user by email and role (exact same query as auth controller)
    console.log(`\n1️⃣ Looking for user with email: ${testEmail}, role: ${testRole}, is_active: true`);
    const user = await User.findOne({ 
      email: testEmail, 
      role: testRole, 
      is_active: true 
    });
    
    if (!user) {
      console.log("❌ User not found with these criteria");
      
      // Let's check what users exist with this email
      const userByEmail = await User.findOne({ email: testEmail });
      if (userByEmail) {
        console.log(`   Found user with email but different criteria:`);
        console.log(`   Role: ${userByEmail.role}`);
        console.log(`   Active: ${userByEmail.is_active}`);
      } else {
        console.log(`   No user found with email: ${testEmail}`);
      }
      return;
    }
    
    console.log("✅ User found!");
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.is_active}`);
    console.log(`   Password Hash: ${user.password_hash.substring(0, 20)}...`);
    
    // Step 2: Test password comparison
    console.log(`\n2️⃣ Testing password comparison...`);
    const isPasswordValid = await bcrypt.compare(testPassword, user.password_hash);
    
    if (isPasswordValid) {
      console.log("✅ Password is valid!");
      console.log("🎉 Login should work!");
    } else {
      console.log("❌ Password is invalid!");
      
      // Let's test what the hash should be
      console.log("\n🔍 Testing password hashing...");
      const testHash1 = await bcrypt.hash(testPassword, 12);
      const testHash2 = await bcrypt.hash(testPassword, 10);
      
      console.log(`   Original hash: ${user.password_hash}`);
      console.log(`   Test hash (12 rounds): ${testHash1}`);
      console.log(`   Test hash (10 rounds): ${testHash2}`);
      
      // Test if the stored hash works with bcrypt.compare
      const testCompare1 = await bcrypt.compare(testPassword, testHash1);
      const testCompare2 = await bcrypt.compare(testPassword, testHash2);
      
      console.log(`   Compare with test hash 1: ${testCompare1}`);
      console.log(`   Compare with test hash 2: ${testCompare2}`);
    }
    
    // Step 3: Test with all parent accounts
    console.log(`\n3️⃣ Testing all parent accounts...`);
    const allParents = await User.find({ role: "parent", is_active: true });
    
    for (const parent of allParents) {
      console.log(`\n   Testing ${parent.name} (${parent.email}):`);
      const passwordTest = await bcrypt.compare("parent123", parent.password_hash);
      console.log(`   Password valid: ${passwordTest}`);
    }
    
  } catch (error) {
    console.error("❌ Error testing login:", error);
  } finally {
    await disconnectDB();
  }
}

// Run the test script
if (import.meta.url === `file://${process.argv[1]}`) {
  testLogin();
}

export default testLogin;
