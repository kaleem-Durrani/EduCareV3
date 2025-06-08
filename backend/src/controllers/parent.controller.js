import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import ParentStudentRelation from "../models/parentStudentRelation.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwConflict,
  throwBadRequest,
} from "../utils/transaction.utils.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

/**
 * Get parents statistics
 * GET /api/parents/statistics
 * Admin only
 */
export const getParentsStatistics = asyncHandler(async (req, res) => {
  const totalParents = await User.countDocuments({
    role: "parent",
    is_active: true,
  });
  const activeParents = await User.countDocuments({
    role: "parent",
    is_active: true,
  });
  const inactiveParents = await User.countDocuments({
    role: "parent",
    is_active: false,
  });

  // Get parents with children count
  const parentsWithChildren = await ParentStudentRelation.aggregate([
    { $match: { active: true } },
    { $group: { _id: "$parent_id" } },
    { $count: "count" },
  ]);

  const parentsWithChildrenCount = parentsWithChildren[0]?.count || 0;
  const parentsWithoutChildren = totalParents - parentsWithChildrenCount;

  // Get recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentRegistrations = await User.countDocuments({
    role: "parent",
    is_active: true,
    createdAt: { $gte: thirtyDaysAgo },
  });

  const statistics = {
    totalParents,
    activeParents,
    inactiveParents,
    parentsWithChildren: parentsWithChildrenCount,
    parentsWithoutChildren,
    recentRegistrations,
  };

  return sendSuccess(
    res,
    statistics,
    "Parents statistics retrieved successfully"
  );
});

/**
 * Get all parents with pagination and filters
 * GET /api/parents
 * Admin only
 */
export const getAllParents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  const skip = (page - 1) * limit;

  let query = { role: "parent" };

  // Status filter
  if (status === "active") {
    query.is_active = true;
  } else if (status === "inactive") {
    query.is_active = false;
  }

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(query);

  const parents = await User.find(query, {
    password_hash: 0,
    resetPasswordToken: 0,
    resetPasswordExpires: 0,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get children count for each parent
  const parentsWithChildrenCount = await Promise.all(
    parents.map(async (parent) => {
      const childrenCount = await ParentStudentRelation.countDocuments({
        parent_id: parent._id,
        active: true,
      });

      return {
        ...parent.toObject(),
        childrenCount,
        photoUrl: parent.photoUrl,
      };
    })
  );

  const response = {
    parents: parentsWithChildrenCount,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, response, "Parents retrieved successfully");
});

/**
 * Get parents for select options (label/value pairs)
 * GET /api/parents/select
 * All authenticated users
 */
export const getParentsForSelect = asyncHandler(async (req, res) => {
  const parents = await User.find({ role: "parent", is_active: true })
    .select("name email")
    .sort({ name: 1 })
    .lean();

  const selectOptions = parents.map((parent) => ({
    value: parent._id.toString(),
    label: `${parent.name} (${parent.email})`,
  }));

  return sendSuccess(
    res,
    selectOptions,
    "Parents for select retrieved successfully"
  );
});

/**
 * Create parent-student relationship
 * POST /api/student-parent
 * Admin only
 */
export const createParentStudentRelation = asyncHandler(async (req, res) => {
  const { parent_id, student_id, relationshipType = "parent" } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if parent exists and has parent role
    const parent = await User.findOne({
      _id: parent_id,
      role: "parent",
      is_active: true,
    }).session(session);

    if (!parent) {
      throwNotFound("Parent");
    }

    // Check if student exists and is active
    const student = await Student.findOne({
      _id: student_id,
      active: true,
    }).session(session);

    if (!student) {
      throwNotFound("Student");
    }

    // Check if relationship already exists
    const existingRelation = await ParentStudentRelation.findOne({
      parent_id,
      student_id,
      active: true,
    }).session(session);

    if (existingRelation) {
      throwConflict("Relationship already exists");
    }

    // Create new relationship
    const newRelation = new ParentStudentRelation({
      parent_id,
      student_id,
      relationshipType,
      active: true,
    });

    await newRelation.save({ session });

    // Populate the relationship with parent and student details
    const populatedRelation = await ParentStudentRelation.findById(
      newRelation._id
    )
      .populate("parent_id", "name email phone")
      .populate("student_id", "fullName rollNum class")
      .session(session);

    return populatedRelation;
  });

  return sendSuccess(
    res,
    result,
    "Parent-student relationship created successfully",
    201
  );
});

