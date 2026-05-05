import type { ImageSourcePropType } from 'react-native';

export type IdOficina = 'mecanica-seu-ze' | 'pecas-premium';

export type ServicoOficina = {
  titulo: string;
  detalhe: string;
  icone: 'oil' | 'clipboard-text-outline' | 'tire' | 'car-info' | 'car-outline' | 'car-brake-alert';
};

export type AvaliacaoOficina = {
  nome: string;
  data: string;
  estrelas: number;
  texto: string;
};

export type DadosOficinaDetalhe = {
  id: IdOficina;
  nome: string;
  nota: string;
  avaliacoes: number;
  endereco: string;
  tags: string[];
  servicos: ServicoOficina[];
  avaliacoesLista: AvaliacaoOficina[];
  galeria: [ImageSourcePropType, ImageSourcePropType, ImageSourcePropType];
};

const imgSeuZe = require('../../assets/images/oficina-seu-ze.jpg');
const imgPecas = require('../../assets/images/oficina-pecas-premium.jpg');
const imgExtraA = require('../../assets/home-troca-oleo.png');
const imgExtraB = require('../../assets/boas-vindas-hero.png');

const DADOS: Record<IdOficina, DadosOficinaDetalhe> = {
  'pecas-premium': {
    id: 'pecas-premium',
    nome: 'Peças Premium',
    nota: '4.9',
    avaliacoes: 128,
    endereco: 'Recanto das Emas Lote 4',
    tags: ['Conserto', 'Manutenção', 'Balanceamento'],
    servicos: [
      { titulo: 'Troca de óleo', detalhe: 'A partir de R$150', icone: 'oil' },
      { titulo: 'Inspeção', detalhe: 'Grátis', icone: 'clipboard-text-outline' },
      { titulo: 'Balanceamento', detalhe: 'A partir de R$45', icone: 'tire' },
      { titulo: 'Inspeção veicular', detalhe: 'A partir de R$60', icone: 'car-info' },
    ],
    avaliacoesLista: [
      {
        nome: 'Messi',
        data: '2 de agosto',
        estrelas: 5,
        texto:
          'Serviço excelente, equipe atenciosa e preço justo. Voltarei com certeza para a próxima revisão.',
      },
      {
        nome: 'Pesadão',
        data: '1 de abril',
        estrelas: 4,
        texto: 'Bom atendimento, só demorou um pouco mais do que o previsto.',
      },
    ],
    galeria: [imgPecas, imgExtraA, imgExtraB],
  },
  'mecanica-seu-ze': {
    id: 'mecanica-seu-ze',
    nome: 'Mecânica Seu Zé',
    nota: '4.8',
    avaliacoes: 95,
    endereco: 'Ceilândia Norte Lote 12',
    tags: ['Mecânica geral', 'Revisão', 'Óleo'],
    servicos: [
      { titulo: 'Revisão completa', detalhe: 'A partir de R$120', icone: 'car-outline' },
      { titulo: 'Troca de óleo', detalhe: 'A partir de R$90', icone: 'oil' },
      { titulo: 'Diagnóstico', detalhe: 'Grátis', icone: 'clipboard-text-outline' },
      { titulo: 'Freios', detalhe: 'A partir de R$80', icone: 'car-brake-alert' },
    ],
    avaliacoesLista: [
      {
        nome: 'Carlos',
        data: '10 de janeiro',
        estrelas: 5,
        texto: 'Mecânico honesto, explicou tudo antes de fazer o serviço.',
      },
      {
        nome: 'Ana',
        data: '3 de março',
        estrelas: 4,
        texto: 'Boa oficina, recomendo para revisão.',
      },
    ],
    galeria: [imgSeuZe, imgExtraA, imgExtraB],
  },
};

export function obterDetalhesOficina(id: IdOficina): DadosOficinaDetalhe {
  return DADOS[id];
}

export function obterDetalhesPorNome(nome: string): DadosOficinaDetalhe {
  if (nome === 'Mecânica Seu Zé') return DADOS['mecanica-seu-ze'];
  if (nome === 'Peças Premium') return DADOS['pecas-premium'];
  return DADOS['pecas-premium'];
}
