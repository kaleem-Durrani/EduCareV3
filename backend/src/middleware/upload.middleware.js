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
ensureUploadDir("uploads/users");
ensureUploadDir("uploads/students");
ensureUploadDir("uploads/contacts");
ensureUploadDir("uploads/posts/images");
ensureUploadDir("uploads/posts/videos");

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

// File filters
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype =
    /video\/(mp4|avi|quicktime|x-msvideo|x-flv|webm|x-matroska)/.test(
      file.mimetype
    );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Only video files are allowed (mp4, avi, mov, wmv, flv, webm, mkv)"
      )
    );
  }
};

const mediaFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  const videoTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;

  const extname = path.extname(file.originalname).toLowerCase();
  const isImage = imageTypes.test(extname) && /image\//.test(file.mimetype);
  const isVideo = videoTypes.test(extname) && /video\//.test(file.mimetype);

  if (isImage || isVideo) {
    return cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"));
  }
};

// Create upload configurations for different modules
const createUpload = (uploadDir, options = {}) => {
  const { fileFilter = imageFilter, fileSize = 5 * 1024 * 1024 } = options;

  return multer({
    storage: createStorage(uploadDir),
    limits: {
      fileSize: fileSize,
    },
    fileFilter: fileFilter,
  });
};

// Export specific upload configurations
export const uploadLostItems = createUpload("uploads/lost_items");
export const uploadMonthlyPlans = createUpload("uploads/monthly_plans");
export const uploadUsers = createUpload("uploads/users");

// Posts media uploads with custom storage for different file types
const createPostMediaStorage = () => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      if (file.fieldname === "image") {
        uploadDir = "uploads/posts/images";
      } else if (file.fieldname === "video") {
        uploadDir = "uploads/posts/videos";
      } else {
        uploadDir = "uploads/posts";
      }
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

export const uploadPostImages = createUpload("uploads/posts/images", {
  fileFilter: imageFilter,
  fileSize: 10 * 1024 * 1024, // 10MB for images
});

export const uploadPostVideos = createUpload("uploads/posts/videos", {
  fileFilter: videoFilter,
  fileSize: 100 * 1024 * 1024, // 100MB for videos
});

export const uploadPostMedia = multer({
  storage: createPostMediaStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for mixed media
  },
  fileFilter: mediaFilter,
});

// Helper function to normalize file paths (convert backslashes to forward slashes)
export const normalizePath = (filePath) => {
  if (!filePath) return null;
  return filePath.replace(/\\/g, "/");
};

// Helper function to create single file upload middleware for different directories
export const uploadSingle = (directory) => {
  const uploadDir = `uploads/${directory}`;
  return createUpload(uploadDir).single("photo");
};

// Default export for backward compatibility
export default uploadLostItems;
