import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    role: {
        type: String,
        enum: ["Conductor", "Driver"],
        default: "Driver",
        // required: true
    },
    is_permanent: {
        type: String,
        enum: ["Temporary", "Permanent"]
    },
    salary: {
        type: Number,
        // required: true
    },
    salary_frequency: {
        type: String,
        enum: ["daily", "monthly"],
        default: "daily"
        // required: true
    },
    on_leave: {
        type: String,
        enum: ["Leave", "Available"],
        default: "Available"
    },
    license_number: {
        type: String,
        unique: true
    },
    contact_info: {
        phone: {
            type: String,
            unique: true
        }
    },
    emergency_contact: {
        type: Number,
        required: true
    },
    assigned_vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicles'
    }],
    blood_group: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Drivers = mongoose.model('Drivers', driverSchema);

// Export the model as default
export default Drivers;
