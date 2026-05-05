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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BotaoPrimario } from '../componentes/BotaoPrimario';
import { CabecalhoLogo } from '../componentes/CabecalhoFluxo';
import { tema } from '../estilos/tema';
import type { PilhaAutenticacaoParametros } from '../navegacao/tiposNavegacao';

type Props = NativeStackScreenProps<PilhaAutenticacaoParametros, 'BoasVindas'>;

const imagemHero = require('../../assets/boas-vindas-hero.png');
const iconeBadge = require('../../assets/boas-vindas-badge.png');

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
          <CabecalhoLogo varianteEntrada />
        </View>

        <View style={estilos.heroWrap}>
          <View style={estilos.heroCamada}>
            <View style={estilos.heroBlend}>
              <Image source={imagemHero} style={estilos.heroImagem} resizeMode="cover" />
            </View>
          </View>
          <View style={estilos.badge}>
            <View style={estilos.badgeIcone}>
              <Image source={iconeBadge} style={estilos.badgeIconePng} resizeMode="contain" />
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
            estiloExtra={estilos.botaoEntrar}
          />
          <BotaoPrimario
            titulo="Criar conta"
            variante="borda"
            corTextoBorda="#005AB3"
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
    alignItems: 'center',
  },
  heroWrap: {
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E8ECF2',
    aspectRatio: 1,
    width: '100%',
    maxWidth: 400,
  },
  heroCamada: {
    flex: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  /** Equiv. ao <img opacity={0.9} mixBlendMode="multiply" /> sobre o fundo do card. */
  heroBlend: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
    mixBlendMode: 'multiply',
  },
  heroImagem: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  badgeIcone: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#0073E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconePng: {
    width: 22,
    height: 21,
  },
  badgeTextos: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeLinha1: {
    fontSize: 10,
    fontWeight: '700',
    color: '#414754',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badgeLinha2: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#1B1B1D',
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
  botaoEntrar: {
    minHeight: 56,
    borderRadius: 8,
    paddingVertical: 0,
    backgroundColor: '#005AB3',
    shadowColor: '#005AB3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  botaoCriarConta: {
    marginTop: 14,
    minHeight: 56,
    borderRadius: 8,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(192,198,214,0.3)',
  },
});
