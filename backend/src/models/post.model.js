import mongoose from "mongoose";
import { Schema } from "mongoose";

// 13. Post Schema (For "Wall")
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Text content of the post
    imageUrl: { type: String }, // For photo
    videoUrl: { type: String }, // For video content [cite: 6]
    // Consider allowing multiple images/videos per post [cite: 12]
    // media: [{ type: { type: String, enum: ['image', 'video'] }, url: String }],
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who is a teacher or admin [cite: 6]
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
