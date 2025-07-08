import Driver from "../models/driver.model.js";
import Student from "../models/student.model.js";
import ParentStudentRelation from "../models/parentStudentRelation.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwForbidden,
  throwBadRequest,
  throwConflict,
} from "../utils/transaction.utils.js";

/**
 * Get all drivers with pagination and filters
 * GET /api/drivers
 * Admin/Teacher access
 */
export const getAllDrivers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, route } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  let query = {};

  // Status filter
  if (status) {
    query.status = status;
  }

  // Route filter
  if (route) {
    query["route.name"] = { $regex: route, $options: "i" };
  }

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { licenseNumber: { $regex: search, $options: "i" } },
      { "vehicle.plateNumber": { $regex: search, $options: "i" } },
    ];
  }

  const totalDrivers = await Driver.countDocuments(query);
  const totalPages = Math.ceil(totalDrivers / limitNum);

  const drivers = await Driver.find(query)
    .populate("assignedStudents.student_id", "fullName rollNum")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const result = {
    drivers,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalDrivers,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      limit: limitNum,
    },
  };

  return sendSuccess(res, result, "Drivers retrieved successfully");
});

/**
 * Get driver by ID
 * GET /api/drivers/:driver_id
 * Admin/Teacher access
 */
export const getDriverById = asyncHandler(async (req, res) => {
  const { driver_id } = req.params;

  const driver = await Driver.findById(driver_id)
    .populate("assignedStudents.student_id", "fullName rollNum photoUrl")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!driver) {
    throwNotFound("Driver");
  }

  return sendSuccess(res, driver, "Driver retrieved successfully");
});

/**
 * Create new driver
 * POST /api/drivers
 * Admin only
 */
export const createDriver = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    licenseNumber,
    vehicle,
    route,
    schedule,
    emergencyContact,
    notes,
  } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if license number already exists
    const existingDriver = await Driver.findOne({ licenseNumber }).session(
      session
    );
    if (existingDriver) {
      throwConflict("License number already exists");
    }

    // Check if vehicle plate number already exists
    const existingPlate = await Driver.findOne({
      "vehicle.plateNumber": vehicle.plateNumber,
    }).session(session);
    if (existingPlate) {
      throwConflict("Vehicle plate number already exists");
    }

    const newDriver = new Driver({
      name,
      phone,
      email,
      licenseNumber,
      vehicle,
      route,
      schedule,
      emergencyContact,
      notes,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    await newDriver.save({ session });
    return newDriver;
  });

  return sendSuccess(res, result, "Driver created successfully", 201);
});

/**
 * Update driver
 * PUT /api/drivers/:driver_id
 * Admin only
 */
export const updateDriver = asyncHandler(async (req, res) => {
  const { driver_id } = req.params;
  const updateData = req.body;

  const result = await withTransaction(async (session) => {
    const driver = await Driver.findById(driver_id).session(session);
    if (!driver) {
      throwNotFound("Driver");
    }

    // Check for conflicts if license number is being updated
    if (
      updateData.licenseNumber &&
      updateData.licenseNumber !== driver.licenseNumber
    ) {
      const existingDriver = await Driver.findOne({
        licenseNumber: updateData.licenseNumber,
        _id: { $ne: driver_id },
      }).session(session);
      if (existingDriver) {
        throwConflict("License number already exists");
      }
    }

    // Check for conflicts if plate number is being updated
    if (
      updateData.vehicle?.plateNumber &&
      updateData.vehicle.plateNumber !== driver.vehicle.plateNumber
    ) {
      const existingPlate = await Driver.findOne({
        "vehicle.plateNumber": updateData.vehicle.plateNumber,
        _id: { $ne: driver_id },
      }).session(session);
      if (existingPlate) {
        throwConflict("Vehicle plate number already exists");
      }
    }

    updateData.updatedBy = req.user.id;

    const updatedDriver = await Driver.findByIdAndUpdate(
      driver_id,
      updateData,
      {
        new: true,
        session,
      }
    )
      .populate("assignedStudents.student_id", "fullName rollNum")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return updatedDriver;
  });

  return sendSuccess(res, result, "Driver updated successfully");
});

/**
 * Delete driver
 * DELETE /api/drivers/:driver_id
 * Admin only
 */
export const deleteDriver = asyncHandler(async (req, res) => {
  const { driver_id } = req.params;

  const result = await withTransaction(async (session) => {
    const driver = await Driver.findById(driver_id).session(session);
    if (!driver) {
      throwNotFound("Driver");
    }

    // Check if driver has assigned students
    const activeAssignments = driver.assignedStudents.filter(
      (assignment) => assignment.active
    );
    if (activeAssignments.length > 0) {
      throwBadRequest(
        "Cannot delete driver with active student assignments. Please reassign students first."
      );
    }

    await Driver.findByIdAndDelete(driver_id, { session });
    return { _id: driver_id };
  });

  return sendSuccess(res, result, "Driver deleted successfully");
});

/**
 * Get driver information for parent's child
 * GET /api/drivers/parent/:student_id
 * Parent access only
 */
