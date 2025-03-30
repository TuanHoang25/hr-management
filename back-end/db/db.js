import mongoose from "mongoose";

const connectDB = async () => {
    // const dbUser = process.env.DB_USER; // Use environment variables or replace with your actual credentials
    // const dbPassword = process.env.DB_PASSWORD;
    const dbUrl = process.env.DB_URL;
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB Atlas thanh cong');
    } catch (error) {
        console.error('connecting to MongoDB Atlas that bai:', error);
        process.exit(1); // Exit the process if the database connection fails
    }
};

export default connectDB;