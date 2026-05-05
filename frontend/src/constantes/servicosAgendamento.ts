export type ServicoAgendamentoItem = {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  preco: string;
  recomendado?: boolean;
};

export type CabecalhoSelecionar = {
  nota: string;
  distancia: string;
  status: string;
};

function ehPremium(nomeOficina: string) {
  return nomeOficina.includes('Premium') || nomeOficina.toLowerCase().includes('peça');
}

export function cabecalhoSelecionarServicos(nomeOficina: string): CabecalhoSelecionar {
  if (ehPremium(nomeOficina)) {
    return { nota: '4.8', distancia: '2.5 km', status: 'Aberto' };
  }
  return { nota: '4.8', distancia: '1.5 km', status: 'Aberto' };
}

export function listaServicosParaAgendar(nomeOficina: string): ServicoAgendamentoItem[] {
  if (ehPremium(nomeOficina)) {
    return [
      {
        id: 'oleo',
        titulo: 'Troca de óleo',
        descricao: 'óleo + filtro incluso',
        duracao: '30 min',
        preco: 'R$ 89,90',
      },
      {
        id: 'alinhamento',
        titulo: 'Alinhamento e balanceamento',
        descricao: 'computadorizado de precisão',
        duracao: '45 min',
        preco: 'R$ 120,00',
      },
      {
        id: 'revisao',
        titulo: 'Revisão completa',
        descricao: '30 itens verificados com laudo',
        duracao: '2h',
        preco: 'R$ 250,00',
        recomendado: true,
      },
      {
        id: 'pastilha',
        titulo: 'Troca de pastilha de freio',
        descricao: 'mão de obra inclusa',
        duracao: '1h',
        preco: 'R$ 150,00',
      },
      {
        id: 'higienizacao',
        titulo: 'Higienização do ar',
        descricao: 'limpeza e sanitização do sistema',
        duracao: '40 min',
        preco: 'R$ 80,00',
      },
    ];
  }
  return [
    {
      id: 'rev-seuze',
      titulo: 'Revisão completa',
      descricao: 'checklist completo do veículo',
      duracao: '1h30',
      preco: 'R$ 120,00',
    },
    {
      id: 'oleo-seuze',
      titulo: 'Troca de óleo',
      descricao: 'óleo e filtro',
      duracao: '40 min',
      preco: 'R$ 90,00',
    },
    {
      id: 'diag-seuze',
      titulo: 'Diagnóstico',
      descricao: 'scanner e laudo simplificado',
      duracao: '30 min',
      preco: 'Grátis',
    },
    {
      id: 'freio-seuze',
      titulo: 'Freios',
      descricao: 'pastilhas e discos',
      duracao: '1h',
      preco: 'R$ 80,00',
    },
  ];
}

export const RESUMO_VALORES_FIXOS = {
  servicoTotal: 'R$120.00',
  maoObra: 'R$12.50',
  taxaApp: 'R$8.12',
  valorTotal: 'R$140.62',
  dataLinha: 'Terça, Abril 13',
  horarioLinha: '09:00 Turno Manhã',
  nomeOficinaResumo: 'Peça Premium',
  enderecoResumo: 'Recanto das Emas Lote 25',
};
