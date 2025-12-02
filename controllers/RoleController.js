import {prisma} from '../config/prisma';

export const CreateRole = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;

    const check = await prisma.role.findUnique({
        where: {
            name: name
        }
    });

    if (check) {
        return res.status(400).json({ message: "Role already exists" });
    }

    await prisma.role.create({
        data: {
            name: name,
            description: description
        }
    });

    res.json({ message: "Role has been created" });
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

export const UpdateRole = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

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

    // jika nama sudah ada dan bukan milik role yang mau di update
    if (exists && exists.id !== id) {
        return res.status(400).json({ message: "Role name already used" });
    }

    await prisma.role.update({
        where: {
            id: id,
        },
        data: {
            name: name,
            description: description
        },
    })

    res.json({ message: "Role has been updated" });
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