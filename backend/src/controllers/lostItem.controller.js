import LostItem from "../models/lostItem.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
} from "../utils/transaction.utils.js";
import fs from "fs";
import path from "path";

/**
 * Get all lost items
 * GET /api/lost-items
 * All authenticated users
 */
export const getLostItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = {};
  if (status) {
    query.status = status;
  }

  const lostItems = await LostItem.find(query)
    .populate("createdBy", "name email")
    .sort({ dateFound: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await LostItem.countDocuments(query);

  // Format items with image URLs
  const formattedItems = lostItems.map((item) => ({
    id: item._id,
    title: item.title,
    description: item.description,
    dateFound: item.dateFound,
    imageUrl: item.imagePath ? `/api/lost-items/${item._id}/image` : null,
    status: item.status,
    createdBy: item.createdBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  const response = {
    items: formattedItems,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };

  return sendSuccess(res, response, "Lost items retrieved successfully");
});

/**
 * Get specific lost item
 * GET /api/lost-items/:item_id
 * All authenticated users
 */
export const getLostItemById = asyncHandler(async (req, res) => {
  const { item_id } = req.params;

  const lostItem = await LostItem.findById(item_id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!lostItem) {
    throwNotFound("Lost item");
  }

  const formattedItem = {
    id: lostItem._id,
    title: lostItem.title,
    description: lostItem.description,
    dateFound: lostItem.dateFound,
    imageUrl: lostItem.imagePath
      ? `/api/lost-items/${lostItem._id}/image`
      : null,
    status: lostItem.status,
    createdBy: lostItem.createdBy,
    updatedBy: lostItem.updatedBy,
    createdAt: lostItem.createdAt,
    updatedAt: lostItem.updatedAt,
  };

  return sendSuccess(res, formattedItem, "Lost item retrieved successfully");
});

/**
 * Create lost item (handles image upload)
 * POST /api/lost-items
 * Admin/Teacher only
 */
export const createLostItem = asyncHandler(async (req, res) => {
  const { title, description, dateFound, status } = req.body;
  const imagePath = req.file ? req.file.path : null;

  const result = await withTransaction(async (session) => {
    const newLostItem = new LostItem({
      title,
      description,
      dateFound: dateFound ? new Date(dateFound) : new Date(),
      imagePath,
      status: status || "unclaimed",
      createdBy: req.user.id,
    });

    await newLostItem.save({ session });

    const populatedItem = await LostItem.findById(newLostItem._id)
      .populate("createdBy", "name email")
      .session(session);

    const formattedItem = {
      id: populatedItem._id,
      title: populatedItem.title,
      description: populatedItem.description,
      dateFound: populatedItem.dateFound,
      imageUrl: populatedItem.imagePath
        ? `/api/lost-items/${populatedItem._id}/image`
        : null,
      status: populatedItem.status,
      createdBy: populatedItem.createdBy,
      createdAt: populatedItem.createdAt,
      updatedAt: populatedItem.updatedAt,
    };

    return formattedItem;
  });

  return sendSuccess(res, result, "Lost item created successfully", 201);
});

/**
 * Update lost item (handles image update)
 * PUT /api/lost-items/:item_id
 * Admin/Teacher only
 */
export const updateLostItem = asyncHandler(async (req, res) => {
  const { item_id } = req.params;
  const { title, description, dateFound, status } = req.body;

  const result = await withTransaction(async (session) => {
    const lostItem = await LostItem.findById(item_id).session(session);
    if (!lostItem) {
      throwNotFound("Lost item");
    }

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dateFound !== undefined) updateData.dateFound = new Date(dateFound);
    if (status !== undefined) updateData.status = status;

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (lostItem.imagePath && fs.existsSync(lostItem.imagePath)) {
        fs.unlink(lostItem.imagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      updateData.imagePath = req.file.path;
    }

    const updatedItem = await LostItem.findByIdAndUpdate(item_id, updateData, {
      new: true,
      session,
    })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    const formattedItem = {
      id: updatedItem._id,
      title: updatedItem.title,
      description: updatedItem.description,
      dateFound: updatedItem.dateFound,
      imageUrl: updatedItem.imagePath
        ? `/api/lost-items/${updatedItem._id}/image`
        : null,
      status: updatedItem.status,
      createdBy: updatedItem.createdBy,
      updatedBy: updatedItem.updatedBy,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt,
    };

    return formattedItem;
  });

  return sendSuccess(res, result, "Lost item updated successfully");
});

/**
 * Delete lost item
 * DELETE /api/lost-items/:item_id
 * Admin/Teacher only
 */
export const deleteLostItem = asyncHandler(async (req, res) => {
  const { item_id } = req.params;

  const lostItem = await LostItem.findById(item_id);
  if (!lostItem) {
    throwNotFound("Lost item");
  }

  // Delete associated image file
  if (lostItem.imagePath && fs.existsSync(lostItem.imagePath)) {
    fs.unlink(lostItem.imagePath, (err) => {
      if (err) console.error("Error deleting image file:", err);
    });
  }

  await LostItem.findByIdAndDelete(item_id);

  return sendSuccess(res, null, "Lost item deleted successfully");
});

/**
 * Serve item image
 * GET /api/lost-items/:item_id/image
 * All authenticated users
 */
export const serveItemImage = asyncHandler(async (req, res) => {
  const { item_id } = req.params;

  const lostItem = await LostItem.findById(item_id);
  if (!lostItem || !lostItem.imagePath) {
    throwNotFound("Image");
  }

  // Check if file exists
  if (!fs.existsSync(lostItem.imagePath)) {
    throwNotFound("Image file");
  }

  // Get file extension to set proper content type
  const ext = path.extname(lostItem.imagePath).toLowerCase();
  let contentType = "image/jpeg"; // default

  switch (ext) {
    case ".png":
      contentType = "image/png";
      break;
    case ".gif":
      contentType = "image/gif";
      break;
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
  }

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

  // Stream the file
  const fileStream = fs.createReadStream(lostItem.imagePath);
  fileStream.pipe(res);
});
