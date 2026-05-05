import { obterBanco } from '../banco/inicializarBanco';

export type UfLinha = { id: number; nome: string; sigla: string };
export type CidadeLinha = { id: number; nome: string; uf_id: number };

export async function listarUfs(): Promise<UfLinha[]> {
  const banco = await obterBanco();
  return banco.getAllAsync<UfLinha>('SELECT id, nome, sigla FROM ufs ORDER BY sigla ASC');
}

export async function listarCidadesPorUf(ufId: number): Promise<CidadeLinha[]> {
  const banco = await obterBanco();
  return banco.getAllAsync<CidadeLinha>(
    'SELECT id, nome, uf_id FROM cidades WHERE uf_id = ? ORDER BY nome ASC',
    [ufId]
  );
}
