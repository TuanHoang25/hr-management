import bcrypt from 'bcrypt'; // Make sure you have bcrypt installed: npm install bcrypt
import User from './models/User.js';
import connectDB from './db/db.js';
const createAdminUser = async () => {
    connectDB();
    try {

        const saltRounds = 10; // Number of salt rounds for bcrypt (adjust as needed)
        const hashedPassword = await bcrypt.hash('admin', saltRounds);

        const newAdmin = new User({
            name: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword, // Store the hashed password
            role: 'admin'
        });

        const savedAdmin = await newAdmin.save();
        console.log('Admin user created:', savedAdmin);
    } catch (error) {
        console.error('Error creating admin user:', error);
        // Handle the error appropriately (e.g., log it, return an error response)
    }
}

createAdminUser();
