import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RESUMO_VALORES_FIXOS } from '../constantes/servicosAgendamento';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PilhaInicioParametros } from '../navegacao/tiposNavegacao';

type Props = NativeStackScreenProps<PilhaInicioParametros, 'ResumoServico'>;

const CINZA_ETAPA_FUNDO = '#E4E2E4';
const TRILHA_ATIVA_FUNDO = 'rgba(0, 90, 179, 0.20)';
const VERMELHO = '#C62828';

export function TelaResumoServico({ route }: Props) {
  const { nome: nomeFluxo } = route.params;
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [fluxoFinalizado, setFluxoFinalizado] = useState(false);

  const v = RESUMO_VALORES_FIXOS;

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.topo}>
        <View style={estilos.local}>
          <Ionicons name="location-sharp" size={18} color={tema.azulPrimario} />
          <Text style={estilos.localTexto}>Ceilândia, Brasília</Text>
          <Ionicons name="chevron-down" size={14} color={tema.azulPrimario} />
        </View>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarLetra}>{inicial}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: alturaBarraAbas + 24, flexGrow: 0 }}
      >
        <View style={estilos.stepper}>
          <View style={estilos.stepperRow}>
            <View style={estilos.stepCol}>
              <View style={[estilos.circulo, estilos.circuloAtivo]}>
                <Text style={estilos.circuloTxtAtivo}>1</Text>
              </View>
              <Text style={estilos.stepRotuloAtivo}>Loja</Text>
            </View>
            <View style={estilos.connector}>
              <View style={estilos.trackAtivo}>
                <View style={estilos.trackPreenchido} />
              </View>
            </View>
            <View style={estilos.stepCol}>
              <View style={[estilos.circulo, estilos.circuloAtivo]}>
                <Text style={estilos.circuloTxtAtivo}>2</Text>
              </View>
              <Text style={estilos.stepRotuloAtivo}>Serviços</Text>
            </View>
            <View style={estilos.connector}>
              {fluxoFinalizado ? (
                <View style={estilos.trackAtivo}>
                  <View style={estilos.trackPreenchido} />
                </View>
              ) : (
                <View style={estilos.trackInativa} />
              )}
            </View>
            <View style={estilos.stepCol}>
              <View style={[estilos.circulo, fluxoFinalizado ? estilos.circuloAtivo : estilos.circuloOff]}>
                <Text style={fluxoFinalizado ? estilos.circuloTxtAtivo : estilos.circuloTxtOff}>
                  3
                </Text>
              </View>
              <Text style={fluxoFinalizado ? estilos.stepRotuloAtivo : estilos.stepRotuloOff}>
                Confirmado
              </Text>
            </View>
          </View>
        </View>

        <View style={estilos.card}>
          <Text style={estilos.cardTitulo}>Valor Total do Serviço</Text>
          <Text style={estilos.cardSubFluxo}>{nomeFluxo}</Text>
          <View style={estilos.linhaValor}>
            <Text style={estilos.labelValor}>Serviço Total</Text>
            <Text style={estilos.valor}>{v.servicoTotal}</Text>
          </View>
          <View style={estilos.linhaValor}>
            <Text style={estilos.labelValor}>Mão de obra</Text>
            <Text style={estilos.valor}>{v.maoObra}</Text>
          </View>
          <View style={estilos.linhaValor}>
            <Text style={estilos.labelValor}>Taxa do App</Text>
            <Text style={estilos.valor}>{v.taxaApp}</Text>
          </View>
          <View style={estilos.divisor} />
          <View style={estilos.linhaValor}>
            <Text style={estilos.totalLabel}>Valor Total</Text>
            <Text style={estilos.totalValor}>{v.valorTotal}</Text>
          </View>

          <View style={estilos.infoBloco}>
            <View style={estilos.infoLinha}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={18}
                color={tema.azulPrimario}
              />
              <View style={estilos.infoTextosCol}>
                <Text style={estilos.infoPrincipal}>{v.dataLinha}</Text>
                <Text style={estilos.infoSec}>{v.horarioLinha}</Text>
              </View>
            </View>
            <View style={estilos.infoLinha}>
              <Ionicons name="location-outline" size={18} color={tema.azulPrimario} />
              <View style={estilos.infoTextosCol}>
                <Text style={estilos.infoPrincipal}>{v.nomeOficinaResumo}</Text>
                <Text style={estilos.infoSec}>{v.enderecoResumo}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={fluxoFinalizado ? estilos.botaoVermelho : estilos.botaoAzul}
            activeOpacity={0.85}
            onPress={() => {
              if (!fluxoFinalizado) setModalVisivel(true);
            }}
          >
            <Text style={estilos.botaoTxtBranco}>
              {fluxoFinalizado ? 'Cancelar' : 'Confirma Serviços'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisivel} transparent animationType="fade">
        <Pressable style={estilos.modalFundo} onPress={() => setModalVisivel(false)}>
          <Pressable style={estilos.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={estilos.modalIconeWrap}>
              <View style={estilos.modalIconeAzul}>
                <MaterialCommunityIcons name="check" size={28} color="#fff" />
              </View>
            </View>
            <Text style={estilos.modalTitulo}>Solicitação confirmada!</Text>
            <Text style={estilos.modalSub}>Seu Serviço foi confirmado com sucesso</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisivel(false);
                setFluxoFinalizado(true);
              }}
              style={estilos.modalVoltar}
            >
              <Text style={estilos.modalVoltarTxt}>Voltar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: tema.fundoBranco,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  local: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, marginRight: 8 },
  localTexto: { fontWeight: '600', color: tema.texto, fontSize: 16 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tema.azulClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetra: { fontWeight: '700', color: tema.azulEscuro, fontSize: 14 },
  stepper: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepCol: { alignItems: 'center', gap: 8 },
  connector: {
    flex: 1,
    minWidth: 28,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 22,
  },
  trackAtivo: {
    height: 2,
    borderRadius: 1,
    backgroundColor: TRILHA_ATIVA_FUNDO,
    overflow: 'hidden',
  },
  trackPreenchido: {
    height: 2,
    width: '100%',
    backgroundColor: tema.azulPrimario,
    borderRadius: 1,
  },
  trackInativa: {
    height: 2,
    width: '100%',
    backgroundColor: CINZA_ETAPA_FUNDO,
    borderRadius: 1,
  },
  circulo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloAtivo: { backgroundColor: tema.azulPrimario },
  circuloOff: { backgroundColor: CINZA_ETAPA_FUNDO },
  circuloTxtAtivo: { fontSize: 16, fontWeight: '700', color: '#fff', lineHeight: 24 },
  circuloTxtOff: { fontSize: 16, fontWeight: '700', color: '#414754', lineHeight: 24 },
  stepRotuloAtivo: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: tema.azulPrimario,
    lineHeight: 15,
  },
  stepRotuloOff: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#414754',
    lineHeight: 15,
  },
  card: {
    marginHorizontal: 24,
    marginTop: 28,
    backgroundColor: tema.fundoBranco,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#1B1B1D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 22,
    elevation: 6,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: tema.texto,
    marginBottom: 6,
    alignSelf: 'stretch',
  },
  cardSubFluxo: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  linhaValor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: 12,
    marginBottom: 12,
  },
  labelValor: {
    flex: 1,
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#1B1B1D',
    paddingRight: 8,
  },
  valor: {
    flexShrink: 0,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: tema.texto,
    textAlign: 'right',
  },
  divisor: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
    alignSelf: 'stretch',
  },
  totalLabel: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    color: tema.texto,
    paddingRight: 8,
  },
  totalValor: {
    flexShrink: 0,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    color: tema.azulPrimario,
    textAlign: 'right',
  },
  infoBloco: {
    marginTop: 20,
    marginBottom: 8,
    paddingVertical: 17,
    gap: 16,
  },
  infoLinha: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoTextosCol: { flex: 1, minWidth: 0, gap: 2 },
  infoPrincipal: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: tema.texto,
  },
  infoSec: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#414754',
    marginTop: 0,
  },
  botaoAzul: {
    marginTop: 18,
    backgroundColor: tema.azulPrimario,
    borderRadius: 8,
    paddingVertical: 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tema.azulPrimario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoVermelho: {
    marginTop: 18,
    backgroundColor: VERMELHO,
    borderRadius: 8,
    paddingVertical: 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  botaoTxtBranco: { color: '#fff', fontSize: 17, fontWeight: '700' },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: tema.fundoBranco,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalIconeWrap: { marginBottom: 16 },
  modalIconeAzul: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tema.azulPrimario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: tema.texto,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  modalVoltar: { marginTop: 20, paddingVertical: 8 },
  modalVoltarTxt: { fontSize: 16, fontWeight: '700', color: tema.azulPrimario },
});
