import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AvaliacaoOficina, AvaliacaoPersistida } from '../tipos/loja';
import type { SessaoUsuario } from '../tipos/usuario';

const CHAVE = '@fluxcarr_avaliacoes_loja_v1';

type Mapa = Record<string, AvaliacaoPersistida[]>;

function migrarItem(a: AvaliacaoOficina & { autorChave?: string }): AvaliacaoPersistida {
  const chave =
    typeof a.autorChave === 'string' && a.autorChave.length > 0
      ? a.autorChave
      : `n:${a.nome.trim().toLowerCase()}`;
  return {
    nome: a.nome,
    data: a.data,
    estrelas: a.estrelas,
    texto: a.texto,
    autorChave: chave,
  };
}

async function lerMapa(): Promise<Mapa> {
  try {
    const raw = await AsyncStorage.getItem(CHAVE);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (o == null || typeof o !== 'object') return {};
    const mapa: Mapa = {};
    for (const [lojaId, val] of Object.entries(o)) {
      if (!Array.isArray(val)) continue;
      mapa[lojaId] = val.map((x) => migrarItem(x as AvaliacaoOficina & { autorChave?: string }));
    }
    return mapa;
  } catch {
    return {};
  }
}

export function obterChaveAutorAvaliacao(usuario: SessaoUsuario | null): string {
  const email = usuario?.email?.trim().toLowerCase();
  if (email && email.length > 0) return `e:${email}`;
  const nome = usuario?.nome?.trim().toLowerCase();
  if (nome && nome.length > 0) return `n:${nome}`;
  return 'n:visitante';
}

export async function carregarAvaliacoesLocaisDaLoja(lojaId: string): Promise<AvaliacaoPersistida[]> {
  const mapa = await lerMapa();
  const lista = mapa[lojaId];
  return Array.isArray(lista) ? lista : [];
}

export async function salvarOuAtualizarAvaliacaoLocal(
  lojaId: string,
  item: AvaliacaoOficina,
  autorChave: string
): Promise<void> {
  const mapa = await lerMapa();
  const atual = Array.isArray(mapa[lojaId]) ? [...mapa[lojaId]] : [];
  const persistido: AvaliacaoPersistida = {
    ...item,
    autorChave,
  };
  const idx = atual.findIndex((x) => x.autorChave === autorChave);
  if (idx >= 0) {
    atual.splice(idx, 1);
  }
  atual.unshift(persistido);
  mapa[lojaId] = atual;
  await AsyncStorage.setItem(CHAVE, JSON.stringify(mapa));
}
