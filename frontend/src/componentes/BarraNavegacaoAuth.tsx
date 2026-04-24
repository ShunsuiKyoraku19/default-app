import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tema } from '../estilos/tema';
import type { PilhaAutenticacaoParametros } from '../navegacao/tiposNavegacao';

type NavegacaoAuth = NativeStackNavigationProp<PilhaAutenticacaoParametros>;

type Props = {
  rotaAtiva: 'login' | 'cadastro';
  navigation: NavegacaoAuth;
};

const corInativoAba = '#7D8FA3';

const raioTopoBarra = 42;

export function BarraNavegacaoAuth({ rotaAtiva, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const loginAtivo = rotaAtiva === 'login';
  const cadastroAtivo = rotaAtiva === 'cadastro';
  const paddingInferior = Math.max(insets.bottom + 10, 18);

  return (
    <View style={[estilos.barra, { paddingBottom: paddingInferior }]}>
      <TouchableOpacity
        style={estilos.item}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ selected: loginAtivo }}
        accessibilityLabel="Login"
      >
        <Ionicons
          name={loginAtivo ? 'log-in' : 'log-in-outline'}
          size={24}
          color={loginAtivo ? tema.azulPrimario : corInativoAba}
        />
        <Text style={loginAtivo ? estilos.rotuloAtivo : estilos.rotulo}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={estilos.item}
        onPress={() => navigation.navigate('Cadastro')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ selected: cadastroAtivo }}
        accessibilityLabel="Cadastro"
      >
        <Ionicons
          name={cadastroAtivo ? 'person-add' : 'person-add-outline'}
          size={24}
          color={cadastroAtivo ? tema.azulPrimario : corInativoAba}
        />
        <Text style={cadastroAtivo ? estilos.rotuloAtivo : estilos.rotulo}>Cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FCF8FB',
    borderTopLeftRadius: raioTopoBarra,
    borderTopRightRadius: raioTopoBarra,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 5,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  rotulo: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: corInativoAba,
  },
  rotuloAtivo: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: tema.azulPrimario,
  },
});
