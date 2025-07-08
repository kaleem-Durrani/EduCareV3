import mongoose from "mongoose";
import { config } from "dotenv";
import User from "../models/user.model.js";
import { connectDB, disconnectDB } from "../db/connection.js";

config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/educare_db";

async function queryParents() {
  try {
    console.log("🔍 Connecting to database to query parent accounts...");
    
    // Connect to database
    await connectDB(MONGO_URI);
    
    // Find all parent users
    const parents = await User.find({ role: "parent", is_active: true }).select(
      "name email phone address createdAt"
    );
    
    console.log(`\n📊 Found ${parents.length} parent accounts:\n`);
    
    if (parents.length === 0) {
      console.log("❌ No parent accounts found in the database.");
      console.log("💡 You may need to run the seeding script first:");
      console.log("   npm run seed");
    } else {
      parents.forEach((parent, index) => {
        console.log(`${index + 1}. ${parent.name || 'No Name'}`);
        console.log(`   Email: ${parent.email}`);
        console.log(`   Phone: ${parent.phone || 'No Phone'}`);
        console.log(`   Address: ${parent.address || 'No Address'}`);
        console.log(`   Created: ${parent.createdAt}`);
        console.log(`   Password: parent123 (default from seeding)`);
        console.log("");
      });
      
      console.log("🔑 To login, use:");
      console.log("   Email: [any email from above]");
      console.log("   Password: parent123");
      console.log("   Role: parent");
    }
    
    // Also check for any users with role parent (case insensitive)
    const allUsers = await User.find({}).select("name email role is_active");
    console.log(`\n📋 All users in database (${allUsers.length} total):`);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No Name'} - ${user.email} - ${user.role} - Active: ${user.is_active}`);
    });
    
  } catch (error) {
    console.error("❌ Error querying database:", error);
  } finally {
    await disconnectDB();
  }
}

// Run the query script
if (import.meta.url === `file://${process.argv[1]}`) {
  queryParents();
}

export default queryParents;