export const getDriverForParent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const parentId = req.user.id;

  // Verify parent-student relationship
  const relationship = await ParentStudentRelation.findOne({
    parent_id: parentId,
    student_id: student_id,
    active: true,
  });

  if (!relationship) {
    throwForbidden(
      "You don't have access to this student's driver information"
    );
  }

  // Find driver assigned to this student
  const driver = await Driver.findOne({
    "assignedStudents.student_id": student_id,
    "assignedStudents.active": true,
    status: "active",
  }).populate("assignedStudents.student_id", "fullName rollNum");

  if (!driver) {
    return sendSuccess(res, null, "No driver assigned to this student");
  }

  // Get the specific assignment for this student
  const studentAssignment = driver.assignedStudents.find(
    (assignment) =>
      assignment.student_id._id.toString() === student_id && assignment.active
  );

  // Return only necessary information for parents
  const driverInfo = {
    _id: driver._id,
    name: driver.name,
    phone: driver.phone,
    photoUrl: driver.photoUrl,
    vehicle: {
      make: driver.vehicle.make,
      model: driver.vehicle.model,
      color: driver.vehicle.color,
      plateNumber: driver.vehicle.plateNumber,
      photoUrl: driver.vehicle.photoUrl,
    },
    route: {
      name: driver.route.name,
      description: driver.route.description,
    },
    schedule: driver.schedule,
    studentAssignment: {
      pickupStop: studentAssignment.pickupStop,
      dropoffStop: studentAssignment.dropoffStop,
    },
    emergencyContact: driver.emergencyContact,
  };

  return sendSuccess(
    res,
    driverInfo,
    "Driver information retrieved successfully"
  );
});

/**
 * Assign student to driver
 * POST /api/drivers/:driver_id/assign-student
 * Admin only
 */
export const assignStudentToDriver = asyncHandler(async (req, res) => {
  const { driver_id } = req.params;
  const { student_id, pickupStop, dropoffStop } = req.body;

  const result = await withTransaction(async (session) => {
    const driver = await Driver.findById(driver_id).session(session);
    if (!driver) {
      throwNotFound("Driver");
    }

    const student = await Student.findById(student_id).session(session);
    if (!student) {
      throwNotFound("Student");
    }

    // Check if student is already assigned to this driver
    const existingAssignment = driver.assignedStudents.find(
      (assignment) =>
        assignment.student_id.toString() === student_id && assignment.active
    );

    if (existingAssignment) {
      throwConflict("Student is already assigned to this driver");
    }

    // Check if student is assigned to another driver
    const otherDriverAssignment = await Driver.findOne({
      "assignedStudents.student_id": student_id,
      "assignedStudents.active": true,
      _id: { $ne: driver_id },
    }).session(session);

    if (otherDriverAssignment) {
      throwConflict("Student is already assigned to another driver");
    }

    // Check vehicle capacity
    const activeAssignments = driver.assignedStudents.filter(
      (assignment) => assignment.active
    );
    if (activeAssignments.length >= driver.vehicle.capacity) {
      throwBadRequest("Driver vehicle has reached maximum capacity");
    }

    // Add student assignment
    driver.assignedStudents.push({
      student_id,
      pickupStop,
      dropoffStop,
      active: true,
      assignedDate: new Date(),
    });

    driver.updatedBy = req.user.id;
    await driver.save({ session });

    return driver;
  });

  return sendSuccess(res, result, "Student assigned to driver successfully");
});

/**
 * Remove student from driver
 * DELETE /api/drivers/:driver_id/students/:student_id
 * Admin only
 */
export const removeStudentFromDriver = asyncHandler(async (req, res) => {
  const { driver_id, student_id } = req.params;

  const result = await withTransaction(async (session) => {
    const driver = await Driver.findById(driver_id).session(session);
    if (!driver) {
      throwNotFound("Driver");
    }

    const assignmentIndex = driver.assignedStudents.findIndex(
      (assignment) =>
        assignment.student_id.toString() === student_id && assignment.active
    );

    if (assignmentIndex === -1) {
      throwNotFound("Student assignment not found");
    }

    // Deactivate the assignment instead of removing it (for history)
    driver.assignedStudents[assignmentIndex].active = false;
    driver.updatedBy = req.user.id;

    await driver.save({ session });
    return driver;
  });

  return sendSuccess(res, result, "Student removed from driver successfully");
});

/**
 * Get driver statistics
 * GET /api/drivers/statistics
 * Admin/Teacher access
 */
export const getDriverStatistics = asyncHandler(async (req, res) => {
  const totalDrivers = await Driver.countDocuments();
  const activeDrivers = await Driver.countDocuments({ status: "active" });
  const inactiveDrivers = await Driver.countDocuments({ status: "inactive" });
  const maintenanceDrivers = await Driver.countDocuments({
    status: "maintenance",
  });

  // Get total assigned students
  const driversWithStudents = await Driver.find({ status: "active" });
  const totalAssignedStudents = driversWithStudents.reduce((total, driver) => {
    return (
      total +
      driver.assignedStudents.filter((assignment) => assignment.active).length
    );
  }, 0);

  // Get average capacity utilization
  const totalCapacity = driversWithStudents.reduce((total, driver) => {
    return total + driver.vehicle.capacity;
  }, 0);

  const capacityUtilization =
    totalCapacity > 0 ? (totalAssignedStudents / totalCapacity) * 100 : 0;

  const statistics = {
    totalDrivers,
    activeDrivers,
    inactiveDrivers,
    maintenanceDrivers,
    totalAssignedStudents,
    totalCapacity,
    capacityUtilization: Math.round(capacityUtilization * 100) / 100,
  };

  return sendSuccess(
    res,
    statistics,
    "Driver statistics retrieved successfully"
  );
});
