import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import { NavegacaoAbas } from './NavegacaoAbas';
import { PilhaAutenticacao } from './PilhaAutenticacao';

export function NavegacaoRaiz() {
  const { usuario, carregando } = useAutenticacao();

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={tema.azulPrimario} />
      </View>
    );
  }

  if (usuario) {
    return <NavegacaoAbas />;
  }

  return <PilhaAutenticacao />;
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tema.fundo },
});
