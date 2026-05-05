import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { cidades } from '../db/schema';

export const cidadesRouter = Router();

cidadesRouter.get('/', (req, res) => {
  const ufId = req.query.ufId != null ? Number(req.query.ufId) : NaN;
  if (!Number.isNaN(ufId) && req.query.ufId !== undefined) {
    const rows = db.select().from(cidades).where(eq(cidades.ufId, ufId)).all();
    return res.json(rows);
  }
  const rows = db.select().from(cidades).all();
  res.json(rows);
});

cidadesRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
  const row = db.select().from(cidades).where(eq(cidades.id, id)).get();
  if (!row) return res.status(404).json({ erro: 'Cidade não encontrada' });
  res.json(row);
});

cidadesRouter.post('/', (req, res) => {
  const { nome, ufId } = req.body ?? {};
  if (!nome || ufId == null) return res.status(400).json({ erro: 'nome e ufId são obrigatórios' });
  const uf = Number(ufId);
  if (Number.isNaN(uf)) return res.status(400).json({ erro: 'ufId inválido' });
  try {
    const r = db.insert(cidades).values({ nome: String(nome), ufId: uf }).returning().all()[0];
    res.status(201).json(r);
  } catch {
    res.status(400).json({ erro: 'Não foi possível criar a cidade' });
  }
});

cidadesRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
  const { nome, ufId } = req.body ?? {};
  const atual = db.select().from(cidades).where(eq(cidades.id, id)).get();
  if (!atual) return res.status(404).json({ erro: 'Cidade não encontrada' });
  try {
    const r = db
      .update(cidades)
      .set({
        nome: nome != null ? String(nome) : atual.nome,
        ufId: ufId != null ? Number(ufId) : atual.ufId,
      })
      .where(eq(cidades.id, id))
      .returning()
      .all()[0];
    res.json(r);
  } catch {
    res.status(400).json({ erro: 'Não foi possível atualizar' });
  }
});

cidadesRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
  try {
    const rem = db.delete(cidades).where(eq(cidades.id, id)).returning().all();
    const r = rem[0];
    if (!r) return res.status(404).json({ erro: 'Cidade não encontrada' });
    res.json({ ok: true, removido: r });
  } catch {
    res.status(409).json({ erro: 'Não é possível excluir: existem usuários vinculados' });
  }
});
