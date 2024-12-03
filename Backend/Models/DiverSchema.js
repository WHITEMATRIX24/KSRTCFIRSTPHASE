import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
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
  is_Permanent: {
    type: String,
    enum: ["Badli", "Permanent"],
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
const Drivers = mongoose.model("Drivers", driverSchema);

// Export the model as default
export default Drivers;
