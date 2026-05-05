import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { normalizarTipoUsuarioApi } from '../db/initDb';
import { cidades, ufs, usuarios } from '../db/schema';

export const usuariosRouter = Router();

usuariosRouter.get('/', (_req, res) => {
  const rows = db
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
    .all();
  res.json(rows);
});

usuariosRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
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
    .where(eq(usuarios.id, id))
    .get();
  if (!row) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json(row);
});

usuariosRouter.post('/', (req, res) => {
  const { nome, email, senha, tipoUsuario, cidadeId, ufId } = req.body ?? {};
  if (!nome || !email || !senha || cidadeId == null || ufId == null) {
    return res.status(400).json({ erro: 'nome, email, senha, cidadeId e ufId são obrigatórios' });
  }
  const bruto = String(tipoUsuario ?? 'consumidor').trim().toLowerCase();
  const tipo =
    bruto === 'prestador'
      ? 'prestador'
      : bruto === 'consumidor' || bruto === 'cliente'
        ? 'consumidor'
        : null;
  if (tipo == null) {
    return res.status(400).json({ erro: 'tipoUsuario deve ser consumidor ou prestador' });
  }
  const cId = Number(cidadeId);
  const uId = Number(ufId);
  if (Number.isNaN(cId) || Number.isNaN(uId)) {
    return res.status(400).json({ erro: 'cidadeId e ufId devem ser numéricos' });
  }
  try {
    const inserted = db
      .insert(usuarios)
      .values({
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        senha: String(senha),
        tipoUsuario: tipo,
        cidadeId: cId,
        ufId: uId,
      })
      .returning()
      .all();
    const r = inserted[0];
    res.status(201).json(r);
  } catch {
    res.status(409).json({ erro: 'Email já cadastrado ou FK inválida' });
  }
});

usuariosRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
  const atual = db.select().from(usuarios).where(eq(usuarios.id, id)).get();
  if (!atual) return res.status(404).json({ erro: 'Usuário não encontrado' });
  const { nome, email, senha, tipoUsuario, cidadeId, ufId } = req.body ?? {};
  try {
    const updated = db
      .update(usuarios)
      .set({
        nome: nome != null ? String(nome).trim() : atual.nome,
        email: email != null ? String(email).trim().toLowerCase() : atual.email,
        senha: senha != null ? String(senha) : atual.senha,
        tipoUsuario:
          tipoUsuario != null ? normalizarTipoUsuarioApi(String(tipoUsuario)) : atual.tipoUsuario,
        cidadeId: cidadeId != null ? Number(cidadeId) : atual.cidadeId,
        ufId: ufId != null ? Number(ufId) : atual.ufId,
      })
      .where(eq(usuarios.id, id))
      .returning()
      .all();
    res.json(updated[0]);
  } catch {
    res.status(409).json({ erro: 'Não foi possível atualizar' });
  }
});

usuariosRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
  const rem = db.delete(usuarios).where(eq(usuarios.id, id)).returning().all();
  if (rem.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
  res.json({ ok: true, removido: rem[0] });
});
