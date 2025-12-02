import {prisma} from '../config/prisma';

export const CreateRole = async (req, res, next) => {
    const { name, description, permissionIds } = req.body;

    const check = await prisma.role.findUnique({
        where: {
            name: name
        }
    });

    if (check) {
        return res.status(400).json({ message: "Role already exists" });
    }

    try {
        await prisma.$transaction(async (tx) => {
            const role = await tx.role.create({
                data: {
                    name: name,
                    description: description
                }
            });

            // Assign new permissions
            const assignments = permissionIds.map(permissionId => ({ roleId: role.id, permissionId }));
            await tx.rolePermission.createMany({
                data: assignments
            });

            res.json({ message: "Role has been created" });
        })
    } catch (err) {
        next(err);
    }
}

export const GetRole = async (req, res) => {
    const roles = await prisma.role.findMany();
    res.json(roles);
}

export const GetRoleById = async (req, res) => {
    const id = parseInt(req.params.id);
    const role = await prisma.role.findUnique({
        where: {
            id: id
        }
    });

    if (!role) {
        return res.status(404).json({ message: "Role not found" });
    }

    res.json(role);
}

export const UpdateRole = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { name, description, permissionIds } = req.body;

    const role = await prisma.role.findUnique({
        where: {
            id: id
        }
    });

    if (!role) {
        return res.status(404).json({ message: "Role not found" });
    }

    const exists = await prisma.role.findUnique({
        where: { name }
    });

    if (exists && exists.id !== id) {
        return res.status(400).json({ message: "Role name already used" });
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.role.update({
                where: {
                    id: id,
                },
                data: {
                    name: name,
                    description: description
                },
            });

            // Remove existing permissions
            await tx.rolePermission.deleteMany({
                where: {roleId: id }
            });

            // Assign new permissions
            const assignments = permissionIds.map(permissionId => ({ roleId: id, permissionId }));
            await tx.rolePermission.createMany({
                data: assignments
            });

            res.json({ message: "Role has been updated" });
        })
    } catch (err) {
        next(err);
    }
}

export const DeleteRole = async (req, res) => {
    const id = parseInt(req.params.id);

    const role = await prisma.role.findUnique({
        where: {
            id: id
        }
    });

    if (!role) {
        return res.status(404).json({ message: "Role not found" });
    }

    await prisma.role.delete({
        where: {
            id: id
        }
    });

    res.json({ message: "Role has been deleted" });
}