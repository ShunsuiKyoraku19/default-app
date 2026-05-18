import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { lojasPorCategoria } from '../constantes/lojasFicticias';
import { obterResumoAvaliacaoLoja } from '../servicos/avaliacoesResumoLoja';
import type { LojaFicticia } from '../tipos/loja';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PilhaInicioParametros } from '../navegacao/tiposNavegacao';

type CacheAvaliacaoCard = { mediaTexto: string; mediaNumero: number };

function parseNotaLocal(nota: string): number {
  const n = parseFloat(String(nota).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

const AZUL_FIGMA = '#1E6FD9';

type Props = NativeStackScreenProps<PilhaInicioParametros, 'ListaLojasCategoria'>;
type FiltroChip = 'todos' | 'proximas' | 'top';

export function TelaListaLojasCategoria({ navigation, route }: Props) {
  const { categoria } = route.params;
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<FiltroChip>('todos');

  const base = useMemo(() => lojasPorCategoria(categoria), [categoria]);
  const idsChave = useMemo(() => base.map((l) => l.id).join(','), [base]);
  const [avaliacaoPorLoja, setAvaliacaoPorLoja] = useState<Record<string, CacheAvaliacaoCard>>({});

  useFocusEffect(
    useCallback(() => {
      let vivo = true;
      const ids = base.map((l) => l.id);
      if (ids.length === 0) {
        setAvaliacaoPorLoja({});
      } else {
        void Promise.all(
          ids.map(async (id) => {
            const r = await obterResumoAvaliacaoLoja(id);
            return [id, { mediaTexto: r.mediaTexto, mediaNumero: r.mediaNumero }] as const;
          })
        ).then((pares) => {
          if (!vivo) return;
          const next: Record<string, CacheAvaliacaoCard> = {};
          for (const [id, v] of pares) next[id] = v;
          setAvaliacaoPorLoja(next);
        });
      }
      return () => {
        vivo = false;
      };
    }, [idsChave])
  );

  const lista = useMemo(() => {
    let itens = [...base];
    const q = busca.trim().toLowerCase();
    if (q.length > 0) {
      itens = itens.filter(
        (l) =>
          l.nome.toLowerCase().includes(q) ||
          l.endereco.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filtro === 'proximas') {
      itens.sort((a, b) => a.distanciaKm - b.distanciaKm);
    } else if (filtro === 'top') {
      itens.sort((a, b) => {
        const na = avaliacaoPorLoja[a.id]?.mediaNumero ?? parseNotaLocal(a.nota);
        const nb = avaliacaoPorLoja[b.id]?.mediaNumero ?? parseNotaLocal(b.nota);
        return nb - na;
      });
    } else {
      itens.sort((a, b) => a.distanciaKm - b.distanciaKm);
    }
    return itens;
  }, [base, busca, filtro, avaliacaoPorLoja]);

  function irDetalhes(lojaId: string) {
    navigation.navigate('DetalhesOficina', { lojaId });
  }

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={estilos.btnVoltar}>
          <Ionicons name="chevron-back" size={26} color={AZUL_FIGMA} />
        </Pressable>
        <Text style={estilos.tituloHeader} numberOfLines={1}>
          {categoria}
        </Text>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarLetra}>{inicial}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: alturaBarraAbas + 20 }}
      >
        <View style={estilos.buscaWrap}>
          <Ionicons name="search" size={18} color="#9E9E9E" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar oficinas..."
            placeholderTextColor="#9E9E9E"
            style={estilos.buscaInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.chipsContent}
          style={estilos.chipsScroll}
        >
          {(
            [
              { id: 'todos' as const, rotulo: 'Todos' },
              { id: 'proximas' as const, rotulo: 'Mais próximas' },
              { id: 'top' as const, rotulo: 'Melhor avaliação' },
            ] as const
          ).map((c) => {
            const ativo = filtro === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setFiltro(c.id)}
                style={[estilos.chip, ativo ? estilos.chipAtivo : estilos.chipInativo]}
              >
                <Text style={[estilos.chipTxt, ativo ? estilos.chipTxtAtivo : estilos.chipTxtInativo]}>
                  {c.rotulo}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={estilos.lista}>
          {lista.map((o) => (
            <CardLoja
              key={o.id}
              loja={o}
              notaExibida={avaliacaoPorLoja[o.id]?.mediaTexto ?? o.nota}
              onPress={() => irDetalhes(o.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CardLoja({
  loja,
  notaExibida,
  onPress,
}: {
  loja: LojaFicticia;
  notaExibida: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={estilos.cardOficina} activeOpacity={0.75} onPress={onPress}>
      <Image source={loja.imagemCard} style={estilos.cardImg} resizeMode="cover" />
      <View style={estilos.cardCorpo}>
        <Text style={estilos.cardNome} numberOfLines={1}>
          {loja.nome}
        </Text>
        <View style={estilos.linhaNota}>
          <MaterialCommunityIcons name="star" size={14} color={AZUL_FIGMA} />
          <Text style={estilos.nota}>{notaExibida}</Text>
          <Text style={estilos.servico} numberOfLines={1}>
            {loja.categoriaPrincipal}
          </Text>
        </View>
        <View style={estilos.linhaInfo}>
          <MaterialCommunityIcons name="clock-outline" size={13} color="#757575" />
          <Text style={estilos.info}>{loja.tempoEstimado}</Text>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={13}
            color="#757575"
            style={estilos.infoIconeDist}
          />
          <Text style={estilos.info}>{loja.distanciaTexto}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  buscaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#F1F1F1',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 14,
    borderRadius: 25,
    paddingHorizontal: 15,
    gap: 8,
  },
  buscaInput: { flex: 1, fontSize: 13, fontWeight: '500', color: tema.texto, paddingVertical: 0 },
  chipsScroll: { maxHeight: 44, marginBottom: 8 },
  chipsContent: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingRight: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chipAtivo: { backgroundColor: AZUL_FIGMA },
  chipInativo: { backgroundColor: '#F1F1F1' },
  chipTxt: { fontSize: 13, fontWeight: '600' },
  chipTxtAtivo: { color: '#fff' },
  chipTxtInativo: { color: tema.texto },
  lista: { paddingHorizontal: 20, gap: 12 },
  cardOficina: {
    marginBottom: 0,
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tema.fundoBranco,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImg: {
    width: 100,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ECECEC',
  },
  cardCorpo: { flex: 1, marginLeft: 10, justifyContent: 'space-between', minHeight: 76 },
  cardNome: { fontWeight: '700', fontSize: 16, color: tema.texto },
  linhaNota: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  nota: { fontWeight: '700', fontSize: 13, color: tema.texto },
  servico: { fontSize: 12, color: '#757575', marginLeft: 4, flexShrink: 1 },
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
    flexWrap: 'wrap',
  },
  infoIconeDist: { marginLeft: 8 },
  info: { fontSize: 11, color: '#757575', fontWeight: '500' },
});
