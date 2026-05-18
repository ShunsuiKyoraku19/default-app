import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight, type BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { obterLojaPorId } from '../constantes/lojasFicticias';
import { calcularTaxasResumo, formatBRL } from '../constantes/servicosAgendamento';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { salvarAgendamento } from '../servicos/agendamentosArmazenamento';
import { tema } from '../estilos/tema';
import type { PilhaInicioParametros, RotasAbas } from '../navegacao/tiposNavegacao';
import type { AgendamentoSalvo } from '../tipos/agendamento';

type Props = NativeStackScreenProps<PilhaInicioParametros, 'ResumoServico'>;

const CINZA_ETAPA_FUNDO = '#E4E2E4';
const TRILHA_ATIVA_FUNDO = 'rgba(0, 90, 179, 0.20)';

function formatarDataResumo(dataIso: string): string {
  const [y, m, d] = dataIso.split('-').map(Number);
  if (!y || !m || !d) return dataIso;
  const dt = new Date(y, m - 1, d, 12, 0, 0, 0);
  const base = dt.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function TelaResumoServico({ navigation, route }: Props) {
  const { lojaId, idsServicos, dataIso, horario } = route.params;
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [fluxoFinalizado, setFluxoFinalizado] = useState(false);
  const jaSalvou = useRef(false);

  const loja = useMemo(() => obterLojaPorId(lojaId), [lojaId]);
  const nomeFluxo = loja?.nome ?? 'Oficina';

  const servicosSelecionados = useMemo(() => {
    const lista = loja?.servicosAgendamento ?? [];
    return idsServicos
      .map((id) => lista.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s != null);
  }, [loja, idsServicos]);

  const subtotal = useMemo(
    () => servicosSelecionados.reduce((acc, s) => acc + s.precoReais, 0),
    [servicosSelecionados]
  );
  const taxas = useMemo(() => calcularTaxasResumo(subtotal), [subtotal]);
  const dataLinha = formatarDataResumo(dataIso);
  const horarioLinha = horario;

  async function persistirAgendamento() {
    if (jaSalvou.current || loja == null) return;
    jaSalvou.current = true;
    try {
      const agora = new Date().toISOString();
      const registro: AgendamentoSalvo = {
        id: `ag-${Date.now()}`,
        lojaId: loja.id,
        nomeLoja: loja.nome,
        enderecoLoja: loja.endereco,
        servicos: servicosSelecionados.map((s) => ({
          id: s.id,
          titulo: s.titulo,
          preco: s.preco,
          precoReais: s.precoReais,
        })),
        valorServicosReais: subtotal,
        maoObraReais: taxas.maoObra,
        taxaAppReais: taxas.taxaApp,
        valorTotalReais: taxas.total,
        dataIso,
        dataExibicao: dataLinha,
        horario,
        status: 'Agendado',
        criadoEm: agora,
      };
      await salvarAgendamento(registro);
    } catch {
      jaSalvou.current = false;
    }
  }

  function abrirConfirmacao() {
    if (fluxoFinalizado) return;
    void persistirAgendamento();
    setModalVisivel(true);
  }

  const irParaMeusAgendamentos = useCallback(() => {
    const tabNav = navigation.getParent<BottomTabNavigationProp<RotasAbas>>();
    if (tabNav != null) {
      tabNav.navigate('Agendamentos', { screen: 'ListaAgendamentos' });
    }
  }, [navigation]);

  const aoVoltar = useCallback(() => {
    if (fluxoFinalizado) {
      irParaMeusAgendamentos();
      return;
    }
    navigation.goBack();
  }, [fluxoFinalizado, irParaMeusAgendamentos, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (!fluxoFinalizado) return undefined;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        irParaMeusAgendamentos();
        return true;
      });
      return () => sub.remove();
    }, [fluxoFinalizado, irParaMeusAgendamentos])
  );

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.topo}>
        <Pressable
          onPress={aoVoltar}
          hitSlop={12}
          style={estilos.btnVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={26} color={tema.azulPrimario} />
        </Pressable>
        <Text style={estilos.tituloHeader} numberOfLines={1}>
          Resumo
        </Text>
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

          <Text style={estilos.secaoServ}>Serviços selecionados</Text>
          {servicosSelecionados.map((s) => (
            <View key={s.id} style={estilos.linhaServ}>
              <Text style={estilos.nomeServ} numberOfLines={2}>
                {s.titulo}
              </Text>
              <Text style={estilos.precoServ}>{s.preco}</Text>
            </View>
          ))}

          <View style={estilos.linhaValor}>
            <Text style={estilos.labelValor}>Serviço Total</Text>
            <Text style={estilos.valor}>{formatBRL(subtotal)}</Text>
          </View>
          <View style={estilos.linhaValor}>
            <Text style={estilos.labelValor}>Mão de obra</Text>
            <Text style={estilos.valor}>{formatBRL(taxas.maoObra)}</Text>
          </View>
          <View style={estilos.linhaValor}>
            <Text style={estilos.labelValor}>Taxa do App</Text>
            <Text style={estilos.valor}>{formatBRL(taxas.taxaApp)}</Text>
          </View>
          <View style={estilos.divisor} />
          <View style={estilos.linhaValor}>
            <Text style={estilos.totalLabel}>Valor Total</Text>
            <Text style={estilos.totalValor}>{formatBRL(taxas.total)}</Text>
          </View>

          <View style={estilos.infoBloco}>
            <View style={estilos.infoLinha}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={18}
                color={tema.azulPrimario}
              />
              <View style={estilos.infoTextosCol}>
                <Text style={estilos.infoPrincipal}>{dataLinha}</Text>
                <Text style={estilos.infoSec}>{horarioLinha}</Text>
              </View>
            </View>
            <View style={estilos.infoLinha}>
              <Ionicons name="location-outline" size={18} color={tema.azulPrimario} />
              <View style={estilos.infoTextosCol}>
                <Text style={estilos.infoPrincipal} numberOfLines={2}>
                  {nomeFluxo}
                </Text>
                <Text style={estilos.infoSec} numberOfLines={3}>
                  {loja?.endereco ?? '—'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={estilos.botaoAzul}
            activeOpacity={0.85}
            onPress={() => {
              if (fluxoFinalizado) {
                irParaMeusAgendamentos();
                return;
              }
              abrirConfirmacao();
            }}
          >
            <Text style={estilos.botaoTxtBranco}>
              {fluxoFinalizado ? 'Concluído' : 'Confirmar Serviços'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <Pressable style={estilos.modalFundo} onPress={() => setModalVisivel(false)}>
          <Pressable style={estilos.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={estilos.modalIconeWrap}>
              <View style={estilos.modalIconeAzul}>
                <MaterialCommunityIcons name="check" size={28} color="#fff" />
              </View>
            </View>
            <Text style={estilos.modalTitulo}>Solicitação confirmada!</Text>
            <Text style={estilos.modalSub}>Seu serviço foi confirmado com sucesso</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: tema.fundoBranco,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  btnVoltar: { width: 40, justifyContent: 'center' },
  tituloHeader: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: tema.texto,
    marginHorizontal: 4,
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
  secaoServ: {
    fontSize: 14,
    fontWeight: '700',
    color: tema.texto,
    marginBottom: 8,
  },
  linhaServ: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  nomeServ: { flex: 1, flexShrink: 1, minWidth: 0, fontSize: 14, color: '#414754' },
  precoServ: { fontSize: 14, fontWeight: '600', color: tema.texto },
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
    flexShrink: 1,
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
    backgroundColor: '#C62828',
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
    opacity: 0.85,
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
