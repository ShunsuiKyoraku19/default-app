import { obterBanco } from '../banco/inicializarBanco';
import {
  normalizarTipoUsuario,
  type SessaoUsuario,
  type TipoUsuarioCadastro,
} from '../tipos/usuario';

export async function cadastrarCliente(
  nome: string,
  email: string,
  senha: string,
  opcoes: { ufId: number; cidadeId: number; tipoUsuario: TipoUsuarioCadastro }
): Promise<void> {
  const banco = await obterBanco();
  await banco.runAsync(
    'INSERT INTO usuarios (nome, email, senha, tipo, uf_id, cidade_id) VALUES (?, ?, ?, ?, ?, ?)',
    [
      nome.trim(),
      email.trim().toLowerCase(),
      senha,
      opcoes.tipoUsuario,
      opcoes.ufId,
      opcoes.cidadeId,
    ]
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
    cidade_nome: string | null;
    uf_sigla: string | null;
  }>(
    `SELECT u.id, u.nome, u.email, u.tipo,
            c.nome AS cidade_nome,
            f.sigla AS uf_sigla
     FROM usuarios u
     LEFT JOIN cidades c ON c.id = u.cidade_id
     LEFT JOIN ufs f ON f.id = u.uf_id
     WHERE lower(u.email) = ? AND u.senha = ?`,
    [email.trim().toLowerCase(), senha]
  );
  if (!usuario) return null;
  const tipo = normalizarTipoUsuario(usuario.tipo);
  return {
    id: Number(usuario.id),
    nome: usuario.nome,
    email: usuario.email,
    tipo,
    cidadeNome: usuario.cidade_nome,
    ufSigla: usuario.uf_sigla,
  };
}

