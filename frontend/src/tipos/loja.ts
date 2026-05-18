import type { ImageSourcePropType } from 'react-native';

export type CategoriaLoja =
  | 'Mecânica'
  | 'Óleo'
  | 'Elétrica'
  | 'Pneus'
  | 'Revisão'
  | 'Lava-jato'
  | 'Guincho';

export type ServicoOficina = {
  titulo: string;
  detalhe: string;
  icone:
    | 'oil'
    | 'clipboard-text-outline'
    | 'tire'
    | 'car-info'
    | 'car-outline'
    | 'car-brake-alert'
    | 'flash-outline'
    | 'spray'
    | 'truck-fast-outline';
};

export type AvaliacaoOficina = {
  nome: string;
  data: string;
  estrelas: number;
  texto: string;
};

export type AvaliacaoPersistida = AvaliacaoOficina & {
  autorChave: string;
};

export type ServicoAgendamentoItem = {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  preco: string;
  precoReais: number;
  recomendado?: boolean;
};

export type DadosOficinaDetalhe = {
  id: string;
  nome: string;
  nota: string;
  avaliacoes: number;
  endereco: string;
  tags: string[];
  servicos: ServicoOficina[];
  avaliacoesLista: AvaliacaoOficina[];
  galeria: [ImageSourcePropType, ImageSourcePropType, ImageSourcePropType];
};

export type LojaFicticia = DadosOficinaDetalhe & {
  categoriaPrincipal: CategoriaLoja;
  apareceEmCategorias: CategoriaLoja[];
  distanciaTexto: string;
  tempoEstimado: string;
  descricao: string;
  servicosAgendamento: ServicoAgendamentoItem[];
  diasSemanaDisponiveis: number[];
  horariosDisponiveis: string[];
  imagemCard: ImageSourcePropType;
  distanciaKm: number;
};
