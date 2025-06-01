import fs from "fs";
import path from "path";

/**
 * Delete a file if it exists
 * @param {string} filePath - Path to the file to delete
 * @returns {boolean} - True if file was deleted or didn't exist, false if error
 */
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`File deleted: ${filePath}`);
      return true;
    }
    return true; // File doesn't exist, consider it "deleted"
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};

/**
 * Delete file by relative path from uploads directory
 * @param {string} relativePath - Relative path from uploads directory (e.g., "monthly_plans/image-123.jpg")
 * @returns {boolean} - True if file was deleted or didn't exist, false if error
 */
export const deleteUploadedFile = (relativePath) => {
  if (!relativePath) return true;

  const fullPath = path.join("uploads", relativePath);
  return deleteFile(fullPath);
};

/**
 * Extract relative path from full file path
 * @param {string} fullPath - Full file path (e.g., "uploads/monthly_plans/image-123.jpg")
 * @returns {string} - Relative path from uploads directory (e.g., "monthly_plans/image-123.jpg")
 */
export const getRelativePath = (fullPath) => {
  if (!fullPath) return null;

  // Normalize path separators
  const normalizedPath = fullPath.replace(/\\/g, "/");

  // Remove "uploads/" prefix if it exists
  if (normalizedPath.startsWith("uploads/")) {
    return normalizedPath.substring(8);
  }

  // If path doesn't start with uploads/, return as is (it should be relative already)
  return normalizedPath;
};

/**
 * Get full URL for uploaded file
 * @param {string} relativePath - Relative path from uploads directory
 * @param {string} baseUrl - Base URL of the server (optional, defaults to process.env.BASE_URL)
 * @returns {string} - Full URL to the file
 */
export const getFileUrl = (
  relativePath,
  baseUrl = process.env.BASE_URL || "http://localhost:5000"
) => {
  if (!relativePath) return null;

  return `${baseUrl}/uploads/${relativePath}`;
};
