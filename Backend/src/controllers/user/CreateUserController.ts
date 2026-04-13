import {} from '../../prisma/index' // nao precisa das chaves porque importei o prisma como defaut entao ja vai dierto 
import { Request, Response } from "express";
import { CreateUserServices } from '../../services/user/CreateUserServices'

class CreateUserController {
    async handle(req: Request, res: Response) {
        const { nome, email, senha } = req.body;

        console.log({ nome, email });

        const createUserService = new CreateUserServices();
        
        const user = await createUserService.execute( // Chamando o método execute da classe CreateUserServices e passando as propriedades necessárias para criar um usuário
            { 
                nome, 
                email, 
                senha,
            }
        );

        return res.json({ message: user });
    }
}

export { CreateUserController };