import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PilhaNoticiasAdminParametros } from './tiposNavegacao';
import { TelaEditarNoticia } from '../telas/TelaEditarNoticia';
import { TelaGerenciarNoticias } from '../telas/TelaGerenciarNoticias';
import { TelaNovaNoticia } from '../telas/TelaNovaNoticia';

const Pilha = createNativeStackNavigator<PilhaNoticiasAdminParametros>();

export function PilhaNoticiasAdmin() {
  return (
    <Pilha.Navigator screenOptions={{ headerShown: false }}>
      <Pilha.Screen name="Gerenciar" component={TelaGerenciarNoticias} />
      <Pilha.Screen name="Nova" component={TelaNovaNoticia} />
      <Pilha.Screen name="Editar" component={TelaEditarNoticia} />
    </Pilha.Navigator>
  );
}
