import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PilhaAutenticacaoParametros } from './tiposNavegacao';
import { TelaBoasVindas } from '../telas/TelaBoasVindas';
import { TelaCadastro } from '../telas/TelaCadastro';
import { TelaLogin } from '../telas/TelaLogin';

const Pilha = createNativeStackNavigator<PilhaAutenticacaoParametros>();

export function PilhaAutenticacao() {
  return (
    <Pilha.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Pilha.Screen name="BoasVindas" component={TelaBoasVindas} />
      <Pilha.Screen name="Login" component={TelaLogin} />
      <Pilha.Screen name="Cadastro" component={TelaCadastro} />
    </Pilha.Navigator>
  );
}
