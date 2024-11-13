import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    REGNO: {
        type: String,
        required: true,
        unique: true
    },
    BUSNO:{
        type: String,
        required: true,
        unique: true
    },
    CLASS: {
        type: String,
        required: true
    },
    ALLOTTEDDEPOT:{
        type: String,
        required:true 
    },
    status: {
        type: String,
        enum: [" in_service", "en_route", "doc"],
        required: true
    },
    maintenance_history: [
        {
            maintenance_date: {
                type: Date
            },
            issue_reported: {
                type: String
            },
            repair_done: {
                type: String
            },
            cost: {
                type: Number
            }
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Vehicles = mongoose.model('Vehicles', vehicleSchema);

// Export the model as default
export default Vehicles;
