import mongoose from "mongoose";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import User from "../models/user.model.js";
import ParentStudentRelation from "../models/parentStudentRelation.model.js";
import bcrypt from "bcryptjs";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/educare"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const createTestData = async () => {
  try {
    console.log("Creating test data...");

    // Create a test class first
    let testClass = await Class.findOne({ name: "Test Class A" });
    if (!testClass) {
      testClass = new Class({
        name: "Test Class A",
        description: "Test class for development",
        capacity: 20,
        ageGroup: "3-4 years",
        isActive: true,
        teachers: [],
      });
      await testClass.save();
      console.log("Test class created:", testClass._id);
    }

    // Create test students
    const testStudents = [
      {
        fullName: "John Doe",
        rollNum: 1001,
        birthdate: new Date("2020-05-15"),
        current_class: testClass._id,
        schedule: {
          time: "08:00 - 12:30",
          days: "Monday to Friday",
        },
        allergies: ["Peanuts"],
        likes: ["Drawing", "Playing"],
        additionalInfo: "Very active child",
        authorizedPhotos: true,
        contacts: [
          {
            relationship: "Mother",
            name: "Jane Doe",
            phone: "+1234567890",
          },
          {
            relationship: "Father",
            name: "Bob Doe",
            phone: "+1234567891",
          },
        ],
        active: true,
      },
      {
        fullName: "Alice Smith",
        rollNum: 1002,
        birthdate: new Date("2020-08-22"),
        current_class: testClass._id,
        schedule: {
          time: "08:00 - 12:30",
          days: "Monday to Friday",
        },
        allergies: [],
        likes: ["Reading", "Singing"],
        additionalInfo: "Loves books",
        authorizedPhotos: true,
        contacts: [
          {
            relationship: "Mother",
            name: "Sarah Smith",
            phone: "+1234567892",
          },
        ],
        active: true,
      },
    ];

    // Create students if they don't exist
    for (const studentData of testStudents) {
      let student = await Student.findOne({ rollNum: studentData.rollNum });
      if (!student) {
        student = new Student(studentData);
        await student.save();
        console.log(
          "Test student created:",
          student._id,
          "-",
          student.fullName
        );
      } else {
        console.log(
          "Student already exists:",
          student._id,
          "-",
          student.fullName
        );
      }
    }

    // Create test parent user
    let parentUser = await User.findOne({ email: "parent@test.com" });
    if (!parentUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      parentUser = new User({
        name: "Test Parent",
        email: "parent@test.com",
        password_hash: hashedPassword,
        role: "parent",
        is_active: true,
      });
      await parentUser.save();
      console.log("Test parent created:", parentUser._id);
    }

    // Create parent-student relationships
    const students = await Student.find({ rollNum: { $in: [1001, 1002] } });
    for (const student of students) {
      let relation = await ParentStudentRelation.findOne({
        parent_id: parentUser._id,
        student_id: student._id,
      });

      if (!relation) {
        relation = new ParentStudentRelation({
          parent_id: parentUser._id,
          student_id: student._id,
          relationship: "Parent",
          active: true,
        });
        await relation.save();
        console.log(
          "Parent-student relation created:",
          parentUser._id,
          "->",
          student._id
        );
      }
    }

    console.log("\n=== TEST DATA SUMMARY ===");
    console.log("Test Parent Login:");
    console.log("Email: parent@test.com");
    console.log("Password: password123");
    console.log("\nTest Students:");

    const allStudents = await Student.find({ rollNum: { $in: [1001, 1002] } });
    for (const student of allStudents) {
      console.log(
        `- ${student.fullName} (ID: ${student._id}, Roll: ${student.rollNum})`
      );
    }

    console.log("\nTest data creation completed!");
  } catch (error) {
    console.error("Error creating test data:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await createTestData();
};

main();
