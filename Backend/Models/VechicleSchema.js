import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    REGNO: {
      type: String,
      required: true,
      unique: true,
    },
    BUSNO: {
      type: String,
      required: true,
      unique: true,
    },
    CLASS: {
      type: String,
      required: true,
    },
    ALLOTEDDEPOT: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["in_service", "en_route", "dock", "breakdown", "spare"],
      default: "spare",
      required: true,
    },
    dock_reason: {
      type: String,
    },
    dock_depot: {
      type: String,
    },
    breakdown_time: {
      type: String,
    },
    breakdown_depot: {
      type: String,
    },
    maintenance_data: {
      weekleyMaintenanceUpdateStatus: {
        type: Boolean,
        default: false,
      },
      lastWeekelyMaintenanceUpdateDate: {
        type: Date,
        default: null,
      },
      dailyMaintenanceUpdateStatus: {
        type: Boolean,
        default: false,
      },
      lastdailyMaintenanceUpdateDate: {
        type: Date,
        default: null,
      },
      weeklyMaintenanceDueDate: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

// Create the model
const Vehicles = mongoose.model("Vehicles", vehicleSchema);

// Export the model as default
export default Vehicles;
