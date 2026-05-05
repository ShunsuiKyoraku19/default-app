import React from 'react';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { ehAdminTipo } from '../tipos/usuario';
import { PilhaNoticiasAdmin } from './PilhaNoticiasAdmin';
import { PilhaNoticiasCliente } from './PilhaNoticiasCliente';

// mesma aba Notícias, tela diferente por tipo de usuário
export function RotaNoticiasPorTipo() {
  const { usuario } = useAutenticacao();
  if (ehAdminTipo(usuario?.tipo)) {
    return <PilhaNoticiasAdmin />;
  }
  return <PilhaNoticiasCliente />;
}
