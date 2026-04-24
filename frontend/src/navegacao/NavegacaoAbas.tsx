import React, { type ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RotaNoticiasPorTipo } from './RotaNoticiasPorTipo';
import { tema } from '../estilos/tema';
import { TelaAgendamentos } from '../telas/TelaAgendamentos';
import { TelaBuscar } from '../telas/TelaBuscar';
import { TelaHome } from '../telas/TelaHome';
import { TelaPerfil } from '../telas/TelaPerfil';

export type RotasAbas = {
  Inicio: undefined;
  Buscar: undefined;
  Noticias: undefined;
  Agendamentos: undefined;
  Perfil: undefined;
};

const corAbaAtivaFigma = '#1E6FD9';
const corAbaInativaFigma = '#A0A0A0';

const Abas = createBottomTabNavigator<RotasAbas>();

type NomeIconeIonicons = NonNullable<ComponentProps<typeof Ionicons>['name']>;

export function NavegacaoAbas() {
  return (
    <Abas.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: corAbaAtivaFigma,
        tabBarInactiveTintColor: corAbaInativaFigma,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: tema.fundoBranco,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: 'rgba(0,0,0,0.06)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 8,
          paddingBottom: 8,
          minHeight: 64,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 6,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 6,
        },
        tabBarIconStyle: { marginTop: 0 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
        tabBarIcon: ({ color, focused }) => {
          const mapa: Record<keyof RotasAbas, NomeIconeIonicons> = {
            Inicio: focused ? 'home' : 'home-outline',
            Buscar: 'search',
            Noticias: focused ? 'newspaper' : 'newspaper-outline',
            Agendamentos: focused ? 'calendar' : 'calendar-outline',
            Perfil: focused ? 'person' : 'person-outline',
          };
          const nome = mapa[route.name as keyof RotasAbas];
          return <Ionicons name={nome} size={22} color={color} />;
        },
      })}
    >
      <Abas.Screen name="Inicio" component={TelaHome} options={{ title: 'Início' }} />
      <Abas.Screen name="Buscar" component={TelaBuscar} options={{ title: 'Busca' }} />
      <Abas.Screen name="Noticias" component={RotaNoticiasPorTipo} options={{ title: 'Notícias' }} />
      <Abas.Screen name="Agendamentos" component={TelaAgendamentos} />
      <Abas.Screen name="Perfil" component={TelaPerfil} />
    </Abas.Navigator>
  );
}
