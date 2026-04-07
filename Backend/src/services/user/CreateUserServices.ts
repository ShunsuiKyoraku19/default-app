import PrismaClient from '../../prisma/index';

interface createUserProps {
    nome: string;
    email: string;
    senha: string;
}

class CreateUserServices {
    async execute({ nome, email, senha }: createUserProps) { // MEtodo para executar a criação do usuário recebendo as propriedades definidas na interface  

        const user = await PrismaClient.user.create({
            data: {
                name: nome,
                email,
                password: senha,
            }
        });

        return user.name; 
    }
}

export { CreateUserServices };