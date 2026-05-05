import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';

type NomeMci = ComponentProps<typeof MaterialCommunityIcons>['name'];

type ModoListaMapa = 'lista' | 'mapa';
type FiltroAgenda = 'todos' | 'agendado' | 'concluido' | 'cancelado';
type StatusCard = 'agendado' | 'concluido' | 'cancelado';

type ItemAgendamento = {
  id: string;
  dataCurta: string;
  hora: string;
  titulo: string;
  oficina: string;
  iconeOficina: NomeMci;
  status: StatusCard;
  destaqueData: boolean;
};

const FILTROS: { id: FiltroAgenda; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'agendado', rotulo: 'Agendado' },
  { id: 'concluido', rotulo: 'Concluído' },
  { id: 'cancelado', rotulo: 'Cancelado' },
];

const ITENS: ItemAgendamento[] = [
  {
    id: '1',
    dataCurta: '15 ABRIL',
    hora: '10:30',
    titulo: 'Troca de óleo',
    oficina: 'Mecânica Seu Zé',
    iconeOficina: 'briefcase-outline',
    status: 'agendado',
    destaqueData: true,
  },
  {
    id: '2',
    dataCurta: '10 JUNHO',
    hora: '14:00',
    titulo: 'Revisão completa',
    oficina: 'Revisa Aqui',
    iconeOficina: 'check-circle-outline',
    status: 'concluido',
    destaqueData: false,
  },
  {
    id: '3',
    dataCurta: '07 DE ABRIL',
    hora: '09:00',
    titulo: 'Alinhamento',
    oficina: 'Oficina Confiança',
    iconeOficina: 'map-marker-outline',
    status: 'cancelado',
    destaqueData: false,
  },
];

export function TelaAgendamentos() {
  const navigation = useNavigation();
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();

  const [modo, setModo] = useState<ModoListaMapa>('lista');
  const [filtro, setFiltro] = useState<FiltroAgenda>('todos');

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: alturaBarraAbas + 28,
          flexGrow: 0,
        }}
      >
        <View style={estilos.toggleWrap}>
          <Pressable
            onPress={() => setModo('lista')}
            style={[estilos.toggleOpcao, modo === 'lista' && estilos.toggleOpcaoAtiva]}
          >
            <Text style={[estilos.toggleTxt, modo === 'lista' && estilos.toggleTxtAtiva]}>
              Lista
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setModo('mapa')}
            style={[estilos.toggleOpcao, modo === 'mapa' && estilos.toggleOpcaoAtiva]}
          >
            <Text style={[estilos.toggleTxt, modo === 'mapa' && estilos.toggleTxtAtiva]}>
              Mapa
            </Text>
          </Pressable>
        </View>

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
          <Pressable hitSlop={10} accessibilityLabel="Mês anterior">
            <Ionicons name="chevron-back" size={18} color="#9CA3AF" />
          </Pressable>
          <Text style={estilos.mesTitulo}>Abril 2026</Text>
          <Pressable hitSlop={10} accessibilityLabel="Próximo mês">
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        <View style={estilos.listaCards}>
          {ITENS.map((item) => (
            <View key={item.id} style={estilos.card}>
              <View
                style={[
                  estilos.dataBox,
                  item.destaqueData ? estilos.dataBoxAtiva : estilos.dataBoxInativa,
                ]}
              >
                <Text
                  style={[
                    estilos.dataBoxMes,
                    item.destaqueData ? estilos.dataBoxMesAtiva : estilos.dataBoxMesInativa,
                  ]}
                >
                  {item.dataCurta}
                </Text>
                <Text
                  style={[
                    estilos.dataBoxHora,
                    item.destaqueData ? estilos.dataBoxHoraAtiva : estilos.dataBoxHoraInativa,
                  ]}
                >
                  {item.hora}
                </Text>
              </View>

              <View style={estilos.cardConteudo}>
                <View style={estilos.cardLinhaTitulo}>
                  <Text style={estilos.cardTituloServico} numberOfLines={2}>
                    {item.titulo}
                  </Text>
                  <Pressable hitSlop={8}>
                    <Text style={estilos.verDetalhes}>Ver detalhes</Text>
                  </Pressable>
                </View>

                <View style={estilos.oficinaRow}>
                  <MaterialCommunityIcons name={item.iconeOficina} size={14} color="#414754" />
                  <Text style={estilos.oficinaNome} numberOfLines={1}>
                    {item.oficina}
                  </Text>
                </View>

                <View style={[estilos.pillStatus, pillPorStatus(item.status)]}>
                  <Text style={[estilos.pillStatusTxt, pillTxtPorStatus(item.status)]}>
                    {rotuloStatus(item.status)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function rotuloStatus(s: StatusCard): string {
  switch (s) {
    case 'agendado':
      return 'AGENDADO';
    case 'concluido':
      return 'CONCLUÍDO';
    case 'cancelado':
      return 'CANCELADO';
    default:
      return '';
  }
}

function pillPorStatus(s: StatusCard) {
  switch (s) {
    case 'agendado':
      return estilos.pillAgendado;
    case 'concluido':
      return estilos.pillConcluido;
    case 'cancelado':
      return estilos.pillCancelado;
    default:
      return {};
  }
}

function pillTxtPorStatus(s: StatusCard) {
  switch (s) {
    case 'agendado':
      return estilos.pillTxtAgendado;
    case 'concluido':
      return estilos.pillTxtConcluido;
    case 'cancelado':
      return estilos.pillTxtCancelado;
    default:
      return {};
  }
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
    backgroundColor: tema.fundoBranco,
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
    gap: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  mesTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: tema.texto,
  },

  listaCards: {
    marginTop: 8,
    gap: 14,
    paddingHorizontal: 20,
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
  pillStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pillAgendado: { backgroundColor: '#DBEAFE' },
  pillConcluido: { backgroundColor: '#DCFCE7' },
  pillCancelado: { backgroundColor: '#FEE2E2' },
  pillStatusTxt: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  pillTxtAgendado: { color: tema.azulPrimario },
  pillTxtConcluido: { color: '#166534' },
  pillTxtCancelado: { color: '#B91C1C' },
});
