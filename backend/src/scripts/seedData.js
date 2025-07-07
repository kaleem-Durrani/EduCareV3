import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import User from "../models/user.model.js";
import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import ParentStudentRelation from "../models/parentStudentRelation.model.js";
import WeeklyMenu from "../models/weeklyMenu.model.js";
import { connectDB, disconnectDB } from "../db/connection.js";

config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/educare_db";

// Sample data
const teachersData = [
  {
    name: "Maria Rodriguez",
    email: "maria.rodriguez@educare.com",
    phone: "+59163090901",
    address: "Av. Principal 123, Santa Cruz",
    password: "teacher123",
  },
  {
    name: "Carlos Mendoza",
    email: "carlos.mendoza@educare.com",
    phone: "+59163090902",
    address: "Calle Secundaria 456, Santa Cruz",
    password: "teacher123",
  },
  {
    name: "Ana Gutierrez",
    email: "ana.gutierrez@educare.com",
    phone: "+59163090903",
    address: "Zona Norte 789, Santa Cruz",
    password: "teacher123",
  },
  {
    name: "Luis Fernandez",
    email: "luis.fernandez@educare.com",
    phone: "+59163090904",
    address: "Barrio Central 321, Santa Cruz",
    password: "teacher123",
  },
];

const classesData = [
  {
    name: "Red Class",
    description:
      "Class for 3-4 year olds focusing on basic motor skills and social interaction",
    grade: "Pre-K",
    section: "A",
    academic_year: "2024",
  },
  {
    name: "Blue Class",
    description:
      "Class for 4-5 year olds with emphasis on pre-reading and math concepts",
    grade: "Pre-K",
    section: "B",
    academic_year: "2024",
  },
  {
    name: "Green Class",
    description: "Class for 5-6 year olds preparing for primary education",
    grade: "Kindergarten",
    section: "A",
    academic_year: "2024",
  },
  {
    name: "Yellow Class",
    description: "Mixed age group for advanced learners and special activities",
    grade: "Mixed",
    section: "Special",
    academic_year: "2024",
  },
];

const parentsData = [
  {
    name: "Roberto Silva",
    email: "roberto.silva@gmail.com",
    phone: "+59163090905",
    address: "Zona Este 111, Santa Cruz",
    password: "parent123",
  },
  {
    name: "Carmen Lopez",
    email: "carmen.lopez@gmail.com",
    phone: "+59163090906",
    address: "Zona Oeste 222, Santa Cruz",
    password: "parent123",
  },
  {
    name: "Diego Morales",
    email: "diego.morales@gmail.com",
    phone: "+59163090907",
    address: "Zona Sur 333, Santa Cruz",
    password: "parent123",
  },
  {
    name: "Patricia Vega",
    email: "patricia.vega@gmail.com",
    phone: "+59163090908",
    address: "Zona Norte 444, Santa Cruz",
    password: "parent123",
  },
];

const menuData = [
  {
    title: "Weekly Menu - Week 1",
    description: "Nutritious and delicious meals for our little ones",
    startDate: new Date("2024-01-08"), // Monday
    endDate: new Date("2024-01-12"), // Friday
    status: "active",
    isActive: true,
    menuData: [
      {
        day: "Monday",
        items: [
          "Spaghetti Bolognese",
          "Mixed Salad",
          "Fresh Fruit",
          "Whole Milk",
        ],
      },
      {
        day: "Tuesday",
        items: [
          "Chicken Rice Bowl",
          "Steamed Vegetables",
          "Yogurt",
          "Apple Juice",
        ],
      },
      {
        day: "Wednesday",
        items: ["Fish Tacos", "Black Beans", "Corn Salad", "Water"],
      },
      {
        day: "Thursday",
        items: [
          "Beef Stew",
          "Mashed Potatoes",
          "Green Beans",
          "Chocolate Milk",
        ],
      },
      {
        day: "Friday",
        items: ["Pizza Day", "Caesar Salad", "Fruit Cup", "Lemonade"],
      },
    ],
  },
  {
    title: "Weekly Menu - Week 2",
    description: "Variety of healthy options for growing children",
    startDate: new Date("2024-01-15"), // Monday
    endDate: new Date("2024-01-19"), // Friday
    status: "draft",
    isActive: false,
    menuData: [
      {
        day: "Monday",
        items: ["Grilled Chicken", "Rice Pilaf", "Broccoli", "Orange Juice"],
      },
      {
        day: "Tuesday",
        items: [
          "Turkey Sandwich",
          "Sweet Potato Fries",
          "Cucumber Slices",
          "Milk",
        ],
      },
      {
        day: "Wednesday",
        items: [
          "Vegetable Soup",
          "Grilled Cheese",
          "Carrot Sticks",
          "Apple Juice",
        ],
      },
      {
        day: "Thursday",
        items: ["Baked Salmon", "Quinoa", "Roasted Vegetables", "Water"],
      },
      {
        day: "Friday",
        items: ["Hamburger", "Baked Beans", "Coleslaw", "Fruit Smoothie"],
      },
    ],
  },
];

