import mongoose from 'mongoose';

const conductorSchema = new mongoose.Schema({
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
    // image: {
    //     type: String
    // },
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    role: {
        type: String,
        enum: ["Conductor", "Driver"],
        default: "Conductor",
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
    contact_info: {
        phone: {
            type: String,
            unique: true,
            // required:true
        }
    },
    assigned_vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicles'
    }],
    blood_group: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    },
    emergency_contact: {
        type: Number,
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
const Conductors = mongoose.model('Conductors', conductorSchema);

// Export the model
export default Conductors;
