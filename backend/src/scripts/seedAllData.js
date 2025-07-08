import mongoose from "mongoose";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import User from "../models/user.model.js";
import ParentStudentRelation from "../models/parentStudentRelation.model.js";
import Activity from "../models/activity.model.js";
import Post from "../models/post.model.js";
import Note from "../models/note.model.js";
import LostItem from "../models/lostItem.model.js";
import Fee from "../models/fee.model.js";
import Driver from "../models/driver.model.js";
import HealthMetric from "../models/healthMetric.model.js";
import HealthInfo from "../models/healthInfo.model.js";
import DocumentType from "../models/documentType.model.js";
import StudentDocument from "../models/studentDocument.model.js";
import bcrypt from "bcryptjs";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/educare_db");
    console.log("MongoDB connected to educare_db");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedAllData = async () => {
  try {
    console.log("🌱 Starting comprehensive data seeding...\n");

    // Create admin user
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      adminUser = new User({
        name: "Admin User",
        email: "admin@educare.com",
        password_hash: hashedPassword,
        role: "admin",
        is_active: true,
      });
      await adminUser.save();
      console.log("✅ Admin user created");
    }

    // Create teacher user
    let teacherUser = await User.findOne({ role: "teacher" });
    if (!teacherUser) {
      const hashedPassword = await bcrypt.hash("teacher123", 10);
      teacherUser = new User({
        name: "Maria Rodriguez",
        email: "teacher@educare.com",
        password_hash: hashedPassword,
        role: "teacher",
        is_active: true,
      });
      await teacherUser.save();
      console.log("✅ Teacher user created");
    }

    // Create parent user
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
      console.log("✅ Parent user created");
    }

    // Create test class
    let testClass = await Class.findOne({ name: "Red Class" });
    if (!testClass) {
      testClass = new Class({
        name: "Red Class",
        description: "Morning class for 3-4 year olds",
        capacity: 20,
        ageGroup: "3-4 years",
        isActive: true,
        teachers: [teacherUser._id],
      });
      await testClass.save();
      console.log("✅ Test class created");
    }

    // Create test students
    const studentsData = [
      {
        fullName: "John Alexander Doe",
        rollNum: 1001,
        birthdate: new Date("2020-05-15"),
        current_class: testClass._id,
        schedule: { time: "08:00 - 12:30", days: "Monday to Friday" },
        allergies: ["Peanuts", "Shellfish"],
        likes: ["Drawing", "Playing with blocks", "Story time"],
        additionalInfo: "Very active and social child. Loves helping others.",
        authorizedPhotos: true,
        contacts: [
          { relationship: "Mother", name: "Jane Doe", phone: "+1234567890" },
          { relationship: "Father", name: "Bob Doe", phone: "+1234567891" },
        ],
        active: true,
      },
      {
        fullName: "Alice Marie Smith",
        rollNum: 1002,
        birthdate: new Date("2020-08-22"),
        current_class: testClass._id,
        schedule: { time: "08:00 - 12:30", days: "Monday to Friday" },
        allergies: [],
        likes: ["Reading", "Singing", "Painting"],
        additionalInfo:
          "Quiet and thoughtful. Loves books and creative activities.",
        authorizedPhotos: true,
        contacts: [
          { relationship: "Mother", name: "Sarah Smith", phone: "+1234567892" },
          {
            relationship: "Grandmother",
            name: "Mary Smith",
            phone: "+1234567893",
          },
        ],
        active: true,
      },
    ];

    const students = [];
    for (const studentData of studentsData) {
      let student = await Student.findOne({ rollNum: studentData.rollNum });
      if (!student) {
        student = new Student(studentData);
        await student.save();
        console.log(`✅ Student created: ${student.fullName}`);
      }
      students.push(student);
    }

    // Create parent-student relationships
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
          `✅ Parent-student relation created for ${student.fullName}`
        );
      }
    }

    console.log("\n📚 Creating educational content...");

    // Create activities
    const activitiesData = [
      {
        title: "Art & Craft Session",
        description:
          "Creative painting and drawing activities for developing fine motor skills",
        date: new Date("2024-07-10T10:00:00Z"),
        audience: { type: "class", class_id: testClass._id },
        color: "#FF6B6B",
        createdBy: teacherUser._id,
      },
      {
        title: "Story Time",
        description:
          'Interactive storytelling session with "The Three Little Pigs"',
        date: new Date("2024-07-11T09:30:00Z"),
        audience: { type: "all" },
        color: "#4ECDC4",
        createdBy: teacherUser._id,
      },
      {
        title: "Music & Movement",
        description:
          "Dancing and singing activities to develop rhythm and coordination",
        date: new Date("2024-07-12T11:00:00Z"),
        audience: { type: "class", class_id: testClass._id },
        color: "#45B7D1",
        createdBy: teacherUser._id,
      },
      {
        title: "Individual Assessment - John",
        description: "One-on-one assessment for cognitive development",
        date: new Date("2024-07-15T14:00:00Z"),
        audience: { type: "student", student_id: students[0]._id },
        color: "#F7DC6F",
        createdBy: teacherUser._id,
      },
    ];

    for (const activityData of activitiesData) {
      const existingActivity = await Activity.findOne({
        title: activityData.title,
        date: activityData.date,
      });
      if (!existingActivity) {
        const activity = new Activity(activityData);
        await activity.save();
        console.log(`✅ Activity created: ${activity.title}`);
      }
    }

    // Create posts
    const postsData = [
      {
        title: "Welcome to Red Class!",
        content:
          "We are excited to start this new semester with your wonderful children. This week we will focus on getting to know each other and establishing our classroom routines.",
        audience: { type: "class", class_ids: [testClass._id] },
        teacherId: teacherUser._id,
        media: [],
      },
      {
        title: "Art Exhibition Next Week",
        content:
          "Our little artists have been working hard on their masterpieces! Join us next Friday for our mini art exhibition where each child will present their artwork.",
        audience: { type: "all" },
        teacherId: teacherUser._id,
        media: [],
      },
      {
        title: "John's Great Progress!",
        content:
          "John has shown remarkable improvement in his social skills this week. He has been helping his classmates and showing great leadership qualities.",
        audience: { type: "individual", student_ids: [students[0]._id] },
        teacherId: teacherUser._id,
        media: [],
      },
    ];

    for (const postData of postsData) {
      const existingPost = await Post.findOne({ title: postData.title });
      if (!existingPost) {
        const post = new Post(postData);
        await post.save();
        console.log(`✅ Post created: ${post.title}`);
      }
    }

    console.log("\n📝 Creating notes and observations...");

    // Create notes
    const notesData = [
      {
        student_id: students[0]._id,
        content:
          "John showed excellent sharing skills today during playtime. He voluntarily shared his toys with Alice and helped her build a tower with blocks.",
        createdBy: teacherUser._id,
      },
      {
        student_id: students[0]._id,
        content:
          "During art time, John demonstrated great creativity and focus. He spent 20 minutes working on his painting and was very proud of the result.",
        createdBy: teacherUser._id,
      },
      {
        student_id: students[1]._id,
        content:
          "Alice has been showing great progress in her verbal communication. She actively participated in our morning circle time and shared a story about her weekend.",
        createdBy: teacherUser._id,
      },
    ];

    for (const noteData of notesData) {
      const existingNote = await Note.findOne({
        student_id: noteData.student_id,
        content: noteData.content,
      });
      if (!existingNote) {
        const note = new Note(noteData);
        await note.save();
        console.log(`✅ Note created for student`);
      }
    }

    console.log("\n🔍 Creating lost items...");

    // Create lost items
    const lostItemsData = [
      {
        title: "Blue Water Bottle",
        description:
          "Small blue water bottle with dinosaur stickers found in playground area",
        dateFound: new Date("2024-07-08"),
        status: "unclaimed",
      },
      {
        title: "Red Sweater",
        description:
          "Red knitted sweater, size 4T, with a small bear embroidery found at classroom coat rack",
        dateFound: new Date("2024-07-09"),
        status: "unclaimed",
      },
      {
        title: "Toy Car",
        description: "Small yellow toy car, Hot Wheels brand found in art room",
        dateFound: new Date("2024-07-07"),
        status: "claimed",
        claimedBy: parentUser._id,
        claimedDate: new Date("2024-07-08"),
      },
    ];

    for (const itemData of lostItemsData) {
      const existingItem = await LostItem.findOne({
        title: itemData.title,
        dateFound: itemData.dateFound,
      });
      if (!existingItem) {
        const item = new LostItem(itemData);
        await item.save();
        console.log(`✅ Lost item created: ${item.title}`);
      }
    }

    console.log("\n💰 Creating fee records...");

    // Create fees
    const feesData = [
      {
        student_id: students[0]._id,
        title: "Monthly Tuition - July 2024",
        amount: 250.0,
        deadline: new Date("2024-07-01"),
        status: "paid",
        createdBy: adminUser._id,
      },
      {
        student_id: students[0]._id,
        title: "Lunch Program - July 2024",
        amount: 80.0,
        deadline: new Date("2024-07-01"),
        status: "paid",
        createdBy: adminUser._id,
      },
      {
        student_id: students[0]._id,
        title: "Art Supplies Fee",
        amount: 25.0,
        deadline: new Date("2024-07-15"),
        status: "pending",
        createdBy: adminUser._id,
      },
      {
        student_id: students[0]._id,
        title: "Monthly Tuition - August 2024",
        amount: 250.0,
        deadline: new Date("2024-08-01"),
        status: "pending",
        createdBy: adminUser._id,
      },
    ];

    for (const feeData of feesData) {
      const existingFee = await Fee.findOne({
        student_id: feeData.student_id,
        title: feeData.title,
      });
      if (!existingFee) {
        const fee = new Fee(feeData);
        await fee.save();
        console.log(`✅ Fee created: ${fee.title}`);
      }
    }

    console.log("\n🚌 Creating driver and transportation...");

    // Create driver
    const driverData = {
      name: "Carlos Martinez",
      phone: "+1234567899",
      email: "carlos.driver@educare.com",
      licenseNumber: "DL-2024-001",
      vehicle: {
        make: "Toyota",
        model: "Hiace",
        year: 2022,
        plateNumber: "EDU-001",
        color: "Yellow",
        capacity: 15,
      },
      route: {
        name: "North Route",
        description: "Covers northern residential areas",
        stops: [
          {
            name: "Maple Street",
            address: "123 Maple Street",
            estimatedTime: "07:45 AM",
            order: 1,
          },
          {
            name: "Oak Avenue",
            address: "456 Oak Avenue",
            estimatedTime: "07:55 AM",
            order: 2,
          },
          {
            name: "EduCare Center",
            address: "789 Education Blvd",
            estimatedTime: "08:15 AM",
            order: 3,
          },
        ],
      },
      schedule: {
        pickupTime: "07:30 AM",
        dropoffTime: "12:45 PM",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      assignedStudents: [
        {
          student_id: students[0]._id,
          pickupStop: "Maple Street",
          dropoffStop: "Maple Street",
          active: true,
          assignedDate: new Date(),
        },
      ],
      emergencyContact: {
        name: "Transportation Supervisor",
        phone: "+1234567898",
        relationship: "Supervisor",
      },
      status: "active",
      notes: "Experienced driver with 5+ years in child transportation",
      createdBy: adminUser._id,
      updatedBy: adminUser._id,
    };

    const existingDriver = await Driver.findOne({
      licenseNumber: driverData.licenseNumber,
    });
    if (!existingDriver) {
      const driver = new Driver(driverData);
      await driver.save();
      console.log(`✅ Driver created: ${driver.name}`);
    }

    console.log("\n🏥 Health data already created from previous script");
    console.log("📄 Document data already created from previous script");

    console.log("\n🎉 Data seeding completed successfully!");
    console.log("\n📊 Summary of created data:");
    console.log("- Users: Admin, Teacher, Parent");
    console.log("- Students: John Doe, Alice Smith");
    console.log("- Class: Red Class");
    console.log("- Activities: 4 activities with different audiences");
    console.log("- Posts: 3 posts (class, all, individual)");
    console.log("- Notes: 3 teacher observations");
    console.log("- Lost Items: 3 items (found, claimed)");
    console.log("- Fees: 4 fee records (paid, pending)");
    console.log("- Driver: 1 driver with route and student assignment");
    console.log("- Health: Metrics and medical info");
    console.log("- Documents: Document types and submissions");

    console.log("\n🔑 Login Credentials:");
    console.log("Parent: parent@test.com / password123");
    console.log("Teacher: teacher@educare.com / teacher123");
    console.log("Admin: admin@educare.com / admin123");

    console.log("\n👶 Student IDs for testing:");
    console.log(`John Doe: ${students[0]._id}`);
    console.log(`Alice Smith: ${students[1]._id}`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await seedAllData();
};

main();