/**
 * Create parent
 * POST /api/parents
 * Admin only
 */
export const createParent = asyncHandler(async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  const photoPath = req.file ? req.file.path : null;

  const result = await withTransaction(async (session) => {
    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    }).session(session);
    if (existingUser) {
      throwConflict("Email already exists");
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new parent
    const newParent = new User({
      name,
      email: email.toLowerCase(),
      phone,
      address,
      password_hash,
      role: "parent",
      photoUrl: photoPath,
      is_active: true,
    });

    await newParent.save({ session });

    // Return parent without sensitive data
    const parentResponse = {
      _id: newParent._id,
      name: newParent.name,
      email: newParent.email,
      phone: newParent.phone,
      address: newParent.address,
      role: newParent.role,
      photoUrl: newParent.photoUrl,
      is_active: newParent.is_active,
      createdAt: newParent.createdAt,
      updatedAt: newParent.updatedAt,
      childrenCount: 0,
    };

    return parentResponse;
  });

  return sendSuccess(res, result, "Parent created successfully", 201);
});

/**
 * Get parent by ID with children
 * GET /api/parents/:parent_id
 * Admin only
 */
export const getParentById = asyncHandler(async (req, res) => {
  const { parent_id } = req.params;

  const parent = await User.findOne(
    { _id: parent_id, role: "parent" },
    { password_hash: 0, resetPasswordToken: 0, resetPasswordExpires: 0 }
  );

  if (!parent) {
    throwNotFound("Parent");
  }

  // Get children relationships
  const children = await ParentStudentRelation.find({
    parent_id: parent_id,
    active: true,
  })
    .populate("student_id", "fullName rollNum class enrollmentNumber")
    .sort({ createdAt: -1 });

  const parentResponse = {
    ...parent.toObject(),
    photoUrl: parent.photoUrl,
    children: children.map((relation) => ({
      relationId: relation._id,
      relationshipType: relation.relationshipType,
      student: relation.student_id,
      createdAt: relation.createdAt,
    })),
    childrenCount: children.length,
  };

  return sendSuccess(res, parentResponse, "Parent retrieved successfully");
});

/**
 * Update parent
 * PUT /api/parents/:parent_id
 * Admin only
 */
export const updateParent = asyncHandler(async (req, res) => {
  const { parent_id } = req.params;
  const { name, email, phone, address, password } = req.body;

  const result = await withTransaction(async (session) => {
    const parent = await User.findOne({
      _id: parent_id,
      role: "parent",
    }).session(session);
    if (!parent) {
      throwNotFound("Parent");
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== parent.email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: parent_id },
      }).session(session);
      if (existingUser) {
        throwConflict("Email already exists");
      }
    }

    // Update fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    // Handle password update
    if (password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(password, saltRounds);
    }

    // Handle photo update
    if (req.file) {
      // Delete old photo if it exists
      if (parent.photoUrl && fs.existsSync(parent.photoUrl)) {
        fs.unlink(parent.photoUrl, (err) => {
          if (err) console.error("Error deleting old photo:", err);
        });
      }
      updateData.photoUrl = req.file.path;
    }

    const updatedParent = await User.findByIdAndUpdate(parent_id, updateData, {
      new: true,
      session,
    }).select("-password_hash -resetPasswordToken -resetPasswordExpires");

    // Get children count
    const childrenCount = await ParentStudentRelation.countDocuments({
      parent_id: parent_id,
      active: true,
    });

    const parentResponse = {
      ...updatedParent.toObject(),
      photoUrl: updatedParent.photoUrl
        ? `/api/users/${updatedParent._id}/photo`
        : null,
      childrenCount,
    };

    return parentResponse;
  });

  return sendSuccess(res, result, "Parent updated successfully");
});

