import { obterLojaPorId } from '../constantes/lojasFicticias';

export type CabecalhoSelecionar = {
  nota: string;
  distancia: string;
  status: string;
};

export function formatBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function cabecalhoSelecionarPorLojaId(lojaId: string): CabecalhoSelecionar {
  const loja = obterLojaPorId(lojaId);
  if (loja == null) return { nota: '—', distancia: '—', status: 'Aberto' };
  return { nota: loja.nota, distancia: loja.distanciaTexto, status: 'Aberto' };
}

export function listaServicosParaAgendarPorLojaId(lojaId: string) {
  const loja = obterLojaPorId(lojaId);
  return loja?.servicosAgendamento ?? [];
}

export function calcularTaxasResumo(subtotalServicos: number): {
  maoObra: number;
  taxaApp: number;
  total: number;
} {
  const maoObra = Math.round(subtotalServicos * 0.08 * 100) / 100;
  const taxaApp = 8.12;
  const total = Math.round((subtotalServicos + maoObra + taxaApp) * 100) / 100;
  return { maoObra, taxaApp, total };
}
