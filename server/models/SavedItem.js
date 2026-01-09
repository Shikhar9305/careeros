import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    itemType: {
      type: String,
      enum: ["College", "Course"],
      required: true,
    },

    // Reference to the saved entity (college OR course)
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemType",
    },

    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate saves:
 * One user can save the same item only once
 */
savedItemSchema.index(
  { user: 1, itemType: 1, itemId: 1 },
  { unique: true }
);

export default mongoose.model("SavedItem", savedItemSchema);
