import mongoose from "mongoose";
import { Schema } from "mongoose";

// 13. Post Schema (For "Wall")
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Text content of the post

    // Support for multiple media files (images and videos)
    media: [{
      type: { type: String, enum: ['image', 'video'], required: true },
      url: { type: String, required: true },
      filename: { type: String }, // Original filename for reference
      _id: false // Disable automatic _id for subdocuments
    }],

    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who is a teacher or admin
    audience: {
      type: {
        type: String,
        enum: ["all", "class", "individual"],
        default: "all",
      },
      class_ids: [{ type: Schema.Types.ObjectId, ref: "Class" }], // if audience.type is 'class'
      student_ids: [{ type: Schema.Types.ObjectId, ref: "Student" }], // if audience.type is 'individual'
    }, // Audience targeting [cite: 6, 12]
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
postSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
