import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CategoriaLoja } from '../tipos/loja';

export type PilhaAutenticacaoParametros = {
  BoasVindas: undefined;
  Login: undefined;
  Cadastro: undefined;
};

export type PilhaInicioParametros = {
  Home: undefined;
  AjudaSos: undefined;
  ListaLojasCategoria: { categoria: CategoriaLoja };
  DetalhesOficina: { lojaId: string };
  SelecionarServicos: { lojaId: string };
  ResumoServico: { lojaId: string; idsServicos: string[]; dataIso: string; horario: string };
};

export type PilhaAgendamentosParametros = {
  ListaAgendamentos: undefined;
  DetalheAgendamento: { id: string };
};

export type RotasAbas = {
  Inicio: NavigatorScreenParams<PilhaInicioParametros> | undefined;
  Buscar: undefined;
  Noticias: undefined;
  Agendamentos: NavigatorScreenParams<PilhaAgendamentosParametros> | undefined;
  Perfil: undefined;
};

export type PilhaNoticiasClienteParametros = {
  Feed: undefined;
  Detalhe: { idNoticia: number };
};

export type PilhaNoticiasAdminParametros = {
  Gerenciar: undefined;
  Nova: undefined;
  Editar: { idNoticia: number };
};

export type PropsTelaDetalhe = NativeStackScreenProps<
  PilhaNoticiasClienteParametros,
  'Detalhe'
>;

export type PropsTelaEditar = NativeStackScreenProps<
  PilhaNoticiasAdminParametros,
  'Editar'
>;
