/** Perfis exigidos na Entrega 1 (valores persistidos no SQLite). */
export const PERFIS_USUARIO = ['consumidor', 'prestador', 'superadmin'] as const;
export type TipoUsuario = (typeof PERFIS_USUARIO)[number];

/** Perfis permitidos no cadastro público (sem administrador). */
export type TipoUsuarioCadastro = Extract<TipoUsuario, 'consumidor' | 'prestador'>;

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  tipo: TipoUsuario;
};

export type SessaoUsuario = {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  /** Nome da cidade para exibir na Home, ex.: Ceilândia */
  cidadeNome?: string | null;
  /** Sigla da UF, ex.: DF */
  ufSigla?: string | null;
};

export function normalizarTipoUsuario(raw: string): TipoUsuario {
  const t = String(raw).trim().toLowerCase();
  if (t === 'superadmin' || t === 'administrador') return 'superadmin';
  if (t === 'prestador') return 'prestador';
  return 'consumidor';
}

/** Acesso à área admin de notícias (superadmin ou legado já migrado). */
export function ehAdminTipo(tipo: string | undefined): boolean {
  return normalizarTipoUsuario(tipo ?? '') === 'superadmin';
}

export function perfilLegivel(tipo: TipoUsuario | undefined): string {
  switch (tipo) {
    case 'superadmin':
      return 'Superadmin';
    case 'prestador':
      return 'Prestador de serviço';
    default:
      return 'Cliente';
  }
}