const studentsData = [
  {
    fullName: "Sofia Silva Rodriguez",
    birthdate: "2020-03-15",
    allergies: ["Nuts", "Dairy"],
    likes: ["Drawing", "Music", "Playing with blocks"],
    additionalInfo: "Very creative and loves art activities",
    authorizedPhotos: true,
    schedule: { time: "08:00 - 12:30", days: "Monday to Friday" },
    contacts: [
      { relationship: "Mom", name: "Maria Silva", phone: "+59163090910" },
      { relationship: "Dad", name: "Roberto Silva", phone: "+59163090905" },
    ],
  },
  {
    fullName: "Carlos Lopez Mendoza",
    birthdate: "2019-07-22",
    allergies: [],
    likes: ["Soccer", "Cars", "Building with Legos"],
    additionalInfo: "Very active and loves outdoor activities",
    authorizedPhotos: true,
    schedule: { time: "08:00 - 12:30", days: "Monday to Friday" },
    contacts: [
      { relationship: "Mom", name: "Carmen Lopez", phone: "+59163090906" },
      { relationship: "Dad", name: "Juan Lopez", phone: "+59163090911" },
    ],
  },
  {
    fullName: "Isabella Morales Vega",
    birthdate: "2020-11-08",
    allergies: ["Peanuts"],
    likes: ["Reading", "Puzzles", "Dancing"],
    additionalInfo: "Quiet and thoughtful, enjoys books",
    authorizedPhotos: false,
    schedule: { time: "08:00 - 12:30", days: "Monday to Friday" },
    contacts: [
      { relationship: "Mom", name: "Patricia Vega", phone: "+59163090908" },
      { relationship: "Dad", name: "Diego Morales", phone: "+59163090907" },
    ],
  },
  {
    fullName: "Mateo Fernandez Castro",
    birthdate: "2019-05-12",
    allergies: ["Shellfish"],
    likes: ["Painting", "Singing", "Playing with friends"],
    additionalInfo: "Social and outgoing, natural leader",
    authorizedPhotos: true,
    schedule: { time: "08:00 - 12:30", days: "Monday to Friday" },
    contacts: [
      { relationship: "Mom", name: "Ana Castro", phone: "+59163090912" },
      { relationship: "Dad", name: "Luis Fernandez", phone: "+59163090904" },
    ],
  },
  {
    fullName: "Valentina Rodriguez Gutierrez",
    birthdate: "2020-09-03",
    allergies: [],
    likes: ["Animals", "Nature", "Coloring"],
    additionalInfo: "Loves animals and nature activities",
    authorizedPhotos: true,
    schedule: { time: "08:00 - 12:30", days: "Monday to Friday" },
    contacts: [
      { relationship: "Mom", name: "Ana Gutierrez", phone: "+59163090903" },
      { relationship: "Dad", name: "Miguel Rodriguez", phone: "+59163090913" },
    ],
  },
  {
    fullName: "Sebastian Mendoza Silva",
    birthdate: "2019-12-18",
    allergies: ["Eggs"],
    likes: ["Trucks", "Construction", "Sandbox play"],
    additionalInfo: "Fascinated by construction and building",
    authorizedPhotos: true,
    schedule: { time: "08:00 - 12:30", days: "Monday to Friday" },
    contacts: [
      { relationship: "Mom", name: "Lucia Silva", phone: "+59163090914" },
      { relationship: "Dad", name: "Carlos Mendoza", phone: "+59163090902" },
    ],
  },
];

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function createUsers(userData, role) {
  const users = [];

  for (const user of userData) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      console.log(
        `⚠️  ${role} ${user.name} (${user.email}) already exists, skipping...`
      );
      users.push(existingUser);
      continue;
    }

    const hashedPassword = await hashPassword(user.password);

    const newUser = new User({
      email: user.email,
      password_hash: hashedPassword,
      role: role,
      name: user.name,
      phone: user.phone,
      address: user.address,
      is_active: true,
    });

    await newUser.save();
    users.push(newUser);
    console.log(`✅ Created ${role}: ${user.name} (${user.email})`);
  }

  return users;
}

