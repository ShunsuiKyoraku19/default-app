import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BotaoPrimario } from '../componentes/BotaoPrimario';
import { CabecalhoLogo } from '../componentes/CabecalhoFluxo';
import { tema } from '../estilos/tema';
import type { PilhaAutenticacaoParametros } from '../navegacao/tiposNavegacao';

type Props = NativeStackScreenProps<PilhaAutenticacaoParametros, 'BoasVindas'>;

const imagemHero = require('../../assets/boas-vindas-hero.png');

export function TelaBoasVindas({ navigation }: Props) {
  const { height: alturaJanela } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const minAlturaRolagem = Math.max(0, alturaJanela - insets.top - insets.bottom);

  return (
    <SafeAreaView style={estilos.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        style={estilos.rolagem}
        contentContainerStyle={[
          estilos.scroll,
          { minHeight: minAlturaRolagem },
        ]}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.cabecalho}>
          <CabecalhoLogo />
        </View>

        <View style={estilos.heroWrap}>
          <Image source={imagemHero} style={estilos.hero} resizeMode="cover" />
          <View style={estilos.badge}>
            <View style={estilos.badgeIcone}>
              <Ionicons name="shield-checkmark" size={22} color="#fff" />
            </View>
            <View style={estilos.badgeTextos}>
              <Text style={estilos.badgeLinha1}>AQUI SEU CARRO É</Text>
              <Text style={estilos.badgeLinha2}>BEM CUIDADO</Text>
            </View>
          </View>
        </View>

        <View style={estilos.textos}>
          <Text style={estilos.titulo}>Bem-vindo</Text>
          <Text style={estilos.sub}>
            Encontre oficinas próximas, agende serviços e cuide do seu carro com facilidade.
          </Text>
        </View>

        <View style={estilos.areaBotoes}>
          <BotaoPrimario
            titulo="Entrar"
            aoPressionar={() => navigation.navigate('Login')}
            estiloExtra={estilos.sombraBotaoPrincipal}
          />
          <BotaoPrimario
            titulo="Criar conta"
            variante="borda"
            aoPressionar={() => navigation.navigate('Cadastro')}
            estiloExtra={estilos.botaoCriarConta}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  rolagem: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  cabecalho: {
    paddingBottom: 16,
  },
  heroWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: tema.fundoInput,
    aspectRatio: 1,
    width: '100%',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,245,245,0.95)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 14,
  },
  badgeIcone: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: tema.azulPrimario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTextos: {
    flex: 1,
  },
  badgeLinha1: {
    fontSize: 11,
    fontWeight: '600',
    color: tema.textoSecundario,
    letterSpacing: 0.8,
  },
  badgeLinha2: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '800',
    color: tema.texto,
    letterSpacing: 0.5,
  },
  textos: {
    marginTop: 28,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: tema.texto,
    textAlign: 'center',
  },
  sub: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    color: tema.textoSecundario,
    textAlign: 'center',
    maxWidth: 320,
  },
  areaBotoes: {
    marginTop: 28,
    paddingTop: 4,
  },
  sombraBotaoPrincipal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  botaoCriarConta: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
