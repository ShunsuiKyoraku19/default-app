export type StatusAgendamentoSalvo = 'Agendado' | 'Cancelado';

export type ServicoSalvoNoAgendamento = {
  id: string;
  titulo: string;
  preco: string;
  precoReais: number;
};

export type AgendamentoSalvo = {
  id: string;
  lojaId: string;
  nomeLoja: string;
  enderecoLoja: string;
  servicos: ServicoSalvoNoAgendamento[];
  valorServicosReais: number;
  maoObraReais: number;
  taxaAppReais: number;
  valorTotalReais: number;
  dataIso: string;
  dataExibicao: string;
  horario: string;
  status: StatusAgendamentoSalvo;
  criadoEm: string;
};
