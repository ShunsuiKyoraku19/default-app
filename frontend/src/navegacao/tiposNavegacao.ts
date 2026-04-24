import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type PilhaAutenticacaoParametros = {
  BoasVindas: undefined;
  Login: undefined;
  Cadastro: undefined;
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
