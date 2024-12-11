import mongoose from "mongoose";

const pambaChainSchema = new mongoose.Schema({
  numberOfBuses: {
    type: Number,
    required: true
  },
  numberOfTrips: {
    type: Number
  },
  numberOfStaffs: {
    type: Number,
    required: false
  },
  date: {
    type: Date,
    required: true
  }
});

// Create the model
const PambaChain = mongoose.model("PambaChainServices", pambaChainSchema);

// Export the model as default
export default PambaChain;
