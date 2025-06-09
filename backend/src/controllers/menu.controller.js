import WeeklyMenu from "../models/weeklyMenu.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwConflict,
} from "../utils/transaction.utils.js";

/**
 * Create weekly menu
 * POST /api/menu/weekly
 * Admin only
 */
export const createWeeklyMenu = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    startDate,
    endDate,
    menuData,
    status = "draft",
  } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if menu already exists for this date range
    const existingMenu = await WeeklyMenu.findOne({
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    }).session(session);

    if (existingMenu) {
      throwConflict("Menu already exists for this date range");
    }

    // If setting as active, deactivate other active menus
    if (status === "active") {
      await WeeklyMenu.updateMany(
        { isActive: true },
        { isActive: false, status: "archived" },
        { session }
      );
    }

    const newMenu = new WeeklyMenu({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      menuData,
      status,
      isActive: status === "active",
      createdBy: req.user.id,
    });

    await newMenu.save({ session });

    const populatedMenu = await WeeklyMenu.findById(newMenu._id)
      .populate("createdBy", "name email")
      .session(session);

    return populatedMenu;
  });

  return sendSuccess(res, result, "Weekly menu created successfully", 201);
});

/**
 * Get all menus with pagination, search, and filters
 * GET /api/menus
 * Admin only
 */
export const getAllMenus = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Status filter
  if (status && status !== "all") {
    query.status = status;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Sort configuration
  const sortConfig = {};
  sortConfig[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Get total count for pagination
  const total = await WeeklyMenu.countDocuments(query);

  // Get paginated menus
  const menus = await WeeklyMenu.find(query)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .sort(sortConfig)
    .skip(skip)
    .limit(parseInt(limit));

  const result = {
    menus,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, result, "Menus retrieved successfully");
});

/**
 * Get current week's menu or active menu
 * GET /api/menu/current
 * Public access (all authenticated users)
 */
export const getCurrentWeeklyMenu = asyncHandler(async (req, res) => {
  // First try to find active menu
  let currentMenu = await WeeklyMenu.findOne({ isActive: true })
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  // If no active menu, try to find menu for current week
  if (!currentMenu) {
    const today = new Date();
    currentMenu = await WeeklyMenu.findOne({
      startDate: { $lte: today },
      endDate: { $gte: today },
      status: { $ne: "archived" },
    })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 });
  }

  if (!currentMenu) {
    return sendSuccess(res, null, "No current menu found");
  }

  return sendSuccess(res, currentMenu, "Current menu retrieved successfully");
});

/**
 * Get menu statistics
 * GET /api/menus/statistics
 * Admin only
 */
export const getMenuStatistics = asyncHandler(async (req, res) => {
  const { year } = req.query;

  // Build query for year filter
  let query = {};
  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    query.createdAt = { $gte: startDate, $lte: endDate };
  }

  const [
    totalMenus,
    activeMenus,
    draftMenus,
    archivedMenus,
    totalItemsAgg,
    avgItemsAgg,
  ] = await Promise.all([
    WeeklyMenu.countDocuments(query),
    WeeklyMenu.countDocuments({ ...query, status: "active" }),
    WeeklyMenu.countDocuments({ ...query, status: "draft" }),
    WeeklyMenu.countDocuments({ ...query, status: "archived" }),
    WeeklyMenu.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$totalItems" } } },
    ]),
    WeeklyMenu.aggregate([
      { $match: query },
      { $group: { _id: null, avg: { $avg: "$totalItems" } } },
    ]),
  ]);

  const statistics = {
    totalMenus,
    activeMenus,
    draftMenus,
    archivedMenus,
    totalItems: totalItemsAgg[0]?.total || 0,
    avgItemsPerMenu: Math.round((avgItemsAgg[0]?.avg || 0) * 10) / 10,
    year: year || new Date().getFullYear(),
  };

  return sendSuccess(res, statistics, "Menu statistics retrieved successfully");
});

/**
 * Update weekly menu
 * PUT /api/menu/weekly/:menu_id
 * Admin only
 */
/**
 * Get menu by ID
 * GET /api/menus/:menu_id
 * Admin only
 */
export const getMenuById = asyncHandler(async (req, res) => {
  const { menu_id } = req.params;

  const menu = await WeeklyMenu.findById(menu_id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!menu) {
    throwNotFound("Menu");
  }

  return sendSuccess(res, menu, "Menu retrieved successfully");
});

/**
 * Update weekly menu
 * PUT /api/menus/:menu_id
 * Admin only
 */
export const updateWeeklyMenu = asyncHandler(async (req, res) => {
  const { menu_id } = req.params;
  const { title, description, startDate, endDate, menuData, status } = req.body;

  const result = await withTransaction(async (session) => {
    const menu = await WeeklyMenu.findById(menu_id).session(session);
    if (!menu) {
      throwNotFound("Weekly menu");
    }

    // Check if updated date range conflicts with other menus
    if (startDate || endDate) {
      const newStartDate = startDate ? new Date(startDate) : menu.startDate;
      const newEndDate = endDate ? new Date(endDate) : menu.endDate;

      const conflictingMenu = await WeeklyMenu.findOne({
        _id: { $ne: menu_id },
        $or: [
          {
            startDate: { $lte: newEndDate },
            endDate: { $gte: newStartDate },
          },
        ],
      }).session(session);

      if (conflictingMenu) {
        throwConflict("Updated date range conflicts with existing menu");
      }
    }

    // If setting as active, deactivate other active menus
    if (status === "active" && menu.status !== "active") {
      await WeeklyMenu.updateMany(
        { _id: { $ne: menu_id }, isActive: true },
        { isActive: false, status: "archived" },
        { session }
      );
    }

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (menuData !== undefined) updateData.menuData = menuData;
    if (status !== undefined) {
      updateData.status = status;
      updateData.isActive = status === "active";
    }

    const updatedMenu = await WeeklyMenu.findByIdAndUpdate(
      menu_id,
      updateData,
      { new: true, session }
    )
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return updatedMenu;
  });

  return sendSuccess(res, result, "Weekly menu updated successfully");
});

/**
 * Update menu status
 * PUT /api/menus/:menu_id/status
 * Admin only
 */
export const updateMenuStatus = asyncHandler(async (req, res) => {
  const { menu_id } = req.params;
  const { status } = req.body;

  const result = await withTransaction(async (session) => {
    const menu = await WeeklyMenu.findById(menu_id).session(session);
    if (!menu) {
      throwNotFound("Menu");
    }

    // If setting as active, deactivate other active menus
    if (status === "active") {
      await WeeklyMenu.updateMany(
        { _id: { $ne: menu_id }, isActive: true },
        { isActive: false, status: "archived" },
        { session }
      );
    }

    const updatedMenu = await WeeklyMenu.findByIdAndUpdate(
      menu_id,
      {
        status,
        isActive: status === "active",
        updatedBy: req.user.id,
      },
      { new: true, session }
    )
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return updatedMenu;
  });

  return sendSuccess(res, result, "Menu status updated successfully");
});

/**
 * Delete weekly menu
 * DELETE /api/menu/weekly/:menu_id
 * Admin only
 */
export const deleteWeeklyMenu = asyncHandler(async (req, res) => {
  const { menu_id } = req.params;

  const menu = await WeeklyMenu.findById(menu_id);
  if (!menu) {
    throwNotFound("Weekly menu");
  }

  await WeeklyMenu.findByIdAndDelete(menu_id);

  return sendSuccess(res, null, "Weekly menu deleted successfully");
});
