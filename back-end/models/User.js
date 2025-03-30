import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Removes leading/trailing whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email uniqueness
        lowercase: true, // Stores emails in lowercase
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Restricts role values
        default: 'user'  // Default role is 'user'
    },
    image: {
        type: String, // You might store the image URL or path here
        default: null // or some default image URL if you have one
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


// Middleware to update the updatedAt field on each save
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});



const User = mongoose.model("User", userSchema);

export default User;
