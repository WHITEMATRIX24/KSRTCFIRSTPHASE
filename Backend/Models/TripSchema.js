import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    vehicle_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Vehicles'
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Drivers'
    },
    conductor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Conductors'
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
    },
    departure_location: {
        depo: {
            type: String,
            required:true
        },
        city: {
            type: String,
        },
        address: {
            type: String
        },
        lat: {
            type: Number
        },
        lon: {
            type: Number
        }
    },
    arrival_location: {
        depo: {
            type: String,
            required:true
        },
        city: {
            type: String,
        },
        address: {
            type: String
        },
        lat: {
            type: Number
        },
        lon: {
            type: Number
        }
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
    },
    status: {
        type: String,
        enum: ["live", "completed", "delayed", "failed", "upcoming"],
        default: 'upcoming'
    },
    distance_traveled: {
        type: Number
    },
    revenue_generated: {
        type: Number
    },
    issues_reported: [
        {
            issue_time: {
                type: Date
            },
            description: {
                type: String
            },
            resolved: {
                type: Boolean
            },
            resolution_details: {
                type: String
            }
        }
    ],
    trip_id: {
        type: String,
        required: true,
    },
    trip_type: {
        type: String,
        enum: ["outbound", "return"]
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    fuelCost: {
        type: Number
    },
    collection_amount: {
        type: Number
    }
});

// Create the model
const Trips = mongoose.model('Trips', tripSchema);

// Export the model as default
export default Trips;
