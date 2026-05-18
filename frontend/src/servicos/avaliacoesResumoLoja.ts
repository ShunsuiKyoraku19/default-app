import { obterLojaPorId } from '../constantes/lojasFicticias';
import type { AvaliacaoOficina } from '../tipos/loja';
import { carregarAvaliacoesLocaisDaLoja } from './avaliacoesLocaisLoja';

export type ResumoAvaliacaoLoja = {
  mediaTexto: string;
  total: number;
  mediaNumero: number;
  contagemPorEstrela: [number, number, number, number, number];
  listaComentarios: AvaliacaoOficina[];
};

function estrelaValida(n: number): n is 1 | 2 | 3 | 4 | 5 {
  return n >= 1 && n <= 5;
}

export async function obterResumoAvaliacaoLoja(lojaId: string): Promise<ResumoAvaliacaoLoja> {
  const loja = obterLojaPorId(lojaId);
  const mock = loja?.avaliacoesLista ?? [];
  const locais = await carregarAvaliacoesLocaisDaLoja(lojaId);
  const locaisPub: AvaliacaoOficina[] = locais.map(({ nome, data, estrelas, texto }) => ({
    nome,
    data,
    estrelas,
    texto,
  }));
  const todas: AvaliacaoOficina[] = [...locaisPub, ...mock];

  const contagem: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  let soma = 0;
  let qtd = 0;
  for (const a of todas) {
    if (!estrelaValida(a.estrelas)) continue;
    soma += a.estrelas;
    qtd += 1;
    contagem[5 - a.estrelas] += 1;
  }

  if (qtd === 0) {
    const fallback = loja != null ? parseFloat(String(loja.nota).replace(',', '.')) : NaN;
    const mediaTexto = Number.isFinite(fallback) ? fallback.toFixed(1) : '—';
    return {
      mediaTexto,
      total: todas.length,
      mediaNumero: Number.isFinite(fallback) ? fallback : 0,
      contagemPorEstrela: [0, 0, 0, 0, 0],
      listaComentarios: todas,
    };
  }

  const media = soma / qtd;
  return {
    mediaTexto: media.toFixed(1),
    total: todas.length,
    mediaNumero: media,
    contagemPorEstrela: contagem,
    listaComentarios: todas,
  };
}
