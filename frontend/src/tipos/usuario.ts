export type TipoUsuario = 'cliente' | 'administrador';

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
};
