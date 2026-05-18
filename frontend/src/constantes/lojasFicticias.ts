import type { CategoriaLoja, DadosOficinaDetalhe, LojaFicticia } from '../tipos/loja';

const img1 = require('../../assets/lojas/1.jpg');
const img2 = require('../../assets/lojas/2.jpg');
const img3 = require('../../assets/lojas/3.jpg');
const img4 = require('../../assets/lojas/4.jpg');
const img5 = require('../../assets/lojas/5.jpg');
const img6 = require('../../assets/lojas/6.jpg');
const img7 = require('../../assets/lojas/7.jpg');
const img10 = require('../../assets/lojas/10.jpg');
const img11 = require('../../assets/lojas/11.jpg');
const img12 = require('../../assets/lojas/12.jpg');
const img13 = require('../../assets/lojas/13.jpg');

const extras = [img10, img11, img12, img13] as const;

function galeriaDe(card: typeof img1, i: number): LojaFicticia['galeria'] {
  const a = extras[i % extras.length];
  const b = extras[(i + 1) % extras.length];
  return [card, a, b];
}

const LOJAS: LojaFicticia[] = [
  {
    id: 'mec-center-df',
    nome: 'Mecânica Center DF',
    categoriaPrincipal: 'Mecânica',
    apareceEmCategorias: ['Mecânica', 'Óleo', 'Revisão'],
    distanciaKm: 1.2,
    distanciaTexto: '1.2 km',
    tempoEstimado: '25–40 min',
    nota: '4.8',
    avaliacoes: 112,
    endereco: 'QN 14 Conjunto A, Ceilândia Sul',
    imagemCard: img1,
    tags: ['Mecânica geral', 'Motor', 'Suspensão'],
    descricao: 'Oficina mecânica com atendimento por ordem de chegada e orçamento sem compromisso.',
    servicos: [
      { titulo: 'Diagnóstico', detalhe: 'Scanner e avaliação', icone: 'clipboard-text-outline' },
      { titulo: 'Suspensão', detalhe: 'A partir de R$ 180', icone: 'car-outline' },
      { titulo: 'Troca de óleo', detalhe: 'A partir de R$ 95', icone: 'oil' },
      { titulo: 'Freios', detalhe: 'A partir de R$ 140', icone: 'car-brake-alert' },
    ],
    servicosAgendamento: [
      {
        id: 'mc-diag',
        titulo: 'Diagnóstico computadorizado',
        descricao: 'Leitura de falhas e relatório resumido',
        duracao: '40 min',
        preco: 'R$ 70,00',
        precoReais: 70,
      },
      {
        id: 'mc-oleo',
        titulo: 'Troca de óleo',
        descricao: 'Óleo mineral + filtro',
        duracao: '35 min',
        preco: 'R$ 95,00',
        precoReais: 95,
      },
      {
        id: 'mc-rev',
        titulo: 'Revisão básica',
        descricao: 'Fluidos, filtros e checagem de freios',
        duracao: '1h 30',
        preco: 'R$ 189,00',
        precoReais: 189,
        recomendado: true,
      },
      {
        id: 'mc-susp',
        titulo: 'Revisão de suspensão',
        descricao: 'Amortecedores e batentes',
        duracao: '2h',
        preco: 'R$ 220,00',
        precoReais: 220,
      },
    ],
    diasSemanaDisponiveis: [1, 2, 3, 4, 5],
    horariosDisponiveis: ['08:00', '09:30', '11:00', '14:00', '16:00'],
    avaliacoesLista: [
      {
        nome: 'Ricardo',
        data: '2 de maio',
        estrelas: 5,
        texto: 'Atendimento direto e preço coerente com o orçamento.',
      },
      {
        nome: 'Fernanda',
        data: '18 de abril',
        estrelas: 4,
        texto: 'Boa oficina; só houve fila no sábado.',
      },
    ],
    galeria: galeriaDe(img1, 0),
  },
  {
    id: 'express-lub',
    nome: 'Express Lubrificantes',
    categoriaPrincipal: 'Óleo',
    apareceEmCategorias: ['Óleo'],
    distanciaKm: 1.8,
    distanciaTexto: '1.8 km',
    tempoEstimado: '20–35 min',
    nota: '4.7',
    avaliacoes: 203,
    endereco: 'EQNN 22/23, Ceilândia Norte',
    imagemCard: img2,
    tags: ['Óleo', 'Filtros', 'Fluidos'],
    descricao: 'Especializada em troca rápida de óleo e filtros com estoque à pronta entrega.',
    servicos: [
      { titulo: 'Troca de óleo', detalhe: 'Sintético a partir de R$ 120', icone: 'oil' },
      { titulo: 'Filtro de ar', detalhe: 'A partir de R$ 45', icone: 'car-outline' },
      { titulo: 'Fluido de freio', detalhe: 'A partir de R$ 60', icone: 'car-brake-alert' },
      { titulo: 'Check rápido', detalhe: 'Cortesia', icone: 'clipboard-text-outline' },
    ],
    servicosAgendamento: [
      {
        id: 'ex-oleo-sint',
        titulo: 'Troca óleo sintético',
        descricao: '5W30 + filtro original',
        duracao: '30 min',
        preco: 'R$ 149,90',
        precoReais: 149.9,
        recomendado: true,
      },
      {
        id: 'ex-oleo-min',
        titulo: 'Troca óleo mineral',
        descricao: 'Óleo + filtro econômico',
        duracao: '25 min',
        preco: 'R$ 99,00',
        precoReais: 99,
      },
      {
        id: 'ex-filt-ar',
        titulo: 'Troca filtro de ar',
        descricao: 'Mão de obra inclusa',
        duracao: '15 min',
        preco: 'R$ 45,00',
        precoReais: 45,
      },
    ],
    diasSemanaDisponiveis: [1, 2, 3, 4, 5, 6],
    horariosDisponiveis: ['08:30', '10:00', '11:30', '13:00', '15:00', '16:30'],
    avaliacoesLista: [
      {
        nome: 'Paulo',
        data: '5 de maio',
        estrelas: 5,
        texto: 'Rápido e limpo. Voltarei na próxima troca.',
      },
      {
        nome: 'Juliana',
        data: '22 de março',
        estrelas: 4,
        texto: 'Bom custo-benefício no óleo sintético.',
      },
    ],
    galeria: galeriaDe(img2, 1),
  },
  {
    id: 'auto-voltagem',
    nome: 'Auto Elétrica Voltagem',
    categoriaPrincipal: 'Elétrica',
    apareceEmCategorias: ['Elétrica'],
    distanciaKm: 2.4,
    distanciaTexto: '2.4 km',
    tempoEstimado: '40–55 min',
    nota: '4.9',
    avaliacoes: 87,
    endereco: 'Avenida Hélio Prates, Taguatinga',
    imagemCard: img3,
    tags: ['Alternador', 'Bateria', 'Iluminação'],
    descricao: 'Diagnóstico elétrico e reparo de alternadores, motores de partida e chicotes.',
    servicos: [
      { titulo: 'Teste de bateria', detalhe: 'Grátis', icone: 'flash-outline' },
      { titulo: 'Alternador', detalhe: 'Recondicionado a partir de R$ 280', icone: 'car-info' },
      { titulo: 'Chicote', detalhe: 'Orçamento sob consulta', icone: 'clipboard-text-outline' },
      { titulo: 'Faróis', detalhe: 'A partir de R$ 90', icone: 'car-outline' },
    ],
    servicosAgendamento: [
      {
        id: 'av-bat',
        titulo: 'Substituição de bateria',
        descricao: 'Bateria 60Ah + instalação',
        duracao: '30 min',
        preco: 'R$ 420,00',
        precoReais: 420,
      },
      {
        id: 'av-alt',
        titulo: 'Reparo de alternador',
        descricao: 'Retifica e teste de carga',
        duracao: '3h',
        preco: 'R$ 320,00',
        precoReais: 320,
        recomendado: true,
      },
      {
        id: 'av-chic',
        titulo: 'Reparo de chicote',
        descricao: 'Identificação e emenda',
        duracao: '2h',
        preco: 'R$ 180,00',
        precoReais: 180,
      },
    ],
    diasSemanaDisponiveis: [1, 2, 4, 5],
    horariosDisponiveis: ['09:00', '10:30', '13:30', '15:00'],
    avaliacoesLista: [
      {
        nome: 'Marcos',
        data: '1 de maio',
        estrelas: 5,
        texto: 'Resolveram o alternador no mesmo dia.',
      },
      {
        nome: 'Tatiane',
        data: '12 de fevereiro',
        estrelas: 5,
        texto: 'Muito técnica a equipe.',
      },
    ],
    galeria: galeriaDe(img3, 2),
  },
  {
    id: 'pneu-center',
    nome: 'Pneu Center Taguatinga',
    categoriaPrincipal: 'Pneus',
    apareceEmCategorias: ['Pneus'],
    distanciaKm: 3.1,
    distanciaTexto: '3.1 km',
    tempoEstimado: '45–60 min',
    nota: '4.6',
    avaliacoes: 156,
    endereco: 'CSB 03 Lote 05, Taguatinga Sul',
    imagemCard: img4,
    tags: ['Pneus novos', 'Alinhamento', 'Balanceamento'],
    descricao: 'Montagem, alinhamento 3D e balanceamento com equipamentos atualizados.',
    servicos: [
      { titulo: 'Montagem', detalhe: '4 pneus incluso', icone: 'tire' },
      { titulo: 'Alinhamento 3D', detalhe: 'A partir de R$ 90', icone: 'car-info' },
      { titulo: 'Balanceamento', detalhe: 'A partir de R$ 40', icone: 'clipboard-text-outline' },
      { titulo: 'Nitrogênio', detalhe: 'Opcional', icone: 'car-outline' },
    ],
    servicosAgendamento: [
      {
        id: 'pn-mont',
        titulo: 'Montagem 4 pneus',
        descricao: 'Pneus trazidos pelo cliente',
        duracao: '50 min',
        preco: 'R$ 120,00',
        precoReais: 120,
      },
      {
        id: 'pn-ali',
        titulo: 'Alinhamento 3D',
        descricao: 'Regulagem completa',
        duracao: '45 min',
        preco: 'R$ 99,00',
        precoReais: 99,
        recomendado: true,
      },
      {
        id: 'pn-bal',
        titulo: 'Balanceamento',
        descricao: '4 rodas',
        duracao: '40 min',
        preco: 'R$ 80,00',
        precoReais: 80,
      },
    ],
    diasSemanaDisponiveis: [1, 2, 3, 4, 5, 6],
    horariosDisponiveis: ['08:00', '09:00', '10:30', '14:00', '15:30', '17:00'],
    avaliacoesLista: [
      {
        nome: 'André',
        data: '28 de abril',
        estrelas: 4,
        texto: 'Alinhamento ficou redondo.',
      },
      {
        nome: 'Camila',
        data: '3 de janeiro',
        estrelas: 5,
        texto: 'Equipe explicou o desgaste dos pneus.',
      },
    ],
    galeria: galeriaDe(img4, 3),
  },
  {
    id: 'revisao-facil',
    nome: 'Revisão Fácil',
    categoriaPrincipal: 'Revisão',
    apareceEmCategorias: ['Revisão'],
    distanciaKm: 2.0,
    distanciaTexto: '2.0 km',
    tempoEstimado: '1h–1h30',
    nota: '4.8',
    avaliacoes: 94,
    endereco: 'QR 506 Samambaia Sul',
    imagemCard: img5,
    tags: ['Check-list', 'Garantia', 'Revisão programada'],
    descricao: 'Pacotes de revisão por quilometragem com checklist impresso.',
    servicos: [
      { titulo: 'Revisão 10 mil', detalhe: 'A partir de R$ 199', icone: 'car-info' },
      { titulo: 'Revisão 20 mil', detalhe: 'A partir de R$ 349', icone: 'car-outline' },
      { titulo: 'Troca de óleo', detalhe: 'A partir de R$ 110', icone: 'oil' },
      { titulo: 'Inspeção', detalhe: 'Grátis na revisão', icone: 'clipboard-text-outline' },
    ],
    servicosAgendamento: [
      {
        id: 'rf-10',
        titulo: 'Revisão 10.000 km',
        descricao: 'Fluidos e inspeção de 24 itens',
        duracao: '1h 15',
        preco: 'R$ 199,00',
        precoReais: 199,
        recomendado: true,
      },
      {
        id: 'rf-20',
        titulo: 'Revisão 20.000 km',
        descricao: 'Itens estendidos + filtros',
        duracao: '2h',
        preco: 'R$ 349,00',
        precoReais: 349,
      },
      {
        id: 'rf-oleo',
        titulo: 'Troca de óleo programada',
        descricao: 'Sintético conforme manual',
        duracao: '40 min',
        preco: 'R$ 129,00',
        precoReais: 129,
      },
    ],
    diasSemanaDisponiveis: [1, 3, 4, 5, 6],
    horariosDisponiveis: ['08:30', '10:00', '13:00', '15:30'],
    avaliacoesLista: [
      {
        nome: 'Lucas',
        data: '10 de abril',
        estrelas: 5,
        texto: 'Checklist entregue no final. Recomendo.',
      },
      {
        nome: 'Sandra',
        data: '8 de março',
        estrelas: 4,
        texto: 'Um pouco de espera, mas valeu a pena.',
      },
    ],
    galeria: galeriaDe(img5, 4),
  },
  {
    id: 'lava-brilho',
    nome: 'Lava-Jato Brilho',
    categoriaPrincipal: 'Lava-jato',
    apareceEmCategorias: ['Lava-jato'],
    distanciaKm: 0.9,
    distanciaTexto: '0.9 km',
    tempoEstimado: '30–50 min',
    nota: '4.5',
    avaliacoes: 310,
    endereco: 'EQNP 28/30, Ceilândia Norte',
    imagemCard: img6,
    tags: ['Lavagem', 'Enceramento', 'Aspiração'],
    descricao: 'Lavagem completa, cera líquida e aspiração interna com agendamento.',
    servicos: [
      { titulo: 'Lavagem simples', detalhe: 'A partir de R$ 35', icone: 'spray' },
      { titulo: 'Lavagem completa', detalhe: 'A partir de R$ 70', icone: 'car-outline' },
      { titulo: 'Enceramento', detalhe: 'A partir de R$ 90', icone: 'clipboard-text-outline' },
      { titulo: 'Higienização', detalhe: 'A partir de R$ 120', icone: 'car-info' },
    ],
    servicosAgendamento: [
      {
        id: 'lb-simp',
        titulo: 'Lavagem simples',
        descricao: 'Carro até médio porte',
        duracao: '35 min',
        preco: 'R$ 40,00',
        precoReais: 40,
      },
      {
        id: 'lb-comp',
        titulo: 'Lavagem completa',
        descricao: 'Externa + aspiração',
        duracao: '50 min',
        preco: 'R$ 75,00',
        precoReais: 75,
        recomendado: true,
      },
      {
        id: 'lb-enc',
        titulo: 'Enceramento',
        descricao: 'Cera premium',
        duracao: '40 min',
        preco: 'R$ 95,00',
        precoReais: 95,
      },
    ],
    diasSemanaDisponiveis: [0, 1, 2, 3, 4, 5, 6],
    horariosDisponiveis: ['08:00', '09:00', '10:00', '11:00', '14:00', '16:00', '17:30'],
    avaliacoesLista: [
      {
        nome: 'Bruno',
        data: '4 de maio',
        estrelas: 5,
        texto: 'Carro saiu brilhando.',
      },
      {
        nome: 'Elaine',
        data: '20 de fevereiro',
        estrelas: 4,
        texto: 'Fila no domingo, mas o serviço é caprichado.',
      },
    ],
    galeria: galeriaDe(img6, 5),
  },
  {
    id: 'guincho-rapido',
    nome: 'Guincho Rápido DF',
    categoriaPrincipal: 'Guincho',
    apareceEmCategorias: ['Guincho'],
    distanciaKm: 4.2,
    distanciaTexto: '4.2 km',
    tempoEstimado: '45–90 min',
    nota: '4.7',
    avaliacoes: 64,
    endereco: 'Via de acesso Samambaia, próximo ao viaduto',
    imagemCard: img7,
    tags: ['24h', 'Leve', 'Médio porte'],
    descricao: 'Atendimento de guincho para pane mecânica e colisão leve na região metropolitana.',
    servicos: [
      { titulo: 'Guincho urbano', detalhe: 'Até 15 km', icone: 'truck-fast-outline' },
      { titulo: 'Carga leve', detalhe: 'Hatch e sedan', icone: 'car-outline' },
      { titulo: 'SUV', detalhe: 'Sob consulta', icone: 'car-info' },
      { titulo: 'Bateria', detalhe: 'Chupeta inclusa', icone: 'flash-outline' },
    ],
    servicosAgendamento: [
      {
        id: 'gr-urb',
        titulo: 'Guincho urbano',
        descricao: 'Até 15 km rodados',
        duracao: '1h',
        preco: 'R$ 180,00',
        precoReais: 180,
        recomendado: true,
      },
      {
        id: 'gr-suv',
        titulo: 'Guincho SUV',
        descricao: 'Veículo médio porte',
        duracao: '1h 15',
        preco: 'R$ 240,00',
        precoReais: 240,
      },
      {
        id: 'gr-chup',
        titulo: 'Chupeta / partida',
        descricao: 'Atendimento no local',
        duracao: '30 min',
        preco: 'R$ 90,00',
        precoReais: 90,
      },
    ],
    diasSemanaDisponiveis: [0, 1, 2, 3, 4, 5, 6],
    horariosDisponiveis: ['06:00', '08:00', '10:00', '12:00', '14:00', '18:00', '22:00'],
    avaliacoesLista: [
      {
        nome: 'Igor',
        data: '30 de abril',
        estrelas: 5,
        texto: 'Chegaram em 35 minutos após o chamado.',
      },
      {
        nome: 'Renata',
        data: '15 de março',
        estrelas: 4,
        texto: 'Motorista educado e cuidadoso com o carro.',
      },
    ],
    galeria: galeriaDe(img7, 6),
  },
];

