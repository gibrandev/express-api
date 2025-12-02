import {prisma} from '../config/prisma';

export const CreatePermission = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;

    const check = await prisma.permission.findUnique({
        where: {
            name: name
        }
    });

    if (check) {
        return res.status(400).json({ message: "Permission already exists" });
    }

    await prisma.permission.create({
        data: {
            name: name,
            description: description
        }
    });

    res.json({ message: "Permissions has been created" });
}

export const GetPermission = async (req, res) => {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
}

export const GetPermissionById = async (req, res) => {
    const id = parseInt(req.params.id);
    const permission = await prisma.permission.findUnique({
        where: {
            id: id
        }
    });

    if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
    }

    res.json(permission);
}

export const UpdatePermission = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    
    const permission = await prisma.permission.findUnique({
        where: {
            id: id
        }
    });

    if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
    }

    const exists = await prisma.permission.findUnique({
        where: { name }
    });

    if (exists && exists.id !== id) {
        return res.status(400).json({ message: "Permission name already used" });
    }

    await prisma.permission.update({
        where: {
            id: id,
        },
        data: {
            name: name,
            description: description
        },
    })

    res.json({ message: "Permission has been updated" });
}

export const DeletePermission = async (req, res) => {
    const id = parseInt(req.params.id);

    const permission = await prisma.permission.findUnique({
        where: {
            id: id
        }
    });

    if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
    }

    await prisma.permission.delete({
        where: {
            id: id
        }
    });

    res.json({ message: "Permission has been deleted" });
}