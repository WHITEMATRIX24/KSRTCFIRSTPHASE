import mongoose from 'mongoose';

const tripCollectionSchema = new mongoose.Schema({
  depot: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  Tripcollection: {
    type: Number,
    required: true,
  },
  numOfPassengers: {
    type: Number,
    required: true,
  },
  fuelCost: {
    type: Number,
    required:true
  }
});

// Create the model
const TripCollections = mongoose.model("Trip Collections", tripCollectionSchema);

// Export the model
export default TripCollections;
