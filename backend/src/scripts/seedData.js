import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import User from "../models/user.model.js";
import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import ParentStudentRelation from "../models/parentStudentRelation.model.js";
import WeeklyMenu from "../models/weeklyMenu.model.js";
import WeeklyReport from "../models/weeklyReport.model.js";
import MonthlyPlan from "../models/monthlyPlan.model.js";
import BoxItem from "../models/boxItem.model.js";
import StudentBoxStatus from "../models/studentBoxStatus.model.js";
import DocumentType from "../models/documentType.model.js";
import StudentDocument from "../models/studentDocument.model.js";
import Activity from "../models/activity.model.js";
import Post from "../models/post.model.js";
import Note from "../models/note.model.js";
import LostItem from "../models/lostItem.model.js";
import HealthInfo from "../models/healthInfo.model.js";
import HealthMetric from "../models/healthMetric.model.js";
import Fee from "../models/fee.model.js";
import FeeTransaction from "../models/feeTransaction.model.js";
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

// Box Items Data (My Box)
const boxItemsData = [
  {
    name: "Diapers",
    description: "Clean diapers for daily use",
    defaultInStock: true,
  },
  {
    name: "Wipes",
    description: "Baby wipes for cleaning",
    defaultInStock: true,
  },
  {
    name: "Extra Clothes",
    description: "Change of clothes",
    defaultInStock: false,
  },
  {
    name: "Blanket",
    description: "Comfort blanket for nap time",
    defaultInStock: false,
  },
  {
    name: "Pacifier",
    description: "Pacifier for comfort",
    defaultInStock: false,
  },
  { name: "Bottle", description: "Water or milk bottle", defaultInStock: true },
  { name: "Snacks", description: "Healthy snacks", defaultInStock: false },
  {
    name: "Toys",
    description: "Personal toys from home",
    defaultInStock: false,
  },
  {
    name: "Sunscreen",
    description: "Sun protection cream",
    defaultInStock: false,
  },
  {
    name: "Hat",
    description: "Sun hat for outdoor activities",
    defaultInStock: false,
  },
];

// Document Types Data (My Documents)
const documentTypesData = [
  {
    name: "Birth Certificate",
    description: "Official birth certificate",
    required: true,
  },
  {
    name: "Medical Records",
    description: "Complete medical history",
    required: true,
  },
  {
    name: "Vaccination Card",
    description: "Immunization records",
    required: true,
  },
  {
    name: "Emergency Contact Form",
    description: "Emergency contact information",
    required: true,
  },
  {
    name: "Photo Authorization",
    description: "Permission for photos/videos",
    required: false,
  },
  {
    name: "Allergy Information",
    description: "Detailed allergy information",
    required: false,
  },
  {
    name: "Insurance Card",
    description: "Health insurance information",
    required: false,
  },
  {
    name: "Parent ID Copy",
    description: "Copy of parent identification",
    required: true,
  },
];

// Activities Data
const activitiesData = [
  {
    title: "Art & Craft Day",
    description: "Creative art activities with painting and crafts",
    date: new Date("2024-02-15"),
    color: "#FF6B6B",
  },
  {
    title: "Music & Movement",
    description: "Musical activities and dance for motor skills",
    date: new Date("2024-02-20"),
    color: "#4ECDC4",
  },
  {
    title: "Story Time",
    description: "Interactive storytelling session",
    date: new Date("2024-02-22"),
    color: "#45B7D1",
  },
  {
    title: "Outdoor Play",
    description: "Garden activities and outdoor exploration",
    date: new Date("2024-02-25"),
    color: "#96CEB4",
  },
  {
    title: "Science Discovery",
    description: "Simple science experiments for kids",
    date: new Date("2024-02-28"),
    color: "#FFEAA7",
  },
  {
    title: "Cooking Class",
    description: "Simple cooking activities with healthy foods",
    date: new Date("2024-03-05"),
    color: "#DDA0DD",
  },
];

