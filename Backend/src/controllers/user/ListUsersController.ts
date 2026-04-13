import { Request, Response } from "express";
import prisma from "../../prisma/index";

class ListUsersController {
    async handle(_req: Request, res: Response) {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, createdAt: true }
        });
        return res.json(users);
    }
}

export { ListUsersController };
