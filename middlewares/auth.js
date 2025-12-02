import { verifyToken } from "../libs/token.js";

export default function() {
    return async function (req, res, next) {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "No token provided" });

        try {
            const user = await verifyToken(token);
            req.user = user;

            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};