const POR_ID: Record<string, LojaFicticia> = Object.fromEntries(LOJAS.map((l) => [l.id, l]));

export function listarLojasOrdenadasPorDistancia(): LojaFicticia[] {
  return [...LOJAS].sort((a, b) => a.distanciaKm - b.distanciaKm);
}

export function lojasPorCategoria(categoria: CategoriaLoja): LojaFicticia[] {
  return LOJAS.filter((l) => l.apareceEmCategorias.includes(categoria)).sort(
    (a, b) => a.distanciaKm - b.distanciaKm
  );
}

export function obterLojaPorId(id: string): LojaFicticia | undefined {
  return POR_ID[id];
}

export function obterDetalhesPorLojaId(id: string): DadosOficinaDetalhe {
  const loja = POR_ID[id] ?? LOJAS[0];
  const {
    servicosAgendamento: _s,
    apareceEmCategorias: _a,
    diasSemanaDisponiveis: _d,
    horariosDisponiveis: _h,
    imagemCard: _i,
    distanciaKm: _k,
    distanciaTexto: _dt,
    tempoEstimado: _te,
    descricao: _de,
    categoriaPrincipal: _c,
    ...rest
  } = loja;
  void _s;
  void _a;
  void _d;
  void _h;
  void _i;
  void _k;
  void _dt;
  void _te;
  void _de;
  void _c;
  return rest;
}

export function rotuloCategoriaParaChave(rotuloGrid: string): CategoriaLoja | null {
  const mapa: Record<string, CategoriaLoja> = {
    MECÂNICA: 'Mecânica',
    ÓLEO: 'Óleo',
    ELÉTRICA: 'Elétrica',
    PNEUS: 'Pneus',
    REVISÃO: 'Revisão',
    'LAVA-JATO': 'Lava-jato',
    'LAVA\u2011JATO': 'Lava-jato',
    GUINCHO: 'Guincho',
  };
  return mapa[rotuloGrid] ?? null;
}
