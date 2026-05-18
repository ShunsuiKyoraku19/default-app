import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PilhaAgendamentosParametros } from './tiposNavegacao';
import { TelaAgendamentos } from '../telas/TelaAgendamentos';
import { TelaDetalheAgendamento } from '../telas/TelaDetalheAgendamento';

const Pilha = createNativeStackNavigator<PilhaAgendamentosParametros>();

export function PilhaAgendamentos() {
  return (
    <Pilha.Navigator screenOptions={{ headerShown: false }}>
      <Pilha.Screen name="ListaAgendamentos" component={TelaAgendamentos} />
      <Pilha.Screen name="DetalheAgendamento" component={TelaDetalheAgendamento} />
    </Pilha.Navigator>
  );
}
