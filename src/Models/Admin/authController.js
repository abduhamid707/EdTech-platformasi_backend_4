import User from './User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT } from '../../utils/jwt.js';

class AuthController {
    // 🔹 Ro‘yxatdan o‘tish (Signup)
    static async register(req, res) {
        try {
            const { email, password } = req.body;

            // Foydalanuvchi mavjudligini tekshirish
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: 'User already exists' });

            // Parolni hash qilish
            const hashedPassword = await bcrypt.hash(password, 10);

            // Yangi foydalanuvchini yaratish
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();

            const token = JWT.SIGN({ id: newUser._id });
            res.json({ token, newUser: { id: newUser._id, email: newUser.email } });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    // 🔹 Login qilish (Signin)
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Foydalanuvchini topish
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'Invalid email or password' });

            // Parolni tekshirish
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

            // JWT yaratish
        const token = JWT.SIGN({ id: user._id });
        res.json({ token, user: { id: user._id, email: user.email } });
        } catch (error) {
        console.log('error :', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
} 

export default AuthController;