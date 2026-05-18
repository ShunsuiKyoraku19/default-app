const ROTULOS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'] as const;

export type DiaAgenda = { id: string; rotulo: string; dia: number; mesNumero: number };

export function construirProximosDiasUteis(
  diasSemanaPermitidos: number[],
  quantidade: number
): DiaAgenda[] {
  const permitido = new Set(diasSemanaPermitidos);
  const hoje = new Date();
  hoje.setHours(12, 0, 0, 0);
  const saida: DiaAgenda[] = [];
  for (let i = 0; i < 120 && saida.length < quantidade; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    if (!permitido.has(d.getDay())) continue;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    saida.push({
      id: `${y}-${m}-${day}`,
      rotulo: ROTULOS[d.getDay()] ?? '—',
      dia: d.getDate(),
      mesNumero: d.getMonth(),
    });
  }
  return saida;
}