// Lost Items Data
const lostItemsData = [
  {
    title: "Blue Water Bottle",
    description: "Small blue water bottle with cartoon characters",
    dateFound: new Date("2024-01-15"),
    status: "unclaimed",
  },
  {
    title: "Red Sweater",
    description: "Red knitted sweater, size 3T",
    dateFound: new Date("2024-01-18"),
    status: "unclaimed",
  },
  {
    title: "Teddy Bear",
    description: "Brown teddy bear with blue ribbon",
    dateFound: new Date("2024-01-20"),
    status: "claimed",
    claimedDate: new Date("2024-01-22"),
  },
  {
    title: "Lunch Box",
    description: "Green lunch box with superhero design",
    dateFound: new Date("2024-01-25"),
    status: "unclaimed",
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

// Create Box Items
async function createBoxItems(boxItemsData, adminUser) {
  const boxItems = [];

  for (const item of boxItemsData) {
    const existingItem = await BoxItem.findOne({ name: item.name });

    if (existingItem) {
      console.log(`⚠️  Box item "${item.name}" already exists, skipping...`);
      boxItems.push(existingItem);
      continue;
    }

    const newItem = new BoxItem({
      name: item.name,
      description: item.description,
      defaultInStock: item.defaultInStock,
      createdBy: adminUser._id,
    });

    await newItem.save();
    boxItems.push(newItem);
    console.log(`✅ Created box item: ${item.name}`);
  }

  return boxItems;
}

// Create Document Types
async function createDocumentTypes(documentTypesData, adminUser) {
  const documentTypes = [];

  for (const docType of documentTypesData) {
    const existingDocType = await DocumentType.findOne({ name: docType.name });

    if (existingDocType) {
      console.log(
        `⚠️  Document type "${docType.name}" already exists, skipping...`
      );
      documentTypes.push(existingDocType);
      continue;
    }

    const newDocType = new DocumentType({
      name: docType.name,
      description: docType.description,
      required: docType.required,
      createdBy: adminUser._id,
    });

    await newDocType.save();
    documentTypes.push(newDocType);
    console.log(`✅ Created document type: ${docType.name}`);
  }

  return documentTypes;
}

// Create Activities
async function createActivities(activitiesData, adminUser) {
  const activities = [];

  for (const activity of activitiesData) {
    const existingActivity = await Activity.findOne({
      title: activity.title,
      date: activity.date,
    });

    if (existingActivity) {
      console.log(
        `⚠️  Activity "${
          activity.title
        }" on ${activity.date.toDateString()} already exists, skipping...`
      );
      activities.push(existingActivity);
      continue;
    }

    const newActivity = new Activity({
      title: activity.title,
      description: activity.description,
      date: activity.date,
      color: activity.color,
      createdBy: adminUser._id,
    });

    await newActivity.save();
    activities.push(newActivity);
    console.log(
      `✅ Created activity: ${
        activity.title
      } on ${activity.date.toDateString()}`
    );
  }

  return activities;
}

// Create Lost Items
async function createLostItems(lostItemsData) {
  const lostItems = [];

  for (const item of lostItemsData) {
    const existingItem = await LostItem.findOne({
      title: item.title,
      dateFound: item.dateFound,
    });

    if (existingItem) {
      console.log(
        `⚠️  Lost item "${
          item.title
        }" found on ${item.dateFound.toDateString()} already exists, skipping...`
      );
      lostItems.push(existingItem);
      continue;
    }

    const newItem = new LostItem({
      title: item.title,
      description: item.description,
      dateFound: item.dateFound,
      status: item.status,
      claimedDate: item.claimedDate,
    });

    await newItem.save();
    lostItems.push(newItem);
    console.log(`✅ Created lost item: ${item.title}`);
  }

  return lostItems;
}

// Create Weekly Reports
async function createWeeklyReports(students, teachers) {
  const weeklyReports = [];

  // Create sample weekly reports for the first few students
  const sampleStudents = students.slice(0, 3);
  const teacher = teachers[0]; // Use first teacher

  for (const student of sampleStudents) {
    // Create a report for last week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 4); // Friday
    weekEnd.setHours(23, 59, 59, 999);

    const existingReport = await WeeklyReport.findOne({
      student_id: student._id,
      weekStart: weekStart,
    });

    if (existingReport) {
      console.log(
        `⚠️  Weekly report for ${student.fullName} already exists, skipping...`
      );
      weeklyReports.push(existingReport);
      continue;
    }

    const dailyReports = [
      {
        day: "M",
        toilet: "Good",
        food_intake: "Excellent",
        friends_interaction: "Very social",
        studies_mood: "Happy",
      },
      {
        day: "T",
        toilet: "Good",
        food_intake: "Good",
        friends_interaction: "Played well",
        studies_mood: "Focused",
      },
      {
        day: "W",
        toilet: "Excellent",
        food_intake: "Excellent",
        friends_interaction: "Helpful",
        studies_mood: "Excited",
      },
      {
        day: "Th",
        toilet: "Good",
        food_intake: "Fair",
        friends_interaction: "Shy today",
        studies_mood: "Calm",
      },
      {
        day: "F",
        toilet: "Excellent",
        food_intake: "Good",
        friends_interaction: "Very active",
        studies_mood: "Joyful",
      },
    ];

    const newReport = new WeeklyReport({
      student_id: student._id,
      weekStart: weekStart,
      weekEnd: weekEnd,
      dailyReports: dailyReports,
      createdBy: teacher._id,
      updatedBy: teacher._id,
    });

    await newReport.save();
    weeklyReports.push(newReport);
    console.log(`✅ Created weekly report for: ${student.fullName}`);
  }

  return weeklyReports;
}

// Create Monthly Plans
async function createMonthlyPlans(classes, teachers) {
  const monthlyPlans = [];

  for (const classObj of classes) {
    const teacher = teachers[0]; // Use first teacher

    // Create plan for current month
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const existingPlan = await MonthlyPlan.findOne({
      month: month,
      year: year,
      class_id: classObj._id,
    });

    if (existingPlan) {
      console.log(
        `⚠️  Monthly plan for ${classObj.name} (${month}/${year}) already exists, skipping...`
      );
      monthlyPlans.push(existingPlan);
      continue;
    }

    const description = `This month we will focus on developing creativity, social skills, and basic learning concepts. Activities include art projects, music sessions, outdoor play, and interactive storytelling. We aim to create a nurturing environment where children can explore, learn, and grow together.`;

    const newPlan = new MonthlyPlan({
      month: month,
      year: year,
      class_id: classObj._id,
      description: description,
      createdBy: teacher._id,
      updatedBy: teacher._id,
    });

    await newPlan.save();
    monthlyPlans.push(newPlan);
    console.log(
      `✅ Created monthly plan for: ${classObj.name} (${month}/${year})`
    );
  }

  return monthlyPlans;
}

// Create Wall Posts
async function createWallPosts(teachers, classes) {
  const posts = [];

  const samplePosts = [
    {
      title: "Welcome to Our Classroom!",
      content:
        "We're excited to start this new journey with your children. Our classroom is ready with fun activities and learning opportunities!",
    },
    {
      title: "Art Day Success!",
      content:
        "Today the children created beautiful paintings! They showed amazing creativity and had so much fun expressing themselves through art.",
    },
    {
      title: "Outdoor Play Time",
      content:
        "Beautiful weather today! The children enjoyed playing in the garden, running around, and exploring nature. Fresh air and exercise are so important for their development.",
    },
  ];

  for (let i = 0; i < samplePosts.length; i++) {
    const postData = samplePosts[i];
    const teacher = teachers[i % teachers.length];

    const existingPost = await Post.findOne({
      title: postData.title,
      teacherId: teacher._id,
    });

    if (existingPost) {
      console.log(`⚠️  Post "${postData.title}" already exists, skipping...`);
      posts.push(existingPost);
      continue;
    }

    const newPost = new Post({
      title: postData.title,
      content: postData.content,
      media: [],
      teacherId: teacher._id,
      audience: {
        type: "all",
        class_ids: classes.map((c) => c._id),
        student_ids: [],
      },
      createdBy: teacher._id,
    });

    await newPost.save();
    posts.push(newPost);
    console.log(`✅ Created wall post: ${postData.title}`);
  }

  return posts;
}

// Create Notes
async function createNotes(students, teachers) {
  const notes = [];

  const sampleNotes = [
    "Great progress in art activities today! Shows excellent creativity.",
    "Very social child, plays well with others during group activities.",
    "Needs encouragement with sharing toys, but improving daily.",
    "Excellent appetite at lunch time, tried new foods today.",
    "Loves story time and asks thoughtful questions about the books.",
  ];

  // Create notes for first few students
  const sampleStudents = students.slice(0, 3);

  for (const student of sampleStudents) {
    const teacher = teachers[0];
    const noteContent =
      sampleNotes[Math.floor(Math.random() * sampleNotes.length)];

    const existingNote = await Note.findOne({
      student_id: student._id,
      content: noteContent,
    });

    if (existingNote) {
      console.log(
        `⚠️  Note for ${student.fullName} already exists, skipping...`
      );
      notes.push(existingNote);
      continue;
    }

    const newNote = new Note({
      student_id: student._id,
      content: noteContent,
      createdBy: teacher._id,
      updatedBy: teacher._id,
    });

    await newNote.save();
    notes.push(newNote);
    console.log(`✅ Created note for: ${student.fullName}`);
  }

  return notes;
}

// Create Health Info and Metrics
async function createHealthData(students, adminUser) {
  const healthInfos = [];
  const healthMetrics = [];

  const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

  // Create health info for first few students
  const sampleStudents = students.slice(0, 3);

  for (const student of sampleStudents) {
    // Create health info
    const existingHealthInfo = await HealthInfo.findOne({
      student_id: student._id,
    });

    if (!existingHealthInfo) {
      const newHealthInfo = new HealthInfo({
        student_id: student._id,
        blood_group:
          bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
        allergy: student.allergies.join(", ") || "None",
        eye_condition: "Normal",
        heart_rate: "Normal (80-120 bpm)",
        ear_condition: "Normal",
        updatedBy: adminUser._id,
      });

      await newHealthInfo.save();
      healthInfos.push(newHealthInfo);
      console.log(`✅ Created health info for: ${student.fullName}`);
    }

    // Create health metrics (height and weight)
    const existingHeightMetric = await HealthMetric.findOne({
      student_id: student._id,
      type: "height",
    });

    if (!existingHeightMetric) {
      const heightMetric = new HealthMetric({
        student_id: student._id,
        type: "height",
        value: Math.floor(Math.random() * 20) + 80, // 80-100 cm
        label: "Current",
        date: new Date(),
        notes: "Regular growth check",
        recordedBy: adminUser._id,
      });

      await heightMetric.save();
      healthMetrics.push(heightMetric);
    }

    const existingWeightMetric = await HealthMetric.findOne({
      student_id: student._id,
      type: "weight",
    });

    if (!existingWeightMetric) {
      const weightMetric = new HealthMetric({
        student_id: student._id,
        type: "weight",
        value: Math.floor(Math.random() * 5) + 12, // 12-17 kg
        label: "Current",
        date: new Date(),
        notes: "Regular growth check",
        recordedBy: adminUser._id,
      });

      await weightMetric.save();
      healthMetrics.push(weightMetric);
    }
  }

  return { healthInfos, healthMetrics };
}

// Create Fees and Payments
async function createPaymentData(students, adminUser) {
  const fees = [];
  const transactions = [];

  const feeTypes = [
    { title: "Monthly Tuition", amount: 500 },
    { title: "Activity Fee", amount: 100 },
    { title: "Lunch Program", amount: 200 },
    { title: "Transportation", amount: 150 },
  ];

  // Create fees for first few students
  const sampleStudents = students.slice(0, 3);

  for (const student of sampleStudents) {
    for (const feeType of feeTypes) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30); // Due in 30 days

      const existingFee = await Fee.findOne({
        student_id: student._id,
        title: feeType.title,
      });

      if (existingFee) {
        console.log(
          `⚠️  Fee "${feeType.title}" for ${student.fullName} already exists, skipping...`
        );
        fees.push(existingFee);
        continue;
      }

      const newFee = new Fee({
        student_id: student._id,
        title: feeType.title,
        amount: feeType.amount,
        deadline: deadline,
        status: Math.random() > 0.5 ? "paid" : "pending", // Random status
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
      });

      await newFee.save();
      fees.push(newFee);
      console.log(`✅ Created fee: ${feeType.title} for ${student.fullName}`);

      // Create transaction if fee is paid
      if (newFee.status === "paid") {
        const transaction = new FeeTransaction({
          fee_id: newFee._id,
          student_id: student._id,
          amount: newFee.amount,
          transactionDate: new Date(),
          paymentMethod: "Cash",
          processedBy: adminUser._id,
        });

        await transaction.save();
        transactions.push(transaction);
        console.log(`✅ Created payment transaction for: ${feeType.title}`);
      }
    }
  }

  return { fees, transactions };
}

