import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema({
    amount: {
        type: Number,
    },
    category: {
        type: String
    },
    description: {
        type: String
    },

    // <<<<<::::: Meta: JSON :::::::>>>>>
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Ledgers = mongoose.model('Ledgers', ledgerSchema);

// Export the model as default
export default Ledgers;
