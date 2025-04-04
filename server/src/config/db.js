import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in .env file");
        }

        console.log("Connecting to MongoDB...");
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Connected to MongoDB: ${connectionInstance.connection.name}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
