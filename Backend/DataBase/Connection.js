import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectString = process.env.CONNECTION_STRING;

mongoose.connect(connectString)
    .then(() => {
        console.log("MongoDB Connection is Successful");
    })
    .catch((err) => {
        console.log('Connection Failed', err);
    });
