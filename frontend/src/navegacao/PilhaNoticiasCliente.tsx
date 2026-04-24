import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PilhaNoticiasClienteParametros } from './tiposNavegacao';
import { TelaDetalheNoticia } from '../telas/TelaDetalheNoticia';
import { TelaNoticiasCliente } from '../telas/TelaNoticiasCliente';

const Pilha = createNativeStackNavigator<PilhaNoticiasClienteParametros>();

export function PilhaNoticiasCliente() {
  return (
    <Pilha.Navigator screenOptions={{ headerShown: false }}>
      <Pilha.Screen name="Feed" component={TelaNoticiasCliente} />
      <Pilha.Screen name="Detalhe" component={TelaDetalheNoticia} />
    </Pilha.Navigator>
  );
}
