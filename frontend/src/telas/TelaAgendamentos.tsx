import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { formatBRL } from '../constantes/servicosAgendamento';
import { carregarAgendamentos } from '../servicos/agendamentosArmazenamento';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import { AbaMapaAgendamentos } from '../componentes/agendamentos/AbaMapaAgendamentos';
import type { PilhaAgendamentosParametros } from '../navegacao/tiposNavegacao';
import type { AgendamentoSalvo } from '../tipos/agendamento';

type NomeMci = ComponentProps<typeof MaterialCommunityIcons>['name'];

type ModoListaMapa = 'lista' | 'mapa';
type FiltroAgenda = 'todos' | 'agendado' | 'cancelado';

const FILTROS: { id: FiltroAgenda; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'agendado', rotulo: 'Agendado' },
  { id: 'cancelado', rotulo: 'Cancelado' },
];

type NavA = NativeStackNavigationProp<PilhaAgendamentosParametros>;

export function TelaAgendamentos() {
  const navigation = useNavigation<NavA>();
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();

  const [modo, setModo] = useState<ModoListaMapa>('lista');
  const [filtro, setFiltro] = useState<FiltroAgenda>('todos');
  const [itens, setItens] = useState<AgendamentoSalvo[]>([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    const lista = await carregarAgendamentos();
    setItens(lista);
    setCarregando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar])
  );

  const itensFiltrados = useMemo(() => {
    if (filtro === 'todos') return itens;
    if (filtro === 'agendado') return itens.filter((i) => i.status === 'Agendado');
    return itens.filter((i) => i.status === 'Cancelado');
  }, [itens, filtro]);

  const mesTitulo = useMemo(() => {
    const agora = new Date();
    const raw = agora.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, []);

  const seletorListaMapa = (
    <View style={estilos.toggleWrap}>
      <Pressable
        onPress={() => setModo('lista')}
        style={[estilos.toggleOpcao, modo === 'lista' && estilos.toggleOpcaoAtiva]}
      >
        <Text style={[estilos.toggleTxt, modo === 'lista' && estilos.toggleTxtAtiva]}>Lista</Text>
      </Pressable>
      <Pressable
        onPress={() => setModo('mapa')}
        style={[estilos.toggleOpcao, modo === 'mapa' && estilos.toggleOpcaoAtiva]}
      >
        <Text style={[estilos.toggleTxt, modo === 'mapa' && estilos.toggleTxtAtiva]}>Mapa</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.header}>
        <Pressable
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
          hitSlop={12}
          style={estilos.btnVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={26} color={tema.azulPrimario} />
        </Pressable>
        <Text style={estilos.tituloHeader} numberOfLines={1}>
          Meus Agendamentos
        </Text>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarLetra}>{inicial}</Text>
        </View>
      </View>

      {modo === 'mapa' ? (
        <>
          {seletorListaMapa}
          <AbaMapaAgendamentos paddingInferior={alturaBarraAbas} />
        </>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: alturaBarraAbas + 28,
            flexGrow: 0,
          }}
        >
          {seletorListaMapa}

          {carregando ? (
            <View style={estilos.centroLista}>
              <ActivityIndicator size="large" color={tema.azulPrimario} />
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                contentContainerStyle={estilos.filtrosContent}
                style={estilos.filtrosScroll}
              >
                {FILTROS.map((f) => {
                  const ativo = filtro === f.id;
                  return (
                    <Pressable
                      key={f.id}
                      onPress={() => setFiltro(f.id)}
                      style={[estilos.filtroChip, ativo ? estilos.filtroChipAtivo : estilos.filtroChipInativo]}
                    >
                      <Text style={[estilos.filtroTxt, ativo ? estilos.filtroTxtAtivo : estilos.filtroTxtInativo]}>
                        {f.rotulo}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={estilos.mesRow}>
                <Pressable hitSlop={10} accessibilityLabel="Mês anterior" style={estilos.mesSeta}>
                  <Ionicons name="chevron-back" size={16} color="#717786" />
                </Pressable>
                <Text style={estilos.mesTitulo}>{mesTitulo}</Text>
                <Pressable hitSlop={10} accessibilityLabel="Próximo mês" style={estilos.mesSeta}>
                  <Ionicons name="chevron-forward" size={16} color="#717786" />
                </Pressable>
              </View>

              <View style={estilos.listaCards}>
                {itensFiltrados.length > 1 ? <View style={estilos.timelineLinha} pointerEvents="none" /> : null}
                {itensFiltrados.length === 0 ? (
                  <Text style={estilos.vazio}>Nenhum agendamento ainda.</Text>
                ) : (
                  itensFiltrados.map((item, index) => (
                    <CardAgendamento
                      key={item.id}
                      item={item}
                      destaqueData={index === 0 && item.status === 'Agendado'}
                      onVerDetalhes={() => navigation.navigate('DetalheAgendamento', { id: item.id })}
                    />
                  ))
                )}
              </View>

              <View style={estilos.cardRevisaoSugerida}>
                <View style={estilos.cardRevisaoIcone}>
                  <MaterialCommunityIcons name="calendar-clock" size={22} color={tema.azulPrimario} />
                </View>
                <View style={estilos.cardRevisaoCorpo}>
                  <Text style={estilos.cardRevisaoTitulo}>Próxima Revisão Sugerida</Text>
                  <Text style={estilos.cardRevisaoSub}>
                    Com base no seu histórico, agende uma revisão preventiva.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#717786" />
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function CardAgendamento({
  item,
  destaqueData,
  onVerDetalhes,
}: {
  item: AgendamentoSalvo;
  destaqueData: boolean;
  onVerDetalhes: () => void;
}) {
  const servicosTxt = item.servicos.map((s) => s.titulo).join(', ');
  const dataCurta = formatarDataCurtaCard(item.dataIso, item.horario);
  const iconeOficina: NomeMci =
    item.status === 'Cancelado' ? 'close-circle-outline' : 'calendar-check-outline';

  return (
    <View style={estilos.card}>
      <View
        style={[estilos.dataBox, destaqueData ? estilos.dataBoxAtiva : estilos.dataBoxInativa]}
      >
        <Text
          style={[
            estilos.dataBoxMes,
            destaqueData ? estilos.dataBoxMesAtiva : estilos.dataBoxMesInativa,
          ]}
        >
          {dataCurta.mes}
        </Text>
        <Text
          style={[
            estilos.dataBoxHora,
            destaqueData ? estilos.dataBoxHoraAtiva : estilos.dataBoxHoraInativa,
          ]}
        >
          {dataCurta.hora}
        </Text>
      </View>

      <View style={estilos.cardConteudo}>
        <View style={estilos.cardLinhaTitulo}>
          <Text style={estilos.cardTituloServico} numberOfLines={2}>
            {servicosTxt}
          </Text>
          <Pressable onPress={onVerDetalhes} hitSlop={8}>
            <Text style={estilos.verDetalhes}>Ver detalhes</Text>
          </Pressable>
        </View>

        <View style={estilos.oficinaRow}>
          <MaterialCommunityIcons name={iconeOficina} size={14} color="#414754" />
          <Text style={estilos.oficinaNome} numberOfLines={1}>
            {item.nomeLoja}
          </Text>
        </View>

        <Text style={estilos.valorLinha}>{formatBRL(item.valorTotalReais)}</Text>

        <View style={[estilos.pillStatus, pillPorStatus(item.status)]}>
          <Text style={[estilos.pillStatusTxt, pillTxtPorStatus(item.status)]}>
            {rotuloStatus(item.status)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function formatarDataCurtaCard(dataIso: string, hora: string): { mes: string; hora: string } {
  const [y, m, d] = dataIso.split('-').map(Number);
  if (!y || !m || !d) return { mes: '—', hora };
  const dt = new Date(y, m - 1, d);
  const mes = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
  return { mes, hora };
}

function rotuloStatus(s: AgendamentoSalvo['status']): string {
  if (s === 'Agendado') return 'AGENDADO';
  return 'CANCELADO';
}

function pillPorStatus(s: AgendamentoSalvo['status']) {
  return s === 'Agendado' ? estilos.pillAgendado : estilos.pillCancelado;
}

function pillTxtPorStatus(s: AgendamentoSalvo['status']) {
  return s === 'Agendado' ? estilos.pillTxtAgendado : estilos.pillTxtCancelado;
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundoBranco },
  centroLista: { paddingTop: 48, paddingBottom: 24, alignItems: 'center' },
  vazio: { textAlign: 'center', color: tema.textoSecundario, marginTop: 24, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  btnVoltar: { width: 40, justifyContent: 'center' },
  tituloHeader: {
    flex: 1,
    textAlign: 'left',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 4,
    marginLeft: 8,
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

  toggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 6,
    backgroundColor: '#EAE7EA',
    borderRadius: 12,
  },
  toggleOpcao: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOpcaoAtiva: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: '#414754',
  },
  toggleTxtAtiva: {
    fontWeight: '600',
    color: tema.azulPrimario,
  },

  filtrosScroll: { marginTop: 16, maxHeight: 48 },
  filtrosContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingRight: 24,
  },
  filtroChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filtroChipAtivo: { backgroundColor: tema.azulPrimario },
  filtroChipInativo: { backgroundColor: '#F6F3F5' },
  filtroTxt: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
  filtroTxtAtivo: { fontWeight: '600', color: '#FFFFFF' },
  filtroTxtInativo: { fontWeight: '500', color: '#414754' },

  mesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 8,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  mesSeta: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mesTitulo: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: '#1B1B1D',
    textAlign: 'center',
  },

  listaCards: {
    position: 'relative',
    marginTop: 8,
    gap: 14,
    paddingHorizontal: 20,
  },
  timelineLinha: {
    position: 'absolute',
    left: 53,
    top: 40,
    bottom: 24,
    width: 2,
    backgroundColor: 'rgba(192, 198, 214, 0.35)',
    borderRadius: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRevisaoSugerida: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(192, 198, 214, 0.20)',
    shadowColor: '#1B1B1D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardRevisaoIcone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(166, 196, 253, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRevisaoCorpo: { flex: 1, minWidth: 0, gap: 4 },
  cardRevisaoTitulo: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: tema.texto,
  },
  cardRevisaoSub: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: '#414754',
  },
  dataBox: {
    width: 68,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  dataBoxAtiva: { backgroundColor: '#DCE8FF' },
  dataBoxInativa: { backgroundColor: '#F0F0F0' },
  dataBoxMes: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  dataBoxMesAtiva: { color: tema.azulPrimario },
  dataBoxMesInativa: { color: '#6B7280' },
  dataBoxHora: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  dataBoxHoraAtiva: { color: tema.azulEscuro },
  dataBoxHoraInativa: { color: '#414754' },

  cardConteudo: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  cardLinhaTitulo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTituloServico: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: tema.texto,
    lineHeight: 22,
  },
  verDetalhes: {
    fontSize: 14,
    fontWeight: '600',
    color: tema.azulPrimario,
    lineHeight: 20,
  },
  oficinaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  oficinaNome: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#414754',
  },
  valorLinha: {
    fontSize: 15,
    fontWeight: '700',
    color: tema.azulPrimario,
  },
  pillStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pillAgendado: { backgroundColor: '#DBEAFE' },
  pillCancelado: { backgroundColor: '#FEE2E2' },
  pillStatusTxt: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  pillTxtAgendado: { color: tema.azulPrimario },
  pillTxtCancelado: { color: '#B91C1C' },
});
