import "dotenv/config";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const TOKEN_EXPIRES_IN = "1d";

/**
 * Generate JWT & simpan ke UserToken
 */
export const generateToken = async (userId) => {
    // hitung expiredAt
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 1);

    // delete token lama
    deleteToken(userId);

    // buat record dulu untuk dapatkan ID token
    const tokenRecord = await prisma.userToken.create({
        data: {
            userId,
            expiredAt,
        },
    });

    // generate JWT dengan `sub` dan `jti`
    const token = jwt.sign(
        {
            sub: String(userId),        // subject
            jti: String(tokenRecord.id) // JWT ID
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRES_IN }
    );


    return token;
};


/**
 * Verifikasi JWT
 */
export const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // cek token berdasarkan jti
        const tokenRecord = await prisma.userToken.findFirst({
            where: {
                id: Number(decoded.jti),
                userId: Number(decoded.sub),
                expiredAt: {
                    gt: new Date(),
                },
            },
        });

        if (!tokenRecord) {
            throw new Error("Token expired / tidak valid di database");
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(decoded.sub) },
        });

        if (!user) {
            throw new Error("User tidak ditemukan");
        }

        return user;
    } catch (err) {
        throw new Error("Token tidak valid");
    }
};

export const handleLogout = async (req, res) => {
    const user = req.user;
    await deleteToken(user.id);
    return true;
}

/**
 * Hapus token user (logout semua device)
 */
export const deleteToken = async (userId) => {
    await prisma.userToken.deleteMany({
        where: { userId },
    });
};
