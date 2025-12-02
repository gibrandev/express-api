import {prisma} from '../config/prisma';
import bcrypt from "bcrypt";

export const CreateUser = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;
    const roleIds = req.body.roleIds;
    const userStatusId = parseInt(req.body.userStatusId);

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
        return res.status(400).json({ message: "roleIds must be a non-empty array" });
    }

    const check = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (check) {
        return res.status(400).json({ message: "Email already exists" });
    }

    password = await bcrypt.hash(password, 10);

    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: name,
                    email: email,
                    password: password,
                    userStatusId: userStatusId
                }
            });

            // Assign new roles
            const assignments = roleIds.map(roleId => ({ userId: user.id, roleId }));
            await tx.userRole.createMany({
                data: assignments
            });

            res.json({ message: "User has been created" });
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const GetUser = async (req, res) => {
    const user = await prisma.user.findMany();
    res.json(user);
}

export const GetUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
}

export const UpdateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;
    const roleIds = req.body.roleIds;
    const userStatusId = parseInt(req.body.userStatusId);

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
        return res.status(400).json({ message: "roleIds must be a non-empty array" });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        omit: {
            password: false
        },
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const exists = await prisma.user.findUnique({
        where: { email }
    });

    if (exists && exists.id !== id) {
        return res.status(400).json({ message: "Email already used" });
    }

    password = password ? await bcrypt.hash(password, 10) : user.password;

    try {
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: id,
                },
                data: {
                    name: name,
                    email: email,
                    password: password,
                    userStatusId: userStatusId
                },
            })

            // Remove existing roles
            await tx.userRole.deleteMany({
                where: {userId: id }
            });

            // Assign new roles
            const assignments = roleIds.map(roleId => ({ userId: id, roleId }));

            await tx.userRole.createMany({
                data: assignments
            });

            res.json({ message: "User has been updated" });
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const DeleteUser = async (req, res) => {
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
        where: {
            id: id
        }
    });

    res.json({ message: "User has been deleted" });
}