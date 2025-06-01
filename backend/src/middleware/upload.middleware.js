import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created upload directory: ${dir}`);
  }
};

// Create base upload directories
ensureUploadDir("uploads/lost_items");
ensureUploadDir("uploads/monthly_plans");

// Create flexible storage configuration
const createStorage = (uploadDir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      ensureUploadDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });
};

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif)"));
  }
};

// Create upload configurations for different modules
const createUpload = (uploadDir) => {
  return multer({
    storage: createStorage(uploadDir),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
  });
};

// Export specific upload configurations
export const uploadLostItems = createUpload("uploads/lost_items");
export const uploadMonthlyPlans = createUpload("uploads/monthly_plans");

// Default export for backward compatibility
export default uploadLostItems;
