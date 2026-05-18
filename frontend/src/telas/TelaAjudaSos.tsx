import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PilhaInicioParametros } from '../navegacao/tiposNavegacao';

type Props = NativeStackScreenProps<PilhaInicioParametros, 'AjudaSos'>;

const VERMELHO_SOS = '#BA1A1A';
const FUNDO_ICONE_GUINCHO = '#FFDAD6';
const guinchoDecorCinza = require('../../assets/guincho-decor-cinza.png');

function alertaEmDesenvolvimento() {
  Alert.alert('Funcionalidade em desenvolvimento');
}

export function TelaAjudaSos({ navigation }: Props) {
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={estilos.btnVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={26} color={tema.azulPrimario} />
        </Pressable>
        <Text style={estilos.tituloHeader} numberOfLines={1}>
          Ajuda SOS
        </Text>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarLetra}>{inicial}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[estilos.scroll, { paddingBottom: alturaBarraAbas + 28 }]}
      >
        <View style={estilos.intro}>
          <Text style={estilos.introTitulo}>Precisa de ajuda agora?</Text>
          <Text style={estilos.introSub}>
            Solicite assistência imediata e segura{'\n'}para seu veículo em poucos toques.
          </Text>
        </View>

        <View style={estilos.cardDestaque}>
          <View style={estilos.guinchoDecorCinza} pointerEvents="none">
            <Image
              source={guinchoDecorCinza}
              style={estilos.guinchoDecorImg}
              resizeMode="contain"
            />
          </View>
          <View style={estilos.iconeGuincho}>
            <MaterialCommunityIcons name="tow-truck" size={28} color={VERMELHO_SOS} />
          </View>
          <Text style={estilos.cardDestaqueTitulo}>Guincho</Text>
          <Text style={estilos.cardDestaqueDesc}>
            Transporte seguro para seu veículo{'\n'}até a oficina mais próxima ou{'\n'}residência.
          </Text>
          <Pressable style={estilos.linkDestaque} onPress={alertaEmDesenvolvimento}>
            <Text style={estilos.linkDestaqueTxt}>Solicitar agora</Text>
            <Ionicons name="chevron-forward" size={16} color={tema.azulPrimario} />
          </Pressable>
        </View>

        <View style={estilos.card}>
          <View style={estilos.iconeCard}>
            <MaterialCommunityIcons name="wrench" size={22} color={tema.texto} />
          </View>
          <Text style={estilos.cardTitulo}>Emergencial</Text>
          <Text style={estilos.cardDesc}>
            Reparos rápidos no local para panes mecânicas leves e reparos.
          </Text>
          <Pressable style={estilos.linkCard} onPress={alertaEmDesenvolvimento}>
            <Text style={estilos.linkCardTxt}>Selecionar</Text>
            <Ionicons name="chevron-forward" size={14} color={tema.azulPrimario} />
          </Pressable>
        </View>

        <View style={estilos.card}>
          <View style={estilos.iconeCard}>
            <MaterialCommunityIcons name="car-battery" size={22} color={tema.texto} />
          </View>
          <Text style={estilos.cardTitulo}>Bateria (Pane Elétrica)</Text>
          <Text style={estilos.cardDesc}>
            Carga auxiliar ou troca de bateria em domicílio.
          </Text>
          <Pressable style={estilos.linkCard} onPress={alertaEmDesenvolvimento}>
            <Text style={estilos.linkCardTxt}>Selecionar</Text>
            <Ionicons name="chevron-forward" size={14} color={tema.azulPrimario} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundoBranco },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: tema.fundoBranco,
  },
  btnVoltar: { width: 40, justifyContent: 'center' },
  tituloHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: VERMELHO_SOS,
    marginHorizontal: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tema.azulClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetra: { fontWeight: '700', color: tema.azulEscuro, fontSize: 14 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  intro: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  introTitulo: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: tema.texto,
    textAlign: 'center',
  },
  introSub: {
    fontSize: 18,
    lineHeight: 29.25,
    fontWeight: '400',
    color: '#414754',
    textAlign: 'center',
  },
  cardDestaque: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  guinchoDecorCinza: {
    position: 'absolute',
    right: 12,
    top: 28,
    width: 124,
    height: 92,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  guinchoDecorImg: {
    width: 118,
    height: 86,
    opacity: 0.1,
    tintColor: tema.texto,
  },
  iconeGuincho: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: FUNDO_ICONE_GUINCHO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDestaqueTitulo: {
    marginTop: 8,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: tema.texto,
  },
  cardDestaqueDesc: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#414754',
  },
  linkDestaque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  linkDestaqueTxt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: tema.azulPrimario,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    gap: 4,
  },
  iconeCard: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EAE7EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitulo: {
    marginTop: 8,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: tema.texto,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#414754',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  linkCardTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: tema.azulPrimario,
  },
});
