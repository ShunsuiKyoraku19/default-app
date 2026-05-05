import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PilhaInicioParametros } from './tiposNavegacao';
import { TelaDetalhesOficina } from '../telas/TelaDetalhesOficina';
import { TelaHome } from '../telas/TelaHome';
import { TelaResumoServico } from '../telas/TelaResumoServico';
import { TelaSelecionarServicos } from '../telas/TelaSelecionarServicos';

const Pilha = createNativeStackNavigator<PilhaInicioParametros>();

export function PilhaInicio() {
  return (
    <Pilha.Navigator screenOptions={{ headerShown: false }}>
      <Pilha.Screen name="Home" component={TelaHome} />
      <Pilha.Screen name="DetalhesOficina" component={TelaDetalhesOficina} />
      <Pilha.Screen name="SelecionarServicos" component={TelaSelecionarServicos} />
      <Pilha.Screen name="ResumoServico" component={TelaResumoServico} />
    </Pilha.Navigator>
  );
}
