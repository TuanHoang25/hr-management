import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
const login = async (req, res) => {
    try {
        const { name, password } = req.body;
        //  console.log(`Received login request for Name: ${name}`);
        const user = await User.findOne({ name });
        // console.log({ name, password });
        if (!user) {
            console.log('Name not found in database');
            return res.status(404).json({ success: false, error: 'Khong ton tai email' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ success: false, error: 'Password khong chinh xac' });
        }
        const employee = await Employee.findOne({ userId: user._id });
        if (employee) {
            employee.location = req.body.location;
            await employee.save();
        }
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.status(200).json({ success: true, token, user: { email: user.email, name: user.name, _id: user._id, role: user.role, image: user.image } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
const verify = async (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
};
export { login, verify };