async function createClasses(classesData, teachers, adminUser) {
  const classes = [];

  for (let i = 0; i < classesData.length; i++) {
    const classData = classesData[i];
    const assignedTeacher = teachers[i % teachers.length]; // Distribute teachers across classes

    // Check if class already exists
    const existingClass = await Class.findOne({
      name: classData.name,
      isActive: true,
    });

    if (existingClass) {
      console.log(`⚠️  Class ${classData.name} already exists, skipping...`);
      classes.push(existingClass);
      continue;
    }

    const newClass = new Class({
      name: classData.name,
      description: classData.description,
      grade: classData.grade,
      section: classData.section,
      academic_year: classData.academic_year,
      teachers: [assignedTeacher._id],
      students: [],
      createdBy: adminUser._id,
      updatedBy: adminUser._id,
      isActive: true,
    });

    await newClass.save();
    classes.push(newClass);
    console.log(
      `✅ Created class: ${classData.name} (Teacher: ${assignedTeacher.name})`
    );
  }

  return classes;
}

async function createStudents(studentsData) {
  const students = [];

  // Find the highest existing roll number
  const lastStudent = await Student.findOne({}, {}, { sort: { rollNum: -1 } });
  let rollNumCounter = lastStudent ? lastStudent.rollNum + 1 : 1001;

  console.log(`📝 Starting roll number from: ${rollNumCounter}`);

  for (const studentData of studentsData) {
    // Check if student already exists
    const existingStudent = await Student.findOne({
      fullName: studentData.fullName,
    });

    if (existingStudent) {
      console.log(
        `⚠️  Student ${studentData.fullName} already exists, skipping...`
      );
      students.push(existingStudent);
      continue;
    }

    const newStudent = new Student({
      fullName: studentData.fullName,
      rollNum: rollNumCounter++,
      birthdate: new Date(studentData.birthdate),
      allergies: studentData.allergies,
      likes: studentData.likes,
      additionalInfo: studentData.additionalInfo,
      authorizedPhotos: studentData.authorizedPhotos,
      schedule: studentData.schedule,
      contacts: studentData.contacts,
      active: true,
    });

    await newStudent.save();
    students.push(newStudent);
    console.log(
      `✅ Created student: ${studentData.fullName} (Roll #${newStudent.rollNum})`
    );
  }

  return students;
}

async function assignStudentsToClasses() {
  // Get all existing students
  const students = await Student.find({ active: true });
  const classes = await Class.find({ isActive: true });

  if (students.length === 0) {
    console.log("⚠️  No students found to assign to classes");
    return;
  }

  if (classes.length === 0) {
    console.log("⚠️  No classes found to assign students to");
    return;
  }

  console.log(
    `📚 Found ${students.length} students and ${classes.length} classes`
  );

  // Distribute students evenly across classes
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const targetClass = classes[i % classes.length];

    // Update student's current_class
    student.current_class = targetClass._id;
    await student.save();

    // Add student to class if not already there
    if (!targetClass.students.includes(student._id)) {
      targetClass.students.push(student._id);
      await targetClass.save();
    }

    console.log(`✅ Assigned ${student.fullName} to ${targetClass.name}`);
  }
}

