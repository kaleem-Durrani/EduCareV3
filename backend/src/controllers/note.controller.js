import Note from "../models/note.model.js";
import Student from "../models/student.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
} from "../utils/transaction.utils.js";

/**
 * Get notes for a specific student with pagination and filters
 * GET /api/notes/student/:student_id
 * Query params: page, limit, dateFrom, dateTo, createdBy, sortBy, sortOrder
 */
export const getStudentNotes = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const {
    page = 1,
    limit = 10,
    dateFrom,
    dateTo,
    createdBy,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;


  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Check if student exists
  const student = await Student.findById(student_id);
  if (!student) {
    throwNotFound("Student not found");
  }

  // Build filter query
  const filterQuery = { student_id };

  // Date range filter
  if (dateFrom || dateTo) {
    filterQuery.createdAt = {};
    if (dateFrom) {
      filterQuery.createdAt.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      filterQuery.createdAt.$lte = new Date(dateTo);
    }
  }

  // Created by filter
  if (createdBy) {
    filterQuery.createdBy = createdBy;
  }

  // Build sort object
  const sortObj = {};
  sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Get notes with pagination and filters
  const notes = await Note.find(filterQuery)
    .populate('student_id', 'fullName photoUrl')
    .populate('createdBy', 'fullName role')
    .populate('updatedBy', 'fullName role')
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum);

  const totalNotes = await Note.countDocuments(filterQuery);
  const totalPages = Math.ceil(totalNotes / limitNum);

  sendSuccess(res, {
    notes,
    student: {
      _id: student._id,
      fullName: student.fullName,
      profilePicture: student.photoUrl
    },
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalItems: totalNotes,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
    filters: {
      dateFrom,
      dateTo,
      createdBy,
      sortBy,
      sortOrder
    }
  }, "Notes retrieved successfully");
});



/**
 * Create a new note
 * POST /api/notes
 */
export const createNote = asyncHandler(async (req, res) => {
  const { student_id, content } = req.body;
  const userId = req.user.id;

  // Check if student exists
  const student = await Student.findById(student_id);
  if (!student) {
    throwNotFound("Student not found");
  }

  const note = await withTransaction(async (session) => {
    const newNote = new Note({
      student_id,
      content,
      createdBy: userId,
      updatedBy: userId,
    });

    await newNote.save({ session });
    
    // Populate the note before returning
    await newNote.populate('student_id', 'fullName photoUrl');
    await newNote.populate('createdBy', 'fullName role');
    await newNote.populate('updatedBy', 'fullName role');
    
    return newNote;
  });

  sendSuccess(res, { note }, "Note created successfully", 201);
});

/**
 * Update a note
 * PUT /api/notes/:note_id
 */
export const updateNote = asyncHandler(async (req, res) => {
  const { note_id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const note = await Note.findById(note_id).populate('student_id');
  if (!note) {
    throwNotFound("Note not found");
  }

  const updatedNote = await withTransaction(async (session) => {
    const updated = await Note.findByIdAndUpdate(
      note_id,
      { 
        content,
        updatedBy: userId,
      },
      { new: true, session }
    );

    await updated.populate('student_id', 'fullName photoUrl');
    await updated.populate('createdBy', 'fullName role');
    await updated.populate('updatedBy', 'fullName role');
    
    return updated;
  });

  sendSuccess(res, { note: updatedNote }, "Note updated successfully");
});

/**
 * Delete a note
 * DELETE /api/notes/:note_id
 */
export const deleteNote = asyncHandler(async (req, res) => {
  const { note_id } = req.params;

  const note = await Note.findById(note_id).populate('student_id');
  if (!note) {
    throwNotFound("Note not found");
  }

  await withTransaction(async (session) => {
    await Note.findByIdAndDelete(note_id, { session });
  });

  sendSuccess(res, null, "Note deleted successfully");
});


