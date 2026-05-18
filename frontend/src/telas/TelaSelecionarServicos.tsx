import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { obterLojaPorId } from '../constantes/lojasFicticias';
import {
  cabecalhoSelecionarPorLojaId,
  formatBRL,
  listaServicosParaAgendarPorLojaId,
} from '../constantes/servicosAgendamento';
import { obterResumoAvaliacaoLoja } from '../servicos/avaliacoesResumoLoja';
import { construirProximosDiasUteis } from '../util/agendaDias';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PilhaInicioParametros } from '../navegacao/tiposNavegacao';

type Props = NativeStackScreenProps<PilhaInicioParametros, 'SelecionarServicos'>;

const AZUL = '#2563EB';

export function TelaSelecionarServicos({ navigation, route }: Props) {
  const { lojaId } = route.params;
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();

  const loja = useMemo(() => obterLojaPorId(lojaId), [lojaId]);
  const nome = loja?.nome ?? 'Oficina';

  const servicos = useMemo(() => listaServicosParaAgendarPorLojaId(lojaId), [lojaId]);
  const info = useMemo(() => cabecalhoSelecionarPorLojaId(lojaId), [lojaId]);
  const [notaResumo, setNotaResumo] = useState(info.nota);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      void obterResumoAvaliacaoLoja(lojaId).then((r) => {
        if (ativo) setNotaResumo(r.mediaTexto);
      });
      return () => {
        ativo = false;
      };
    }, [lojaId])
  );

  useEffect(() => {
    setNotaResumo(info.nota);
  }, [lojaId, info.nota]);
  const diasAgenda = useMemo(
    () => construirProximosDiasUteis(loja?.diasSemanaDisponiveis ?? [1, 2, 3, 4, 5], 6),
    [loja?.diasSemanaDisponiveis]
  );
  const horariosLoja = loja?.horariosDisponiveis ?? ['09:00', '14:00'];
  const [indiceDiaAgenda, setIndiceDiaAgenda] = useState(0);
  const [horarioAgenda, setHorarioAgenda] = useState<string>(horariosLoja[0] ?? '09:00');

  const [selecionados, setSelecionados] = useState<Set<string>>(() => new Set());
  const temSelecao = selecionados.size > 0;
  const [barraMontada, setBarraMontada] = useState(false);
  const progressoBarra = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const h0 = loja?.horariosDisponiveis?.[0] ?? '09:00';
    setHorarioAgenda(h0);
    setIndiceDiaAgenda(0);
  }, [lojaId, loja?.horariosDisponiveis]);

  useEffect(() => {
    if (temSelecao) setBarraMontada(true);
  }, [temSelecao]);

  useEffect(() => {
    if (!barraMontada) return;
    if (temSelecao) {
      progressoBarra.setValue(0);
      Animated.spring(progressoBarra, {
        toValue: 1,
        useNativeDriver: true,
        tension: 72,
        friction: 10,
      }).start();
    } else {
      Animated.timing(progressoBarra, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setBarraMontada(false);
      });
    }
  }, [barraMontada, temSelecao]);

  function alternar(id: string) {
    setSelecionados((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function confirmar() {
    if (selecionados.size === 0) return;
    const dia = diasAgenda[indiceDiaAgenda];
    if (dia == null) return;
    navigation.navigate('ResumoServico', {
      lojaId,
      idsServicos: Array.from(selecionados),
      dataIso: dia.id,
      horario: horarioAgenda,
    });
  }

  const resumoBarra = useMemo(() => {
    const escolhidos = servicos.filter((s) => selecionados.has(s.id));
    if (escolhidos.length === 0) return null;
    const total = escolhidos.reduce((acc, s) => acc + s.precoReais, 0);
    const titulo =
      escolhidos.length === 1 ? escolhidos[0]!.titulo : `${escolhidos.length} serviços`;
    return { titulo, preco: formatBRL(total) };
  }, [servicos, selecionados]);

  const margemInferiorBarra = Math.max(0, alturaBarraAbas - 22);

  const translateBarra = progressoBarra.interpolate({
    inputRange: [0, 1],
    outputRange: [88, 0],
  });
  const opacityBarra = progressoBarra;
  const scaleBarra = progressoBarra.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });

  /**
   * Padding inferior do ScrollView: só o necessário para o último conteúdo não ficar atrás
   * da aba ou do card fixo (preço + Confirmar), com folga pequena para tocar nos horários.
   * - Sem card fixo: altura real da aba + poucos px (não usa margemInferiorBarra reduzida).
   * - Com card fixo: mesma base do posicionamento do card + altura estimada do card + gap.
   */
  const alturaEstimadaCardConfirmar = 100;
  const gapAposUltimoConteudo = 10;
  const paddingFundoLista = temSelecao
    ? margemInferiorBarra + alturaEstimadaCardConfirmar + gapAposUltimoConteudo
    : alturaBarraAbas + 16;

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
          <Ionicons name="chevron-back" size={26} color={AZUL} />
        </Pressable>
        <Text style={estilos.tituloHeader} numberOfLines={1}>
          {nome}
        </Text>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarLetra}>{inicial}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        contentContainerStyle={{
          paddingBottom: paddingFundoLista,
          flexGrow: 0,
        }}
      >
        <View style={estilos.corpo}>
          <Text style={estilos.nomeGrande}>{nome}</Text>
          <View style={estilos.linhaInfo}>
            <MaterialCommunityIcons name="star" size={16} color={AZUL} />
            <Text style={estilos.infoTexto}>{notaResumo}</Text>
            <Text style={estilos.sep}>·</Text>
            <Ionicons name="location-outline" size={15} color={AZUL} />
            <Text style={estilos.infoTexto}>{info.distancia}</Text>
            <Text style={estilos.sep}>·</Text>
            <View style={estilos.pillAberto}>
              <Text style={estilos.pillAbertoTexto}>{info.status}</Text>
            </View>
          </View>

          <View style={estilos.secaoTitulo}>
            <Text style={estilos.tituloSecao}>Serviços Disponíveis</Text>
            <Text style={estilos.disponiveis}>{servicos.length} disponíveis</Text>
          </View>

          {servicos.map((s) => {
            const ativo = selecionados.has(s.id);
            return (
              <View key={s.id} style={estilos.card}>
                <View style={estilos.cardLinha}>
                  <View style={estilos.cardColuna}>
                    <View style={estilos.cardBlocoTitulo}>
                      <Text style={estilos.cardTitulo}>{s.titulo}</Text>
                      {s.recomendado ? (
                        <View style={estilos.badgeRec}>
                          <Text style={estilos.badgeRecTxt}>RECOMENDADO</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={estilos.cardDesc}>{s.descricao}</Text>
                    <View style={estilos.cardRodape}>
                      <View style={estilos.cardDuracao}>
                        <MaterialCommunityIcons name="clock-outline" size={15} color="#414754" />
                        <Text style={estilos.cardDuracaoTxt}>{s.duracao}</Text>
                      </View>
                      <Text style={estilos.cardPreco}>{s.preco}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[estilos.btnAdd, ativo && estilos.btnAddAtivo]}
                    onPress={() => alternar(s.id)}
                    activeOpacity={0.8}
                    accessibilityLabel={ativo ? 'Remover serviço' : 'Adicionar serviço'}
                  >
                    <MaterialCommunityIcons
                      name={ativo ? 'check' : 'plus'}
                      size={20}
                      color="#FEFCFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <View style={estilos.agendamento}>
            <Text style={estilos.agendamentoTitulo}>Agendamento</Text>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              style={estilos.agendaDatasScroll}
              contentContainerStyle={estilos.agendaDatasContent}
            >
              {diasAgenda.map((dia, index) => {
                const sel = index === indiceDiaAgenda;
                return (
                  <Pressable
                    key={dia.id}
                    onPress={() => setIndiceDiaAgenda(index)}
                    style={[estilos.diaCard, sel && estilos.diaCardSel]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: sel }}
                    accessibilityLabel={`${dia.rotulo} dia ${dia.dia}`}
                  >
                    <Text
                      style={[estilos.diaSemana, !sel && estilos.diaSemanaOff, sel && estilos.diaSemanaSel]}
                    >
                      {dia.rotulo}
                    </Text>
                    <Text style={[estilos.diaNumero, sel && estilos.diaNumeroSel]}>{dia.dia}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={estilos.horasGrid}>
              {horariosLoja.map((h) => {
                const sel = h === horarioAgenda;
                return (
                  <Pressable
                    key={h}
                    onPress={() => setHorarioAgenda(h)}
                    style={[estilos.horaChip, sel && estilos.horaChipSel]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: sel }}
                  >
                    <Text style={[estilos.horaChipTxt, sel && estilos.horaChipTxtSel]}>{h}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {barraMontada ? (
        <Animated.View
          pointerEvents={temSelecao ? 'auto' : 'none'}
          style={[
            estilos.barraFlutuanteWrap,
            {
              bottom: margemInferiorBarra,
              opacity: opacityBarra,
              transform: [{ translateY: translateBarra }, { scale: scaleBarra }],
            },
          ]}
        >
          <View style={estilos.barraFlutuante}>
            <View style={estilos.barraEsquerda}>
              <View style={estilos.linhaPontoNome}>
                <View style={estilos.pontoAzul} />
                <Text style={estilos.nomeResumoBarra} numberOfLines={1}>
                  {resumoBarra ? resumoBarra.titulo : 'Selecione um serviço'}
                </Text>
              </View>
              <Text style={[estilos.precoResumoBarra, !resumoBarra && estilos.precoResumoBarraOff]}>
                {resumoBarra ? resumoBarra.preco : '—'}
              </Text>
            </View>
            <TouchableOpacity
              style={estilos.botaoConfirmar}
              onPress={confirmar}
              activeOpacity={0.85}
              disabled={!temSelecao}
            >
              <Text style={estilos.botaoConfirmarTxt}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundoBranco },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  btnVoltar: { width: 40, justifyContent: 'center' },
  tituloHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: tema.texto,
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
  corpo: { paddingHorizontal: 20, paddingTop: 16 },
  nomeGrande: { fontSize: 24, fontWeight: '800', color: tema.texto },
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  infoTexto: { fontSize: 14, fontWeight: '600', color: tema.texto },
  sep: { color: '#D1D5DB', fontSize: 14 },
  pillAberto: {
    backgroundColor: AZUL + '22',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillAbertoTexto: { fontSize: 12, fontWeight: '700', color: AZUL },
  secaoTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  tituloSecao: { fontSize: 17, fontWeight: '800', color: tema.texto },
  disponiveis: { fontSize: 14, fontWeight: '600', color: tema.azulPrimario },
  card: {
    backgroundColor: tema.fundoBranco,
    borderRadius: 32,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  cardColuna: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  cardBlocoTitulo: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    gap: 6,
  },
  cardTitulo: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: tema.texto,
  },
  badgeRec: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRecTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: tema.azulPrimario,
    letterSpacing: 0.3,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#414754',
  },
  cardRodape: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  cardDuracao: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDuracaoTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#414754',
  },
  cardPreco: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: tema.azulPrimario,
  },
  btnAdd: {
    padding: 12,
    borderRadius: 22,
    backgroundColor: tema.azulContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAddAtivo: { backgroundColor: tema.azulPrimario },
  agendamento: {
    alignSelf: 'stretch',
    paddingTop: 16,
    gap: 24,
    marginTop: 8,
  },
  agendamentoTitulo: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: tema.texto,
  },
  agendaDatasScroll: {
    alignSelf: 'stretch',
    maxHeight: 104,
  },
  agendaDatasContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingRight: 4,
  },
  diaCard: {
    minWidth: 70,
    minHeight: 88,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: tema.fundoBuscaDestaque,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaCardSel: {
    backgroundColor: tema.azulPrimario,
    shadowColor: tema.azulPrimario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  diaSemana: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#414754',
    textTransform: 'uppercase',
  },
  diaSemanaOff: { opacity: 0.7 },
  diaSemanaSel: { color: '#fff', opacity: 1 },
  diaNumero: {
    marginTop: 2,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '800',
    color: '#414754',
  },
  diaNumeroSel: { color: '#fff' },
  horasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignSelf: 'stretch',
  },
  horaChip: {
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: 8,
    backgroundColor: tema.fundoBuscaDestaque,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horaChipSel: {
    backgroundColor: tema.azulPrimario,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horaChipTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#414754',
    textAlign: 'center',
  },
  horaChipTxtSel: { color: '#fff' },
  barraFlutuanteWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    paddingBottom: 0,
  },
  barraFlutuante: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 40,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 90, 179, 0.05)',
    shadowColor: '#1B1B1D',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 14,
  },
  barraEsquerda: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },
  linhaPontoNome: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch' },
  pontoAzul: {
    width: 8,
    height: 8,
    borderRadius: 12,
    backgroundColor: tema.azulPrimario,
  },
  nomeResumoBarra: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: tema.texto,
  },
  precoResumoBarra: {
    marginTop: 0,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
    color: tema.azulPrimario,
  },
  precoResumoBarraOff: { fontSize: 18, lineHeight: 26, color: '#9CA3AF', fontWeight: '700' },
  botaoConfirmar: {
    backgroundColor: tema.azulPrimario,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tema.azulPrimario,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 8,
  },
  botaoConfirmarTxt: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
});
