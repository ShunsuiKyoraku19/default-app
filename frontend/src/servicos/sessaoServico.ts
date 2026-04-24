import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessaoUsuario } from '../tipos/usuario';

const CHAVE = '@fluxcarr_sessao';

export async function salvarSessao(sessao: SessaoUsuario): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(sessao));
}

export async function carregarSessao(): Promise<SessaoUsuario | null> {
  const texto = await AsyncStorage.getItem(CHAVE);
  if (!texto) return null;
  try {
    return JSON.parse(texto) as SessaoUsuario;
  } catch {
    return null;
  }
}

export async function limparSessao(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE);
}
