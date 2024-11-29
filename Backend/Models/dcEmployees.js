import mongoose from "mongoose";

const dcEmployeesSchema = new mongoose.Schema({
  EmployeeName: {
    type: String,
    required: true,
  },
  PEN: {
    type: String,
    required: true,
    unique: true,
  },
  Designation: {
    type: String,
    required: true,
  },
  UNIT: {
    type: String,
  },
  is_Permanent: {
    type: String,
    enum: ["Badali", "Permanent"],
  },
  on_leave: {
    type: String,
    enum: ["Leave", "Available"],
    default: "Available",
  },
  phone: {
    type: Number,
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const DCEmployees = mongoose.model("dcEmployees", dcEmployeesSchema);

// Export the model as default
export default DCEmployees;
