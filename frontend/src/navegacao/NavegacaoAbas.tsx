import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RotaNoticiasPorTipo } from './RotaNoticiasPorTipo';
import type { RotasAbas } from './tiposNavegacao';
import { tema } from '../estilos/tema';
import { PilhaAgendamentos } from './PilhaAgendamentos';
import { TelaBuscar } from '../telas/TelaBuscar';
import { PilhaInicio } from './PilhaInicio';
import { TelaPerfil } from '../telas/TelaPerfil';

export type { RotasAbas } from './tiposNavegacao';

const corAbaAtivaFigma = '#005AB3';
const corAbaInativaFigma = '#94A3B8';

const Abas = createBottomTabNavigator<RotasAbas>();

const iconesAba: Record<keyof RotasAbas, number> = {
  Inicio: require('../../assets/icons/tab-inicio.png'),
  Buscar: require('../../assets/icons/tab-busca.png'),
  Noticias: require('../../assets/icons/tab-noticias.png'),
  Agendamentos: require('../../assets/icons/tab-agendamentos.png'),
  Perfil: require('../../assets/icons/tab-perfil.png'),
};

export function NavegacaoAbas() {
  const insets = useSafeAreaInsets();
  const paddingFundoAba = 20 + insets.bottom;

  return (
    <Abas.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: corAbaAtivaFigma,
        tabBarInactiveTintColor: corAbaInativaFigma,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.92)',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 13,
          paddingBottom: paddingFundoAba,
          minHeight: 56 + paddingFundoAba,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 4,
        },
        tabBarIconStyle: { marginTop: 0 },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 2,
          letterSpacing: 0.28,
        },
        tabBarIcon: ({ focused }) => {
          const nomeRota = route.name as keyof RotasAbas;
          const tint =
            nomeRota === 'Inicio'
              ? focused
                ? undefined
                : corAbaInativaFigma
              : focused
                ? corAbaAtivaFigma
                : corAbaInativaFigma;
          return (
            <Image
              source={iconesAba[nomeRota]}
              style={{ width: 22, height: 22, tintColor: tint }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Abas.Screen name="Inicio" component={PilhaInicio} options={{ title: 'Início' }} />
      <Abas.Screen name="Buscar" component={TelaBuscar} options={{ title: 'Busca' }} />
      <Abas.Screen name="Noticias" component={RotaNoticiasPorTipo} options={{ title: 'Notícias' }} />
      <Abas.Screen name="Agendamentos" component={PilhaAgendamentos} options={{ title: 'Agendamentos' }} />
      <Abas.Screen name="Perfil" component={TelaPerfil} />
    </Abas.Navigator>
  );
}
