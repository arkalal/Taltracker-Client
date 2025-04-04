import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Employee name is required"],
    trim: true,
  },
  profileDescription: {
    type: String,
    required: [true, "Profile description is required"],
    trim: true,
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "Role is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  competencies: {
    technical: [String],
    functional: [String],
    behavioral: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);
