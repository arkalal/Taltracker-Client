import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  jobRole: {
    type: String,
    required: [true, "Job role is required"],
    trim: true,
  },
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
  },
  organization: {
    type: String,
    required: [true, "Organization is required"],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  jdLink: {
    type: String,
    default: "taltracker.com",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
