import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/client';
import { cidades, ufs, usuarios } from '../db/schema';
import { normalizarTipoUsuarioApi } from '../db/initDb';

export const authRouter = Router();

/** Login simples (sem JWT): retorna perfil + cidade + UF para integração futura. */
authRouter.post('/login', (req, res) => {
  const { email, senha } = req.body ?? {};
  if (!email || !senha) return res.status(400).json({ erro: 'email e senha são obrigatórios' });
  const row = db
    .select({
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email,
      tipoUsuario: usuarios.tipoUsuario,
      cidadeId: usuarios.cidadeId,
      ufId: usuarios.ufId,
      cidadeNome: cidades.nome,
      ufSigla: ufs.sigla,
      ufNome: ufs.nome,
    })
    .from(usuarios)
    .leftJoin(cidades, eq(usuarios.cidadeId, cidades.id))
    .leftJoin(ufs, eq(usuarios.ufId, ufs.id))
    .where(and(eq(usuarios.email, String(email).trim().toLowerCase()), eq(usuarios.senha, String(senha))))
    .get();
  if (!row) return res.status(401).json({ erro: 'Credenciais inválidas' });
  const tipoUsuario = normalizarTipoUsuarioApi(row.tipoUsuario);
  res.json({
    usuario: {
      id: row.id,
      nome: row.nome,
      email: row.email,
      tipoUsuario,
      cidadeId: row.cidadeId,
      ufId: row.ufId,
      cidade: row.cidadeNome ? { nome: row.cidadeNome } : null,
      uf: row.ufSigla ? { sigla: row.ufSigla, nome: row.ufNome } : null,
    },
  });
});
