import React, { useMemo, useState } from 'react';
import {
  Image,
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
import type { ComponentProps } from 'react';
import { obterDetalhesPorNome } from '../constantes/detalhesOficinas';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PilhaInicioParametros } from '../navegacao/tiposNavegacao';

type Props = NativeStackScreenProps<PilhaInicioParametros, 'DetalhesOficina'>;

const AZUL_FUNDO = '#EFF6FF';
const TAG_ATIVA_FUNDO = 'rgba(166, 196, 253, 0.30)';
const TAG_ATIVA_TEXTO = '#315182';

type NomeMci = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function TelaDetalhesOficina({ navigation, route }: Props) {
  const { nome } = route.params;
  const dados = useMemo(() => obterDetalhesPorNome(nome), [nome]);
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();
  const [indiceTag, setIndiceTag] = useState(0);

  const [imgPrincipal, imgSecA, imgSecB] = dados.galeria;

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
          {dados.nome}
        </Text>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarLetra}>{inicial}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: alturaBarraAbas + 24, flexGrow: 0 }}
      >
        <View style={estilos.galeriaWrap}>
          <View style={estilos.galeriaCelulaPrincipal}>
            <Image source={imgPrincipal} style={estilos.galeriaPrincipalImg} resizeMode="cover" />
          </View>
          <View style={estilos.galeriaCol}>
            <View style={estilos.galeriaCelulaMini}>
              <Image source={imgSecA} style={estilos.galeriaMiniImg} resizeMode="cover" />
            </View>
            <View style={estilos.galeriaCelulaMini}>
              <Image
                source={imgSecB}
                style={[estilos.galeriaMiniImg, estilos.galeriaMiniImgSombreada]}
                resizeMode="cover"
              />
              <View style={estilos.maisFotosCentro} pointerEvents="none">
                <Text style={estilos.maisFotosNumero}>+12</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={estilos.corpo}>
          <View style={estilos.blocoTopo}>
            <View style={estilos.topoEsquerda}>
              <Text style={estilos.nomeOficina}>{dados.nome}</Text>
              <View style={estilos.enderecoLinha}>
                <Ionicons name="location-outline" size={14} color="#414754" />
                <Text style={estilos.endereco}>{dados.endereco}</Text>
              </View>
            </View>
            <View style={estilos.cardNota}>
              <View style={estilos.linhaEstrelaNota}>
                <MaterialCommunityIcons name="star" size={15} color={tema.azulPrimario} />
                <Text style={estilos.notaGrande}>{dados.nota}</Text>
              </View>
              <Text style={estilos.subNotaContagem}>
                {dados.avaliacoes}
                {'\n'}
                <Text style={estilos.subNotaLabel}>AVALIAÇÕES</Text>
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.tagsContent}
            style={estilos.tagsScroll}
          >
            {dados.tags.map((t, i) => {
              const ativo = i === indiceTag;
              return (
                <Pressable
                  key={t}
                  onPress={() => setIndiceTag(i)}
                  style={[estilos.tag, ativo ? estilos.tagAtiva : estilos.tagInativa]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: ativo }}
                >
                  <Text style={[estilos.tagTexto, ativo ? estilos.tagTextoAtivo : estilos.tagTextoInativo]}>
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={estilos.gridServicos}>
            {dados.servicos.map((s) => (
              <View key={s.titulo} style={estilos.cardServico}>
                <View style={estilos.servicoIconeWrap}>
                  <MaterialCommunityIcons
                    name={s.icone as NomeMci}
                    size={18}
                    color={tema.azulPrimario}
                  />
                </View>
                <Text style={estilos.servicoTitulo}>{s.titulo}</Text>
                <Text style={estilos.servicoDetalhe}>{s.detalhe}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={estilos.botaoPrincipal}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SelecionarServicos', { nome: dados.nome })}
          >
            <Text style={estilos.botaoPrincipalTexto}>Ver Serviços</Text>
          </TouchableOpacity>

          <View style={estilos.secaoAval}>
            <Text style={estilos.secaoAvalTitulo}>Avaliações</Text>
            <Pressable hitSlop={8}>
              <Text style={estilos.linkTodas}>Todas</Text>
            </Pressable>
          </View>

          {dados.avaliacoesLista.map((a, idx) => (
            <View
              key={a.nome + a.data}
              style={[estilos.cardAval, idx === dados.avaliacoesLista.length - 1 && estilos.cardAvalUltimo]}
            >
              <View style={estilos.avalTopo}>
                <View style={estilos.avalAvatar}>
                  <Text style={estilos.avalAvatarLetra}>{a.nome.charAt(0)}</Text>
                </View>
                <View style={estilos.avalMeio}>
                  <Text style={estilos.avalNome}>{a.nome}</Text>
                  <View style={estilos.avalEstrelas}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <MaterialCommunityIcons
                        key={i}
                        name="star"
                        size={11}
                        color={i < a.estrelas ? tema.azulPrimario : '#D1D5DB'}
                      />
                    ))}
                  </View>
                </View>
                <View style={estilos.avalDataCol}>
                  <Text style={estilos.avalData}>{a.data}</Text>
                </View>
              </View>
              <Text style={estilos.avalTexto}>{a.texto}</Text>
            </View>
          ))}
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
  galeriaWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 300,
    marginHorizontal: 24,
    marginTop: 12,
    gap: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  galeriaCelulaPrincipal: {
    flex: 1,
    minWidth: 0,
    height: 300,
    borderRadius: 16,
    backgroundColor: tema.fundoBuscaDestaque,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  galeriaPrincipalImg: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: tema.fundoBuscaDestaque,
  },
  galeriaCol: {
    width: '24%',
    maxWidth: 92,
    minWidth: 72,
    height: 300,
    gap: 11,
  },
  galeriaCelulaMini: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: tema.fundoBuscaDestaque,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  galeriaMiniImg: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: tema.fundoBuscaDestaque,
  },
  galeriaMiniImgSombreada: { opacity: 0.6 },
  maisFotosCentro: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maisFotosNumero: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: tema.texto,
  },
  corpo: { paddingHorizontal: 24, paddingTop: 16, gap: 16 },
  blocoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  topoEsquerda: { flex: 1, minWidth: 0, gap: 4 },
  nomeOficina: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    color: tema.texto,
  },
  cardNota: {
    backgroundColor: AZUL_FUNDO,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 88,
  },
  linhaEstrelaNota: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  notaGrande: { fontSize: 18, lineHeight: 28, fontWeight: '700', color: tema.azulPrimario },
  subNotaContagem: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '500',
    color: tema.azulPrimario,
    textAlign: 'center',
  },
  subNotaLabel: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '500',
    color: tema.azulPrimario,
    textTransform: 'uppercase',
  },
  enderecoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 0,
  },
  endereco: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#414754',
  },
  tagsScroll: { marginTop: 0, maxHeight: 40 },
  tagsContent: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minHeight: 28,
    justifyContent: 'center',
  },
  tagAtiva: { backgroundColor: TAG_ATIVA_FUNDO },
  tagInativa: { backgroundColor: tema.fundoBuscaDestaque },
  tagTexto: { fontSize: 12, lineHeight: 16 },
  tagTextoAtivo: { fontWeight: '600', color: TAG_ATIVA_TEXTO },
  tagTextoInativo: { fontWeight: '500', color: '#414754' },
  gridServicos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 0,
    rowGap: 12,
    columnGap: 12,
  },
  cardServico: {
    width: '48%',
    backgroundColor: tema.fundoBranco,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(192, 198, 214, 0.10)',
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  servicoIconeWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: AZUL_FUNDO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servicoTitulo: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: tema.texto,
  },
  servicoDetalhe: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: '#414754',
  },
  botaoPrincipal: {
    marginTop: 0,
    backgroundColor: tema.azulPrimario,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  botaoPrincipalTexto: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
  },
  secaoAval: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 0,
    marginBottom: 0,
  },
  secaoAvalTitulo: { fontSize: 18, lineHeight: 28, fontWeight: '700', color: tema.texto },
  linkTodas: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: tema.azulPrimario },
  cardAval: {
    marginTop: 24,
    paddingLeft: 22,
    borderLeftWidth: 2,
    borderLeftColor: '#E4E2E4',
    backgroundColor: 'transparent',
  },
  cardAvalUltimo: { marginBottom: 8 },
  avalTopo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: tema.azulClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avalAvatarLetra: { fontWeight: '700', color: tema.azulEscuro, fontSize: 16 },
  avalMeio: { flex: 1, minWidth: 0 },
  avalNome: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: tema.texto },
  avalEstrelas: { flexDirection: 'row', gap: 1, marginTop: 2, alignItems: 'center' },
  avalDataCol: { marginLeft: 'auto', justifyContent: 'center' },
  avalData: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '500',
    color: '#414754',
    textAlign: 'right',
  },
  avalTexto: {
    marginTop: 11,
    fontSize: 14,
    lineHeight: 23,
    fontWeight: '400',
    color: '#414754',
  },
});
