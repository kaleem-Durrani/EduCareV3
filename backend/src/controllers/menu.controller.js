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
  const { startDate, endDate, menuItems } = req.body;

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

    const newMenu = new WeeklyMenu({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      menuItems,
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
 * Get current week's menu
 * GET /api/menu/weekly
 * Public access (all authenticated users)
 */
export const getCurrentWeeklyMenu = asyncHandler(async (req, res) => {
  const today = new Date();

  // Find menu that includes today's date
  const currentMenu = await WeeklyMenu.findOne({
    startDate: { $lte: today },
    endDate: { $gte: today },
  })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  if (!currentMenu) {
    throwNotFound("Current week's menu");
  }

  return sendSuccess(
    res,
    currentMenu,
    "Current week's menu retrieved successfully"
  );
});

/**
 * Update weekly menu
 * PUT /api/menu/weekly/:menu_id
 * Admin only
 */
export const updateWeeklyMenu = asyncHandler(async (req, res) => {
  const { menu_id } = req.params;
  const { startDate, endDate, menuItems } = req.body;

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

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (menuItems !== undefined) updateData.menuItems = menuItems;

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
