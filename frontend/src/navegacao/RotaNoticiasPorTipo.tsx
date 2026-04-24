import React from 'react';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { PilhaNoticiasAdmin } from './PilhaNoticiasAdmin';
import { PilhaNoticiasCliente } from './PilhaNoticiasCliente';

// mesma aba Notícias, tela diferente por tipo de usuário
export function RotaNoticiasPorTipo() {
  const { usuario } = useAutenticacao();
  const tipo = usuario?.tipo?.toString().trim().toLowerCase();
  if (tipo === 'administrador') {
    return <PilhaNoticiasAdmin />;
  }
  return <PilhaNoticiasCliente />;
}
