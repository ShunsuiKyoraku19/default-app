import { db, sqliteRaw } from './client';
import { usuarios } from './schema';

/** Cria tabelas (idempotente) e insere UF/cidades demo se estiver vazio. */
export function initDbAndSeed(): void {
  sqliteRaw.exec(`
    CREATE TABLE IF NOT EXISTS ufs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      sigla TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS cidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      uf_id INTEGER NOT NULL,
      FOREIGN KEY (uf_id) REFERENCES ufs(id)
    );
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      tipo_usuario TEXT NOT NULL,
      cidade_id INTEGER NOT NULL,
      uf_id INTEGER NOT NULL,
      FOREIGN KEY (cidade_id) REFERENCES cidades(id),
      FOREIGN KEY (uf_id) REFERENCES ufs(id)
    );
  `);

  const totalUfs = sqliteRaw.prepare('SELECT COUNT(*) as c FROM ufs').get() as { c: number };
  if (totalUfs.c === 0) {
    sqliteRaw.exec(`
      INSERT INTO ufs (id, nome, sigla) VALUES (1, 'Distrito Federal', 'DF');
      INSERT INTO cidades (id, nome, uf_id) VALUES
        (1, 'Ceilândia', 1),
        (2, 'Brasília', 1),
        (3, 'Taguatinga', 1),
        (4, 'Samambaia', 1);
    `);
  }

  const totalUsers = sqliteRaw.prepare('SELECT COUNT(*) as c FROM usuarios').get() as { c: number };
  if (totalUsers.c === 0) {
    db.insert(usuarios)
      .values({
        nome: 'Administrador API',
        email: 'admin-api@fluxcarr.com',
        senha: '123456',
        tipoUsuario: 'superadmin',
        cidadeId: 1,
        ufId: 1,
      })
      .run();
  }
}

export function normalizarTipoUsuarioApi(raw: string): 'consumidor' | 'prestador' | 'superadmin' {
  const t = raw.trim().toLowerCase();
  if (t === 'superadmin' || t === 'administrador') return 'superadmin';
  if (t === 'prestador') return 'prestador';
  return 'consumidor';
}
