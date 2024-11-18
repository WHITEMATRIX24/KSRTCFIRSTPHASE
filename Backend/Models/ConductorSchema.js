import mongoose from "mongoose";

const conductorSchema = new mongoose.Schema({
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
    required: true,
  },
  is_permanent: {
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
const Conductors = mongoose.model("Conductors", conductorSchema);

// Export the model
export default Conductors;
