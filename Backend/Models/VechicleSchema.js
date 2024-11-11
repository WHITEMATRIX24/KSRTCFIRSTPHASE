import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    // add enum
    model: {
        type: String,
        enum: ["Ashok Leyland", "Bharath Benzs"],
        required: true
    },
    status: {
        type: String,
        enum: ["enroute", "available", "maintenance", "out_of_services"],
        required: true
    },
    transport_type: {
        type: String,
        enum: ["deluxe", "super", "superfast"],
        required: true
    },
    odometer: {
        type: String,
        default: null,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drivers'
    },
    // extra added condition and fuelconsumption
    // condition:{
    //     type: String,
    //     enum: ["Good","Bad"],
    //     required: true
    // },
    fuelconsumption: {
        type: String,
        default: null,

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
        type: Date
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
