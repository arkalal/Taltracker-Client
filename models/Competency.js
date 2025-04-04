import mongoose from "mongoose";

const CompetencySchema = new mongoose.Schema({
  competencies: {
    type: [String],
    required: [true, "At least one competency is required"],
  },
  type: {
    type: String,
    required: [true, "Competency type is required"],
    enum: ["Technical", "Functional", "Behavioral"],
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // New fields for competency levels
  levels: {
    type: [[String]], // Array of arrays: [competencyIndex][levelIndex]
    default: [],
  },
  hasLevels: {
    type: Boolean,
    default: false,
  },
});

// Compound index to ensure uniqueness of role + competency type combination
CompetencySchema.index({ roleId: 1, type: 1 }, { unique: true });

export default mongoose.models.Competency ||
  mongoose.model("Competency", CompetencySchema);
