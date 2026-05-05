import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const ufs = sqliteTable('ufs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  sigla: text('sigla').notNull().unique(),
});

export const cidades = sqliteTable('cidades', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  ufId: integer('uf_id')
    .notNull()
    .references(() => ufs.id),
});

export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  senha: text('senha').notNull(),
  tipoUsuario: text('tipo_usuario').notNull(),
  cidadeId: integer('cidade_id')
    .notNull()
    .references(() => cidades.id),
  ufId: integer('uf_id')
    .notNull()
    .references(() => ufs.id),
});

export type Uf = typeof ufs.$inferSelect;
export type Cidade = typeof cidades.$inferSelect;
export type Usuario = typeof usuarios.$inferSelect;