/**
 * Delete parent (soft delete)
 * DELETE /api/parents/:parent_id
 * Admin only
 */
export const deleteParent = asyncHandler(async (req, res) => {
  const { parent_id } = req.params;

  const result = await withTransaction(async (session) => {
    const parent = await User.findOne({
      _id: parent_id,
      role: "parent",
    }).session(session);
    if (!parent) {
      throwNotFound("Parent");
    }

    // Soft delete parent
    await User.findByIdAndUpdate(parent_id, { is_active: false }, { session });

    // Deactivate all relationships
    await ParentStudentRelation.updateMany(
      { parent_id: parent_id },
      { active: false },
      { session }
    );

    return { _id: parent_id, is_active: false };
  });

  return sendSuccess(res, result, "Parent deleted successfully");
});

/**
 * Update parent-student relationship
 * PUT /api/parent-student-relations/:relation_id
 * Admin only
 */
export const updateParentStudentRelation = asyncHandler(async (req, res) => {
  const { relation_id } = req.params;
  const { relationshipType, active } = req.body;

  const result = await withTransaction(async (session) => {
    const relation = await ParentStudentRelation.findById(relation_id).session(
      session
    );
    if (!relation) {
      throwNotFound("Parent-student relationship");
    }

    const updateData = {};
    if (relationshipType !== undefined)
      updateData.relationshipType = relationshipType;
    if (active !== undefined) updateData.active = active;

    const updatedRelation = await ParentStudentRelation.findByIdAndUpdate(
      relation_id,
      updateData,
      { new: true, session }
    )
      .populate("parent_id", "name email phone")
      .populate("student_id", "fullName rollNum class enrollmentNumber");

    return updatedRelation;
  });

  return sendSuccess(res, result, "Relationship updated successfully");
});

/**
 * Delete parent-student relationship
 * DELETE /api/parent-student-relations/:relation_id
 * Admin only
 */
export const deleteParentStudentRelation = asyncHandler(async (req, res) => {
  const { relation_id } = req.params;

  const result = await withTransaction(async (session) => {
    const relation = await ParentStudentRelation.findById(relation_id).session(
      session
    );
    if (!relation) {
      throwNotFound("Parent-student relationship");
    }

    // Soft delete the relationship
    await ParentStudentRelation.findByIdAndUpdate(
      relation_id,
      { active: false },
      { session }
    );

    return { _id: relation_id, active: false };
  });

  return sendSuccess(res, result, "Relationship deleted successfully");
});

/**
 * Get parent's children relationships
 * GET /api/parents/:parent_id/children
 * Admin only
 */
export const getParentChildren = asyncHandler(async (req, res) => {
  const { parent_id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  // Check if parent exists
  const parent = await User.findOne({ _id: parent_id, role: "parent" });
  if (!parent) {
    throwNotFound("Parent");
  }

  const total = await ParentStudentRelation.countDocuments({
    parent_id: parent_id,
    active: true,
  });

  const relationships = await ParentStudentRelation.find({
    parent_id: parent_id,
    active: true,
  })
    .populate("student_id", "fullName rollNum class enrollmentNumber")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const response = {
    relationships: relationships.map((relation) => ({
      relationId: relation._id,
      relationshipType: relation.relationshipType,
      student: relation.student_id,
      active: relation.active,
      createdAt: relation.createdAt,
      updatedAt: relation.updatedAt,
    })),
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, response, "Parent children retrieved successfully");
});

/**
 * Serve parent photo
 * GET /api/users/:user_id/photo
 * All authenticated users
 */
export const serveParentPhoto = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const user = await User.findById(user_id);
  if (!user || !user.photoUrl) {
    throwNotFound("Photo");
  }

  // Check if file exists
  if (!fs.existsSync(user.photoUrl)) {
    throwNotFound("Photo file");
  }

  // Get file extension to set proper content type
  const ext = path.extname(user.photoUrl).toLowerCase();
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
  const fileStream = fs.createReadStream(user.photoUrl);
  fileStream.pipe(res);
});
