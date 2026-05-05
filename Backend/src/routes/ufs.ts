import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { ufs } from '../db/schema';

export const ufsRouter = Router();

ufsRouter.get('/', (_req, res) => {
  const rows = db.select().from(ufs).all();
  res.json(rows);
});

ufsRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
  const row = db.select().from(ufs).where(eq(ufs.id, id)).get();
  if (!row) return res.status(404).json({ erro: 'UF não encontrada' });
  res.json(row);
});

ufsRouter.post('/', (req, res) => {
  const { nome, sigla } = req.body ?? {};
  if (!nome || !sigla) return res.status(400).json({ erro: 'nome e sigla são obrigatórios' });
  try {
    const r = db.insert(ufs).values({ nome: String(nome), sigla: String(sigla).toUpperCase() }).returning().all()[0];
    res.status(201).json(r);
  } catch {
    res.status(409).json({ erro: 'Sigla duplicada ou dados inválidos' });
  }
});

ufsRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
  const { nome, sigla } = req.body ?? {};
  if (!nome && !sigla) return res.status(400).json({ erro: 'Informe nome ou sigla' });
  const atual = db.select().from(ufs).where(eq(ufs.id, id)).get();
  if (!atual) return res.status(404).json({ erro: 'UF não encontrada' });
  try {
    const r = db
      .update(ufs)
      .set({
        nome: nome != null ? String(nome) : atual.nome,
        sigla: sigla != null ? String(sigla).toUpperCase() : atual.sigla,
      })
      .where(eq(ufs.id, id))
      .returning()
      .all()[0];
    res.json(r);
  } catch {
    res.status(409).json({ erro: 'Não foi possível atualizar' });
  }
});

ufsRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ erro: 'id inválido' });
  try {
    const rem = db.delete(ufs).where(eq(ufs.id, id)).returning().all();
    const r = rem[0];
    if (!r) return res.status(404).json({ erro: 'UF não encontrada' });
    res.json({ ok: true, removido: r });
  } catch {
    res.status(409).json({ erro: 'Não é possível excluir: existem cidades vinculadas' });
  }
});
