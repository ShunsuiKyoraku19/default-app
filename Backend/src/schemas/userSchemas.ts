import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    nome: z.string({ message: "O nome precisa ser um texto" })
      .min(3, "Seu nome precisa ter no minimo 3 letras"),
    
    email: z.string({ message: "O email precisa ser um texto válido" })
      .email("Precisa ser um email válido to ligeiro rapaaa"),
    
    senha: z.string({ message: "A senha e obrigatoria" })
      .min(6, "Sua senha precisa ter no minimo 6 caracteres"),
      
  })
});