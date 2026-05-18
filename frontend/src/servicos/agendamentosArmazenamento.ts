import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AgendamentoSalvo, StatusAgendamentoSalvo } from '../tipos/agendamento';

const CHAVE = '@fluxcarr_agendamentos_v1';

function ordenarLista(lista: AgendamentoSalvo[]): AgendamentoSalvo[] {
  return [...lista].sort((a, b) => {
    const cancelA = a.status === 'Cancelado' ? 1 : 0;
    const cancelB = b.status === 'Cancelado' ? 1 : 0;
    if (cancelA !== cancelB) return cancelA - cancelB;
    return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
  });
}

export async function carregarAgendamentos(): Promise<AgendamentoSalvo[]> {
  try {
    const raw = await AsyncStorage.getItem(CHAVE);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AgendamentoSalvo[];
    if (!Array.isArray(parsed)) return [];
    return ordenarLista(parsed);
  } catch {
    return [];
  }
}

export async function salvarAgendamento(novo: AgendamentoSalvo): Promise<void> {
  const lista = await carregarAgendamentos();
  lista.push(novo);
  await AsyncStorage.setItem(CHAVE, JSON.stringify(ordenarLista(lista)));
}

export async function atualizarStatusAgendamento(
  id: string,
  status: StatusAgendamentoSalvo
): Promise<void> {
  const lista = await carregarAgendamentos();
  const idx = lista.findIndex((a) => a.id === id);
  if (idx < 0) return;
  const atual = lista[idx];
  if (!atual) return;
  lista[idx] = { ...atual, status };
  await AsyncStorage.setItem(CHAVE, JSON.stringify(ordenarLista(lista)));
}

export async function obterAgendamentoPorId(id: string): Promise<AgendamentoSalvo | null> {
  const lista = await carregarAgendamentos();
  return lista.find((a) => a.id === id) ?? null;
}
