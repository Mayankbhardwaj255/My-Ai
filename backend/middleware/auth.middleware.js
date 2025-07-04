import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        // Prefer token from cookies, fallback to Authorization header
        let token = req.cookies?.token;

        if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token not provided" });
        }

        // Check if token is blacklisted in Redis
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            res.clearCookie("token");
            return res.status(401).json({ error: "Unauthorized: Token is blacklisted" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};
