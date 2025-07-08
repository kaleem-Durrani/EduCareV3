import mongoose from "mongoose";
import Student from "../models/student.model.js";
import HealthMetric from "../models/healthMetric.model.js";
import HealthInfo from "../models/healthInfo.model.js";
import DocumentType from "../models/documentType.model.js";
import StudentDocument from "../models/studentDocument.model.js";
import User from "../models/user.model.js";

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

const createTestHealthData = async () => {
  try {
    console.log("Creating test health data...");

    // Get test students
    const students = await Student.find({ rollNum: { $in: [1001, 1002] } });
    if (students.length === 0) {
      console.log(
        "No test students found. Please run createTestData.js first."
      );
      return;
    }

    // Get a test admin user to use as createdBy
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("No admin user found. Creating one...");
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      adminUser = new User({
        name: "Test Admin",
        email: "admin@test.com",
        password_hash: hashedPassword,
        role: "admin",
        is_active: true,
      });
      await adminUser.save();
      console.log("Test admin created:", adminUser._id);
    }

    // Create health metrics for each student
    for (const student of students) {
      console.log(`Creating health data for ${student.fullName}...`);

      // Create health metrics
      const healthMetrics = [
        {
          student_id: student._id,
          type: "height",
          value: 95,
          date: new Date("2024-01-15"),
          recordedBy: adminUser._id,
          notes: "Regular checkup",
        },
        {
          student_id: student._id,
          type: "weight",
          value: 15.5,
          date: new Date("2024-01-15"),
          recordedBy: adminUser._id,
          notes: "Regular checkup",
        },
      ];

      for (const metricData of healthMetrics) {
        const existingMetric = await HealthMetric.findOne({
          student_id: metricData.student_id,
          type: metricData.type,
          date: metricData.date,
        });

        if (!existingMetric) {
          const metric = new HealthMetric(metricData);
          await metric.save();
          console.log(`- Created ${metricData.type} metric`);
        }
      }

      // Create health info
      const existingHealthInfo = await HealthInfo.findOne({
        student_id: student._id,
      });
      if (!existingHealthInfo) {
        const healthInfo = new HealthInfo({
          student_id: student._id,
          allergies:
            student.fullName === "John Doe"
              ? ["Peanuts", "Shellfish"]
              : ["None"],
          medications: [],
          medicalConditions: [],
          emergencyContact: {
            name: student.contacts[0]?.name || "Emergency Contact",
            phone: student.contacts[0]?.phone || "+1234567890",
            relationship: student.contacts[0]?.relationship || "Parent",
          },
          bloodType: student.fullName === "John Doe" ? "A+" : "O+",
          doctorInfo: {
            name: "Dr. Smith",
            phone: "+1234567899",
            clinic: "City Pediatric Clinic",
          },
          notes: "Regular checkups recommended",
          updatedBy: adminUser._id,
        });
        await healthInfo.save();
        console.log("- Created health info");
      }
    }

    // Create document types
    const documentTypes = [
      {
        name: "Birth Certificate",
        description: "Official birth certificate",
        required: true,
      },
      {
        name: "Vaccination Record",
        description: "Complete vaccination history",
        required: true,
      },
      {
        name: "Medical Certificate",
        description: "Health clearance from doctor",
        required: true,
      },
      {
        name: "Photo ID",
        description: "Recent photo identification",
        required: false,
      },
    ];

    for (const docTypeData of documentTypes) {
      let docType = await DocumentType.findOne({ name: docTypeData.name });
      if (!docType) {
        docType = new DocumentType(docTypeData);
        await docType.save();
        console.log(`Created document type: ${docType.name}`);
      }
    }

    // Create student documents
    const allDocTypes = await DocumentType.find();
    for (const student of students) {
      const existingStudentDoc = await StudentDocument.findOne({
        student_id: student._id,
      });

      if (!existingStudentDoc) {
        const documents = allDocTypes.map((docType) => {
          const submitted = Math.random() > 0.3;
          return {
            document_type_id: docType._id,
            submitted: submitted,
            submission_date: submitted ? new Date() : null,
            notes: submitted ? "Document received" : "Pending submission",
          };
        });

        const studentDoc = new StudentDocument({
          student_id: student._id,
          documents: documents,
          updatedBy: adminUser._id,
        });
        await studentDoc.save();
        console.log(`- Created documents for ${student.fullName}`);
      }
    }

    console.log("\nTest health and document data creation completed!");
  } catch (error) {
    console.error("Error creating test health data:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await createTestHealthData();
};

main();
