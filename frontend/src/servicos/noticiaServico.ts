import { obterBanco } from '../banco/inicializarBanco';
import type { Noticia } from '../tipos/noticia';

export async function listarNoticias(): Promise<Noticia[]> {
  const banco = await obterBanco();
  const linhas = await banco.getAllAsync<Noticia>(
    'SELECT id, titulo, resumo, conteudo, categoria, data, imagem FROM noticias ORDER BY id DESC'
  );
  return linhas ?? [];
}

export async function buscarNoticiaPorId(id: number): Promise<Noticia | null> {
  const banco = await obterBanco();
  const linha = await banco.getFirstAsync<Noticia>(
    'SELECT id, titulo, resumo, conteudo, categoria, data, imagem FROM noticias WHERE id = ?',
    [id]
  );
  return linha ?? null;
}

export async function criarNoticia(dados: Omit<Noticia, 'id'>): Promise<number> {
  const banco = await obterBanco();
  const resultado = await banco.runAsync(
    `INSERT INTO noticias (titulo, resumo, conteudo, categoria, data, imagem) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      dados.titulo,
      dados.resumo,
      dados.conteudo,
      dados.categoria,
      dados.data,
      dados.imagem,
    ]
  );
  return Number(resultado.lastInsertRowId);
}

export async function atualizarNoticia(dados: Noticia): Promise<void> {
  const banco = await obterBanco();
  await banco.runAsync(
    `UPDATE noticias SET titulo = ?, resumo = ?, conteudo = ?, categoria = ?, data = ?, imagem = ? WHERE id = ?`,
    [
      dados.titulo,
      dados.resumo,
      dados.conteudo,
      dados.categoria,
      dados.data,
      dados.imagem,
      dados.id,
    ]
  );
}

export async function excluirNoticia(id: number): Promise<void> {
  const banco = await obterBanco();
  await banco.runAsync('DELETE FROM noticias WHERE id = ?', [id]);
}
