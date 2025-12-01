import {prisma} from '../config/prisma';
import bcrypt from "bcrypt";
import { generateToken } from '../libs/token';

export const Login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await prisma.user.findUnique({
        where: {
            email: email,
            userStatusId: 1
        },
    });

    if (!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    const check = await bcrypt.compareSync(password, user.password);

    if (!check) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    const token = await generateToken(user.id);

    res.json({
        token: token
    })
}

export const Register = (req, res) => {
    res.json({ user: 'tobi' })
}