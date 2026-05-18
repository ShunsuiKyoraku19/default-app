import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
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
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { formatBRL } from '../constantes/servicosAgendamento';
import { atualizarStatusAgendamento, obterAgendamentoPorId } from '../servicos/agendamentosArmazenamento';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PilhaAgendamentosParametros } from '../navegacao/tiposNavegacao';
import type { AgendamentoSalvo } from '../tipos/agendamento';

type Props = NativeStackScreenProps<PilhaAgendamentosParametros, 'DetalheAgendamento'>;

const VERMELHO = '#C62828';

export function TelaDetalheAgendamento({ navigation, route }: Props) {
  const { id } = route.params;
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();
  const [item, setItem] = useState<AgendamentoSalvo | null>(null);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    const a = await obterAgendamentoPorId(id);
    setItem(a);
    setCarregando(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar])
  );

  async function cancelar() {
    await atualizarStatusAgendamento(id, 'Cancelado');
    await recarregar();
    navigation.goBack();
  }

  const titulosServicos = item?.servicos.map((s) => s.titulo).join(', ') ?? '';

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={estilos.btnVoltar}>
          <Ionicons name="chevron-back" size={26} color={tema.azulPrimario} />
        </Pressable>
        <Text style={estilos.tituloHeader} numberOfLines={1}>
          Detalhe do agendamento
        </Text>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarLetra}>{inicial}</Text>
        </View>
      </View>

      {carregando ? (
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={tema.azulPrimario} />
        </View>
      ) : item == null ? (
        <View style={estilos.centro}>
          <Text style={estilos.erro}>Agendamento não encontrado.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: alturaBarraAbas + 24 }}
        >
          <View style={estilos.card}>
            <Text style={estilos.nomeLoja}>{item.nomeLoja}</Text>
            <Text style={estilos.statusLinha}>
              Status:{' '}
              <Text style={item.status === 'Cancelado' ? estilos.statusCancel : estilos.statusOk}>
                {item.status}
              </Text>
            </Text>
            {item.status === 'Cancelado' ? (
              <Text style={estilos.avisoCancel}>Agendamento cancelado</Text>
            ) : null}

            <View style={estilos.divisor} />

            <Text style={estilos.label}>Serviços</Text>
            <Text style={estilos.valorTexto}>{titulosServicos}</Text>

            <Text style={estilos.label}>Data e horário</Text>
            <Text style={estilos.valorTexto}>
              {item.dataExibicao} às {item.horario}
            </Text>

            <Text style={estilos.label}>Endereço</Text>
            <Text style={estilos.valorTexto}>{item.enderecoLoja}</Text>

            <Text style={estilos.label}>Valores</Text>
            <Text style={estilos.linhaVal}>Serviços: {formatBRL(item.valorServicosReais)}</Text>
            <Text style={estilos.linhaVal}>Mão de obra: {formatBRL(item.maoObraReais)}</Text>
            <Text style={estilos.linhaVal}>Taxa do app: {formatBRL(item.taxaAppReais)}</Text>
            <Text style={estilos.total}>Total: {formatBRL(item.valorTotalReais)}</Text>

            {item.status === 'Agendado' ? (
              <TouchableOpacity style={estilos.btnCancelar} activeOpacity={0.85} onPress={cancelar}>
                <Text style={estilos.btnCancelarTxt}>Cancelar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      )}
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
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  erro: { color: tema.textoSecundario, textAlign: 'center' },
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: tema.fundoBranco,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  nomeLoja: { fontSize: 20, fontWeight: '800', color: tema.texto },
  statusLinha: { marginTop: 8, fontSize: 15, color: tema.texto },
  statusOk: { fontWeight: '700', color: tema.azulPrimario },
  statusCancel: { fontWeight: '700', color: VERMELHO },
  avisoCancel: { marginTop: 8, fontSize: 14, color: VERMELHO, fontWeight: '600' },
  divisor: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginTop: 12, marginBottom: 4 },
  valorTexto: { fontSize: 15, color: tema.texto, lineHeight: 22 },
  linhaVal: { fontSize: 14, color: '#414754', marginTop: 4 },
  total: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    color: tema.azulPrimario,
  },
  btnCancelar: {
    marginTop: 24,
    backgroundColor: VERMELHO,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnCancelarTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