// Create Student Box Status
async function createStudentBoxStatus(students, boxItems, adminUser) {
  const studentBoxStatuses = [];

  // Create box status for first few students
  const sampleStudents = students.slice(0, 3);

  for (const student of sampleStudents) {
    const existingBoxStatus = await StudentBoxStatus.findOne({
      student_id: student._id,
    });

    if (existingBoxStatus) {
      console.log(
        `⚠️  Box status for ${student.fullName} already exists, skipping...`
      );
      studentBoxStatuses.push(existingBoxStatus);
      continue;
    }

    // Create random status for each box item
    const items = boxItems.map((item) => ({
      item_id: item._id,
      has_item: Math.random() > 0.5, // Random true/false
      notes: Math.random() > 0.7 ? "Needs refill" : "",
    }));

    const newBoxStatus = new StudentBoxStatus({
      student_id: student._id,
      items: items,
      updatedBy: adminUser._id,
    });

    await newBoxStatus.save();
    studentBoxStatuses.push(newBoxStatus);
    console.log(`✅ Created box status for: ${student.fullName}`);
  }

  return studentBoxStatuses;
}

// Create Student Documents
async function createStudentDocuments(students, documentTypes, adminUser) {
  const studentDocuments = [];

  // Create document status for first few students
  const sampleStudents = students.slice(0, 3);

  for (const student of sampleStudents) {
    const existingDocuments = await StudentDocument.findOne({
      student_id: student._id,
    });

    if (existingDocuments) {
      console.log(
        `⚠️  Documents for ${student.fullName} already exist, skipping...`
      );
      studentDocuments.push(existingDocuments);
      continue;
    }

    // Create random submission status for each document type
    const documents = documentTypes.map((docType) => ({
      document_type_id: docType._id,
      submitted: Math.random() > 0.3, // 70% chance of being submitted
      submission_date: Math.random() > 0.3 ? new Date() : null,
      notes: Math.random() > 0.8 ? "Pending review" : "",
    }));

    const newStudentDocuments = new StudentDocument({
      student_id: student._id,
      documents: documents,
      updatedBy: adminUser._id,
    });

    await newStudentDocuments.save();
    studentDocuments.push(newStudentDocuments);
    console.log(`✅ Created document status for: ${student.fullName}`);
  }

  return studentDocuments;
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

    // Create box items (My Box)
    console.log("\n📦 Creating box items...");
    const boxItems = await createBoxItems(boxItemsData, adminUser);

    // Create document types (My Documents)
    console.log("\n📄 Creating document types...");
    const documentTypes = await createDocumentTypes(
      documentTypesData,
      adminUser
    );

    // Create activities
    console.log("\n🎨 Creating activities...");
    const activities = await createActivities(activitiesData, adminUser);

    // Create lost items
    console.log("\n🧸 Creating lost items...");
    const lostItems = await createLostItems(lostItemsData);

    // Create weekly reports
    console.log("\n📊 Creating weekly reports...");
    const weeklyReports = await createWeeklyReports(students, teachers);

    // Create monthly plans
    console.log("\n📅 Creating monthly plans...");
    const monthlyPlans = await createMonthlyPlans(classes, teachers);

    // Create wall posts
    console.log("\n📝 Creating wall posts...");
    const wallPosts = await createWallPosts(teachers, classes);

    // Create notes
    console.log("\n📝 Creating notes...");
    const notes = await createNotes(students, teachers);

    // Create health data
    console.log("\n🏥 Creating health data...");
    const { healthInfos, healthMetrics } = await createHealthData(
      students,
      adminUser
    );

    // Create payment data
    console.log("\n💰 Creating payment data...");
    const { fees, transactions } = await createPaymentData(students, adminUser);

    // Create student box status
    console.log("\n📦 Creating student box status...");
    const studentBoxStatuses = await createStudentBoxStatus(
      students,
      boxItems,
      adminUser
    );

    // Create student documents
    console.log("\n📄 Creating student documents...");
    const studentDocuments = await createStudentDocuments(
      students,
      documentTypes,
      adminUser
    );

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   • ${teachers.length} teachers created`);
    console.log(`   • ${parents.length} parents created`);
    console.log(`   • ${classes.length} classes created`);
    console.log(`   • ${students.length} students created/found`);
    console.log(`   • ${menus.length} weekly menus created`);
    console.log(`   • ${boxItems.length} box items created`);
    console.log(`   • ${documentTypes.length} document types created`);
    console.log(`   • ${activities.length} activities created`);
    console.log(`   • ${lostItems.length} lost items created`);
    console.log(`   • ${weeklyReports.length} weekly reports created`);
    console.log(`   • ${monthlyPlans.length} monthly plans created`);
    console.log(`   • ${wallPosts.length} wall posts created`);
    console.log(`   • ${notes.length} notes created`);
    console.log(`   • ${healthInfos.length} health info records created`);
    console.log(`   • ${healthMetrics.length} health metrics created`);
    console.log(`   • ${fees.length} fees created`);
    console.log(`   • ${transactions.length} payment transactions created`);
    console.log(
      `   • ${studentBoxStatuses.length} student box statuses created`
    );
    console.log(
      `   • ${studentDocuments.length} student document records created`
    );
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
