import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { CONTA_ADMIN, CONTA_CLIENTE_DEMO } from '../constantes/contasTeste';

let instancia: SQLiteDatabase | null = null;

// total às vezes vem como BigInt do sqlite
function contagem(row: { total: number | bigint } | null): number {
  if (row == null) return 0;
  return Number(row.total);
}

export async function obterBanco(): Promise<SQLiteDatabase> {
  if (!instancia) {
    instancia = await openDatabaseAsync('fluxcarr.db');
  }
  return instancia;
}

// primeira vez: tabelas + usuários demo + notícias de exemplo
export async function inicializarBanco(): Promise<void> {
  const banco = await obterBanco();

  try {
    await banco.execAsync('PRAGMA journal_mode = WAL;');
  } catch {
    // ignora se não der certo
  }

  // um exec por vez (uns aparelhos bugam se junta tudo)
  await banco.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'cliente'
    );
  `);

  await banco.execAsync(`
    CREATE TABLE IF NOT EXISTS noticias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      resumo TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      data TEXT NOT NULL,
      imagem TEXT
    );
  `);

  const admin = await banco.getFirstAsync<{ total: number | bigint }>(
    'SELECT COUNT(*) as total FROM usuarios WHERE email = ?',
    [CONTA_ADMIN.email]
  );

  if (contagem(admin) === 0) {
    await banco.runAsync(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      ['Administrador', CONTA_ADMIN.email, CONTA_ADMIN.senha, CONTA_ADMIN.tipo]
    );
  }

  const clienteDemo = await banco.getFirstAsync<{ total: number | bigint }>(
    'SELECT COUNT(*) as total FROM usuarios WHERE email = ?',
    [CONTA_CLIENTE_DEMO.email]
  );

  if (contagem(clienteDemo) === 0) {
    await banco.runAsync(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      ['Cliente demonstração', CONTA_CLIENTE_DEMO.email, CONTA_CLIENTE_DEMO.senha, CONTA_CLIENTE_DEMO.tipo]
    );
  }

  // atualiza senhas das contas demo
  await banco.runAsync(
    'UPDATE usuarios SET senha = ?, tipo = ? WHERE lower(email) = lower(?)',
    [CONTA_ADMIN.senha, CONTA_ADMIN.tipo, CONTA_ADMIN.email]
  );
  await banco.runAsync(
    'UPDATE usuarios SET senha = ?, tipo = ? WHERE lower(email) = lower(?)',
    [CONTA_CLIENTE_DEMO.senha, CONTA_CLIENTE_DEMO.tipo, CONTA_CLIENTE_DEMO.email]
  );

  const qtdNoticias = await banco.getFirstAsync<{ total: number | bigint }>(
    'SELECT COUNT(*) as total FROM noticias'
  );

  if (contagem(qtdNoticias) === 0) {
    const exemplos: [string, string, string, string, string, string | null][] = [
      [
        'Como trocar o óleo do motor corretamente',
        'Passo a passo para uma troca segura e prolongar a vida do motor.',
        'Escolha do óleo, intervalo e verificação de níveis para manter o motor em dia.',
        'Manutenção',
        '12 Out 2026',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBkmYbZRQaOLlh36Duyt06jASCmVNOadlMAUnlSFiqtAdrZApdCIiJBj34cuWp9MGtEfwxsPyAy4sv0mrobjaIwaQEgnGEenAhgmOkxflnplMVtenwp7zBkxxcG2pIbqewGMte3WvF6QUp5LPzDVkuPkopkgsfFeihFYyaxVaBkP3okC6ChTXHsNb76XZwcsKSqxB5x_Fe10tvz1xyaP5Hie7oot69TeE3i_eZ7TeOeMgsWgg5v2RCx4qb899DdcVdrBF54jA2Eenrd',
      ],
      [
        'Os melhores SUVs de 2026: Guia Completo',
        'Comparativo e destaques dos modelos mais procurados neste ano.',
        'Análise de espaço interno, consumo e tecnologia dos principais SUVs do mercado.',
        'Carros',
        '12 Out 2026',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD-1nUzBondNW_JKxVP1ZGZRDpRI7EebTocLmGH0FU01mbN6WEQI9om5UIm4XAwiC2rbnlRNWHo2O5L7sE3cKG85Izm4vehqmTl13MvpSZ9VkUdgsWw6uZIxMBaxtt03y8DjAJZi7UWjSyiqcgnK1bDl29MI3DMKNn5RcjqDZwGjJXL9Sdl5d8MlxSPUIt4R67eQY_7V9PCileWlH9rdv5V7DMQQLf9ioSWKBLsnZAuLM1Mpfsgsiblxa--5qYmDqMDcLK0kMtdsRQj',
      ],
      [
        'A revolução dos postos de recarga no Brasil',
        'Infraestrutura e tendências para veículos elétricos.',
        'Expansão das redes de recarga e impacto no dia a dia do motorista.',
        'Elétricos',
        '12 Out 2026',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAeFcVA1Aj_03i37S-7pXMaGxedSc94JC-UhKApRW-WO8Op8XfI-f1olwl4sPOgftEzefVaj6BuZVDS1C3Oj42egm85BUp-te2c_BrIgRpjd-3g4v-e2pGf15vcI7aAVtNkaX-dLii73upVORAJ7ARXQruDQgwXZG2S1-srtWRlWK_3JO4KlcUSvtEw-SgtuL2D2t6sPbIJXZbScT0_hE8swhHHxitA-VRXsVIaDiiLlCAVhofd0uOE30eJcQLCq-z240E_UsbB-9Gh',
      ],
      [
        'Quando é a hora certa de trocar os pneus?',
        'Sinais de desgaste e segurança na estrada.',
        'Profundidade do sulco, idade do pneu e alinhamento: o que observar.',
        'Segurança',
        '12 Out 2026',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDDWtJKO_LmRiZuxAc3jl6AQmotJGreBr5XLFmUJyL3HfYITPsVfsihIpqGfyOhOUlLv92jCoOClffHMsGnZoFnVu4rpA-EIzbMPI0ZLFmpsecBCFDf8Upl8rsX2o9Rzf1pP9TrdEyrNxEAG9B5kmN1pzDVJFvW0PgPJFJGynz5tZ5MaJeyphkoMrnPdG8hVZ1Br2CUlGaJbxVnD6uZw3YVwEcr1ob44WScqyQ0QpPTLDIY9YQj5_MAHhcp4vTZpL0eOutdisg5Itdz',
      ],
    ];

    for (const linha of exemplos) {
      await banco.runAsync(
        `INSERT INTO noticias (titulo, resumo, conteudo, categoria, data, imagem) VALUES (?, ?, ?, ?, ?, ?)`,
        linha
      );
    }
  }
}
