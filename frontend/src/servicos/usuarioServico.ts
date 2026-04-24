import { obterBanco } from '../banco/inicializarBanco';
import type { SessaoUsuario, TipoUsuario } from '../tipos/usuario';

export async function cadastrarCliente(
  nome: string,
  email: string,
  senha: string
): Promise<void> {
  const banco = await obterBanco();
  await banco.runAsync(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome.trim(), email.trim().toLowerCase(), senha, 'cliente']
  );
}

export async function emailJaExiste(email: string): Promise<boolean> {
  const banco = await obterBanco();
  const linha = await banco.getFirstAsync<{ total: number | bigint }>(
    'SELECT COUNT(*) as total FROM usuarios WHERE lower(email) = ?',
    [email.trim().toLowerCase()]
  );
  return Number(linha?.total ?? 0) > 0;
}

export async function autenticar(
  email: string,
  senha: string
): Promise<SessaoUsuario | null> {
  const banco = await obterBanco();
  const usuario = await banco.getFirstAsync<{
    id: number;
    nome: string;
    email: string;
    tipo: string;
  }>(
    'SELECT id, nome, email, tipo FROM usuarios WHERE lower(email) = ? AND senha = ?',
    [email.trim().toLowerCase(), senha]
  );
  if (!usuario) return null;
  const tipoNorm = String(usuario.tipo).trim().toLowerCase();
  const tipo: TipoUsuario =
    tipoNorm === 'administrador' ? 'administrador' : 'cliente';
  return {
    id: Number(usuario.id),
    nome: usuario.nome,
    email: usuario.email,
    tipo,
  };
}
