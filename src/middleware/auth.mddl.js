import { JWT } from "../utils/jwt.js";

export default async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"
    
    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    try {
        const decodedToken = JWT.VERIFY(token);
        if (!decodedToken || !decodedToken.id) {
            throw new Error('Invalid token');
        }
        
        req.userId = decodedToken.id; // User ID ni requestga qo'shamiz
        return next();

    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
