import LostItem from "../models/lostItem.model.js";
import User from "../models/user.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwBadRequest,
} from "../utils/transaction.utils.js";
import { normalizePath } from "../middleware/upload.middleware.js";
import fs from "fs";
import path from "path";

/**
 * Get lost items statistics
 * GET /api/lost-items/statistics
 * All authenticated users
 */
export const getLostItemsStatistics = asyncHandler(async (req, res) => {
  const totalItems = await LostItem.countDocuments();
  const claimedItems = await LostItem.countDocuments({ status: "claimed" });
  const unclaimedItems = await LostItem.countDocuments({ status: "unclaimed" });

  // Get recent items (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentItems = await LostItem.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Get items found this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const itemsThisMonth = await LostItem.countDocuments({
    dateFound: { $gte: startOfMonth },
  });

  const statistics = {
    totalItems,
    claimedItems,
    unclaimedItems,
    recentItems,
    itemsThisMonth,
    claimRate:
      totalItems > 0 ? ((claimedItems / totalItems) * 100).toFixed(1) : 0,
  };

  return sendSuccess(
    res,
    statistics,
    "Lost items statistics retrieved successfully"
  );
});

/**
 * Get all lost items with pagination and filters
 * GET /api/lost-items
 * All authenticated users
 */
export const getLostItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, dateFrom, dateTo, search } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  // Status filter
  if (status) {
    query.status = status;
  }

  // Date range filter
  if (dateFrom || dateTo) {
    query.dateFound = {};
    if (dateFrom) {
      query.dateFound.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      query.dateFound.$lte = endDate;
    }
  }

  // Search filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const total = await LostItem.countDocuments(query);

  const lostItems = await LostItem.find(query)
    .populate("claimedBy", "name email photoUrl")
    .sort({ dateFound: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Format items with image URLs and claimed by info
  const formattedItems = lostItems.map((item) => ({
    _id: item._id,
    title: item.title,
    description: item.description,
    dateFound: item.dateFound,
    imageUrl: item.imagePath ? normalizePath(item.imagePath) : null,
    status: item.status,
    claimedBy: item.claimedBy
      ? {
          _id: item.claimedBy._id,
          name: item.claimedBy.name,
          email: item.claimedBy.email,
          photoUrl: item.claimedBy.photoUrl,
        }
      : null,
    claimedDate: item.claimedDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  const response = {
    items: formattedItems,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
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

  const lostItem = await LostItem.findById(item_id).populate(
    "claimedBy",
    "name email photoUrl"
  );

  if (!lostItem) {
    throwNotFound("Lost item");
  }

  const formattedItem = {
    _id: lostItem._id,
    title: lostItem.title,
    description: lostItem.description,
    dateFound: lostItem.dateFound,
    imageUrl: lostItem.imagePath ? normalizePath(lostItem.imagePath) : null,
    status: lostItem.status,
    claimedBy: lostItem.claimedBy
      ? {
          _id: lostItem.claimedBy._id,
          name: lostItem.claimedBy.name,
          email: lostItem.claimedBy.email,
          photoUrl: lostItem.claimedBy.photoUrl,
        }
      : null,
    claimedDate: lostItem.claimedDate,
    createdAt: lostItem.createdAt,
    updatedAt: lostItem.updatedAt,
  };

  return sendSuccess(res, formattedItem, "Lost item retrieved successfully");
});

/**
 * Claim lost item by parent email
 * POST /api/lost-items/:item_id/claim
 * Admin/Teacher only
 */
export const claimLostItem = asyncHandler(async (req, res) => {
  const { item_id } = req.params;
  const { parentEmail } = req.body;

  if (!parentEmail) {
    throwBadRequest("Parent email is required");
  }

  const result = await withTransaction(async (session) => {
    // Check if item exists and is unclaimed
    const lostItem = await LostItem.findById(item_id).session(session);
    if (!lostItem) {
      throwNotFound("Lost item");
    }

    if (lostItem.status === "claimed") {
      throwBadRequest("Item is already claimed");
    }

    // Find parent by email
    const parent = await User.findOne({
      email: parentEmail.toLowerCase(),
      role: "parent",
      is_active: true,
    }).session(session);

    if (!parent) {
      throwNotFound("Parent with this email not found");
    }

    // Update item to claimed
    const updatedItem = await LostItem.findByIdAndUpdate(
      item_id,
      {
        status: "claimed",
        claimedBy: parent._id,
        claimedDate: new Date(),
      },
      { new: true, session }
    ).populate("claimedBy", "name email photoUrl");

    const formattedItem = {
      _id: updatedItem._id,
      title: updatedItem.title,
      description: updatedItem.description,
      dateFound: updatedItem.dateFound,
      imageUrl: updatedItem.imagePath
        ? normalizePath(updatedItem.imagePath)
        : null,
      status: updatedItem.status,
      claimedBy: {
        _id: updatedItem.claimedBy._id,
        name: updatedItem.claimedBy.name,
        email: updatedItem.claimedBy.email,
        photoUrl: updatedItem.claimedBy.photoUrl,
      },
      claimedDate: updatedItem.claimedDate,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt,
    };

    return formattedItem;
  });

  return sendSuccess(res, result, "Lost item claimed successfully");
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
    });

    await newLostItem.save({ session });

    const formattedItem = {
      _id: newLostItem._id,
      title: newLostItem.title,
      description: newLostItem.description,
      dateFound: newLostItem.dateFound,
      imageUrl: newLostItem.imagePath
        ? normalizePath(newLostItem.imagePath)
        : null,
      status: newLostItem.status,
      claimedBy: null,
      claimedDate: null,
      createdAt: newLostItem.createdAt,
      updatedAt: newLostItem.updatedAt,
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
    const updateData = {};
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
    }).populate("claimedBy", "name email photoUrl");

    const formattedItem = {
      _id: updatedItem._id,
      title: updatedItem.title,
      description: updatedItem.description,
      dateFound: updatedItem.dateFound,
      imageUrl: updatedItem.imagePath
        ? normalizePath(updatedItem.imagePath)
        : null,
      status: updatedItem.status,
      claimedBy: updatedItem.claimedBy
        ? {
            _id: updatedItem.claimedBy._id,
            name: updatedItem.claimedBy.name,
            email: updatedItem.claimedBy.email,
            photoUrl: updatedItem.claimedBy.photoUrl,
          }
        : null,
      claimedDate: updatedItem.claimedDate,
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