async function createParentStudentRelations() {
  const parents = await User.find({ role: "parent" });
  const students = await Student.find({ active: true });

  if (parents.length === 0 || students.length === 0) {
    console.log("⚠️  No parents or students found for creating relationships");
    return;
  }

  console.log(`👨‍👩‍👧‍👦 Creating parent-student relationships...`);

  // Create relationships based on matching names/contacts
  const relationships = [
    {
      parentEmail: "roberto.silva@gmail.com",
      studentName: "Sofia Silva Rodriguez",
      relationship: "Father",
    },
    {
      parentEmail: "carmen.lopez@gmail.com",
      studentName: "Carlos Lopez Mendoza",
      relationship: "Mother",
    },
    {
      parentEmail: "patricia.vega@gmail.com",
      studentName: "Isabella Morales Vega",
      relationship: "Mother",
    },
    {
      parentEmail: "diego.morales@gmail.com",
      studentName: "Isabella Morales Vega",
      relationship: "Father",
    },
    {
      parentEmail: "luis.fernandez@educare.com",
      studentName: "Mateo Fernandez Castro",
      relationship: "Father",
    },
    {
      parentEmail: "ana.gutierrez@educare.com",
      studentName: "Valentina Rodriguez Gutierrez",
      relationship: "Mother",
    },
    {
      parentEmail: "carlos.mendoza@educare.com",
      studentName: "Sebastian Mendoza Silva",
      relationship: "Father",
    },
  ];

  for (const rel of relationships) {
    const parent = await User.findOne({ email: rel.parentEmail });
    const student = await Student.findOne({ fullName: rel.studentName });

    if (!parent || !student) {
      console.log(
        `⚠️  Could not find parent ${rel.parentEmail} or student ${rel.studentName}`
      );
      continue;
    }

    // Check if relationship already exists
    const existingRelation = await ParentStudentRelation.findOne({
      parent_id: parent._id,
      student_id: student._id,
    });

    if (existingRelation) {
      console.log(
        `⚠️  Relationship between ${parent.name} and ${student.fullName} already exists`
      );
      continue;
    }

    const newRelation = new ParentStudentRelation({
      parent_id: parent._id,
      student_id: student._id,
      relationshipType: rel.relationship,
      active: true,
    });

    await newRelation.save();
    console.log(
      `✅ Created relationship: ${parent.name} (${rel.relationship}) -> ${student.fullName}`
    );
  }
}

async function createMenus(menuData, adminUser) {
  const menus = [];

  for (const menu of menuData) {
    // Check if menu already exists
    const existingMenu = await WeeklyMenu.findOne({
      title: menu.title,
    });

    if (existingMenu) {
      console.log(`⚠️  Menu "${menu.title}" already exists, skipping...`);
      menus.push(existingMenu);
      continue;
    }

    const newMenu = new WeeklyMenu({
      title: menu.title,
      description: menu.description,
      startDate: menu.startDate,
      endDate: menu.endDate,
      status: menu.status,
      menuData: menu.menuData,
      isActive: menu.isActive,
      createdBy: adminUser._id,
      updatedBy: adminUser._id,
    });

    await newMenu.save();
    menus.push(newMenu);
    console.log(`✅ Created menu: ${menu.title}`);
  }

  return menus;
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB(MONGO_URI);

    // Check if admin user exists
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("⚠️  No admin user found. Creating default admin...");
      const hashedPassword = await hashPassword("admin123");
      adminUser = new User({
        email: "admin@educare.com",
        password_hash: hashedPassword,
        role: "admin",
        name: "System Administrator",
        phone: "+59163090900",
        address: "Centro Infantil EDUCARE",
        is_active: true,
      });
      await adminUser.save();
      console.log(
        "✅ Created admin user: admin@educare.com (password: admin123)"
      );
    }

    // Create teachers
    console.log("\n👨‍🏫 Creating teachers...");
    const teachers = await createUsers(teachersData, "teacher");

    // Create parents
    console.log("\n👨‍👩‍👧‍👦 Creating parents...");
    const parents = await createUsers(parentsData, "parent");

    // Create classes and assign teachers
    console.log("\n🏫 Creating classes...");
    const classes = await createClasses(classesData, teachers, adminUser);

    // Create students if none exist
    console.log("\n👶 Creating students...");
    const students = await createStudents(studentsData);

    // Assign students to classes
    console.log("\n📚 Assigning students to classes...");
    await assignStudentsToClasses();

    // Create parent-student relationships
    console.log("\n👨‍👩‍👧‍👦 Creating parent-student relationships...");
    await createParentStudentRelations();

    // Create weekly menus
    console.log("\n🍽️ Creating weekly menus...");
    const menus = await createMenus(menuData, adminUser);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   • ${teachers.length} teachers created`);
    console.log(`   • ${parents.length} parents created`);
    console.log(`   • ${classes.length} classes created`);
    console.log(`   • ${students.length} students created/found`);
    console.log(`   • ${menus.length} weekly menus created`);
    console.log(`   • Students assigned to classes`);
    console.log(`   • Parent-student relationships created`);

    console.log("\n🔑 Login credentials:");
    console.log("   Admin: admin@educare.com / admin123");
    console.log("   Teachers: [name]@educare.com / teacher123");
    console.log("   Parents: [name]@gmail.com / parent123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await disconnectDB();
  }
}

// Run the seeding script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
