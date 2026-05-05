import React, { useMemo } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { tema } from '../estilos/tema';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import type { PilhaInicioParametros, RotasAbas } from '../navegacao/tiposNavegacao';

const AZUL_FIGMA = '#1E6FD9';
const imagemOleoDireita = require('../../assets/home-troca-oleo.png');

type NomeMci = ComponentProps<typeof MaterialCommunityIcons>['name'];

const CATEGORIAS: {
  rotulo: string;
  icone?: NomeMci;
  imagem?: ImageSourcePropType;
  vermelho?: boolean;
}[] = [
  { rotulo: 'MECÂNICA', imagem: require('../../assets/categoria-mecanica.png') },
  { rotulo: 'ÓLEO', imagem: require('../../assets/categoria-oleo.png') },
  { rotulo: 'ELÉTRICA', imagem: require('../../assets/categoria-eletrica.png') },
  { rotulo: 'PNEUS', imagem: require('../../assets/Icon (3).png') },
  { rotulo: 'REVISÃO', imagem: require('../../assets/Icon (7).png') },
  { rotulo: 'LAVA\u2011JATO', imagem: require('../../assets/Icon (6).png') },
  { rotulo: 'GUINCHO', imagem: require('../../assets/categoria-guincho.png') },
  { rotulo: 'S.O.S', imagem: require('../../assets/categoria-sos.png'), vermelho: true },
];

const OFICINAS: {
  nome: string;
  nota: string;
  servico: string;
  tempo: string;
  dist: string;
  thumb: ImageSourcePropType;
}[] = [
  {
    nome: 'Mecânica Seu Zé',
    nota: '4.8',
    servico: 'Mecânica Geral',
    tempo: '30-45 min',
    dist: '1.5 km',
    thumb: require('../../assets/images/oficina-seu-ze.jpg'),
  },
  {
    nome: 'Peças Premium',
    nota: '4.9',
    servico: 'Importados',
    tempo: '45-60 min',
    dist: '2.2 km',
    thumb: require('../../assets/images/oficina-pecas-premium.jpg'),
  },
];

const GRID_GAP = 15;
const BOX_ALVO = 70;

type NavInicio = NativeStackNavigationProp<PilhaInicioParametros>;

export function TelaHome() {
  const navigation = useNavigation<NavInicio>();
  const { usuario } = useAutenticacao();

  function irParaDetalhesOficina(nome: string) {
    const tabNav = navigation.getParent<BottomTabNavigationProp<RotasAbas>>();
    if (tabNav != null) {
      tabNav.navigate('Inicio', {
        screen: 'DetalhesOficina',
        params: { nome },
      });
      return;
    }
    navigation.navigate('DetalhesOficina', { nome });
  }
  const alturaBarraAbas = useBottomTabBarHeight();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const { width: larguraTela } = useWindowDimensions();

  const textoLocalizacao = useMemo(() => {
    const cidade = usuario?.cidadeNome?.trim();
    const uf = usuario?.ufSigla?.trim();
    if (cidade && uf) return `${cidade}, ${uf}`;
    return 'Ceilândia, Brasília';
  }, [usuario?.cidadeNome, usuario?.ufSigla]);

  const { larguraGrid, tamanhoBox, iconeCat } = useMemo(() => {
    const margens = 40;
    const maxLinha = larguraTela - margens;
    const natural = 4 * BOX_ALVO + 3 * GRID_GAP;
    if (maxLinha >= natural) {
      return { larguraGrid: natural, tamanhoBox: BOX_ALVO, iconeCat: 26 };
    }
    const box = Math.floor((maxLinha - 3 * GRID_GAP) / 4);
    return {
      larguraGrid: maxLinha,
      tamanhoBox: Math.max(52, box),
      iconeCat: Math.round(Math.min(26, box * 0.38)),
    };
  }, [larguraTela]);

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: alturaBarraAbas + 14 }}
      >
        <View style={estilos.topo}>
          <View style={estilos.local}>
            <Ionicons name="location-sharp" size={18} color={AZUL_FIGMA} />
            <Text style={estilos.localTexto}>{textoLocalizacao}</Text>
            <Ionicons name="chevron-down" size={14} color={AZUL_FIGMA} />
          </View>
          <View style={estilos.avatar}>
            <Text style={estilos.avatarLetra}>{inicial}</Text>
          </View>
        </View>

        <View style={estilos.buscaWrap}>
          <Ionicons name="search" size={18} color="#9E9E9E" />
          <TextInput
            placeholder="Buscar oficinas ou serviços..."
            placeholderTextColor="#9E9E9E"
            style={estilos.buscaInput}
          />
        </View>

        <View style={estilos.gridWrap}>
          <View style={[estilos.grid, { width: larguraGrid, columnGap: GRID_GAP, rowGap: GRID_GAP }]}>
            {CATEGORIAS.map((c) => (
              <View key={c.rotulo} style={[estilos.celula, { width: tamanhoBox }]}>
                <View
                  style={[
                    estilos.iconeBox,
                    { width: tamanhoBox, height: tamanhoBox, borderRadius: 12 },
                    c.vermelho && estilos.iconeBoxSos,
                  ]}
                >
                  {c.imagem != null ? (
                    <Image
                      source={c.imagem}
                      style={{
                        width: Math.round(
                          iconeCat * (c.rotulo === 'S.O.S' ? 1.05 : 1.2),
                        ),
                        height: Math.round(
                          iconeCat * (c.rotulo === 'S.O.S' ? 1.05 : 1.2),
                        ),
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={c.icone!}
                      size={c.vermelho ? Math.min(28, iconeCat + 2) : iconeCat}
                      color={c.vermelho ? '#E53935' : AZUL_FIGMA}
                    />
                  )}
                </View>
                <Text
                  style={[estilos.celulaTexto, c.vermelho && estilos.celulaTextoSos]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                  {...(Platform.OS === 'android' ? { textBreakStrategy: 'simple' as const } : {})}
                >
                  {c.rotulo}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={estilos.bannerCard}>
          <View style={estilos.bannerEsquerda}>
            <Text style={estilos.bannerTitulo}>Troca de óleo com 20% de desconto.</Text>
            <View style={estilos.bannerBotaoFundo}>
              <View style={estilos.bannerBotao}>
                <Text style={estilos.bannerBotaoTexto}>AGENDE AGORA</Text>
              </View>
            </View>
          </View>
          <View style={estilos.bannerDireitaWrap}>
            <Image
              source={imagemOleoDireita}
              style={estilos.bannerDireitaImg}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={estilos.secaoTopo}>
          <Text style={estilos.secaoTitulo}>Oficinas Próximas</Text>
          <Text style={estilos.verTodas}>Ver todas</Text>
        </View>

        {OFICINAS.map((o) => (
          <TouchableOpacity
            key={o.nome}
            style={estilos.cardOficina}
            activeOpacity={0.75}
            onPress={() => irParaDetalhesOficina(o.nome)}
          >
            <Image source={o.thumb} style={estilos.cardImg} resizeMode="cover" />
            <View style={estilos.cardCorpo}>
              <Text style={estilos.cardNome} numberOfLines={1}>
                {o.nome}
              </Text>
              <View style={estilos.linhaNota}>
                <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
                <Text style={estilos.nota}>{o.nota}</Text>
                <Text style={estilos.servico} numberOfLines={1}>
                  {o.servico}
                </Text>
              </View>
              <View style={estilos.linhaInfo}>
                <MaterialCommunityIcons name="clock-outline" size={13} color="#757575" />
                <Text style={estilos.info}>{o.tempo}</Text>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={13}
                  color="#757575"
                  style={estilos.infoIconeDist}
                />
                <Text style={estilos.info}>{o.dist}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundoBranco },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 70,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  buscaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#F1F1F1',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 25,
    paddingHorizontal: 15,
    gap: 8,
  },
  buscaInput: { flex: 1, fontSize: 13, fontWeight: '500', color: tema.texto, paddingVertical: 0 },
  gridWrap: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  celula: {
    alignItems: 'center',
  },
  iconeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.fundoBranco,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconeBoxSos: {
    backgroundColor: '#FFEAEA',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    shadowOpacity: 0.06,
  },
  celulaTexto: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    color: tema.texto,
    letterSpacing: -0.35,
    maxWidth: '100%',
    alignSelf: 'stretch',
  },
  celulaTextoSos: {
    color: '#E53935',
    fontWeight: '700',
  },
  bannerCard: {
    flexDirection: 'row',
    height: 140,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: AZUL_FIGMA,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerEsquerda: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  bannerTitulo: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    paddingRight: 4,
    flexShrink: 1,
  },
  bannerBotaoFundo: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 2,
  },
  bannerBotao: {
    alignSelf: 'flex-start',
    backgroundColor: tema.fundoBranco,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 4,
  },
  bannerBotaoTexto: {
    color: AZUL_FIGMA,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  bannerDireitaWrap: {
    width: '45%',
    height: '100%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#DCE8FF',
  },
  bannerDireitaImg: {
    width: '100%',
    height: '100%',
  },
  secaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  secaoTitulo: { fontSize: 20, fontWeight: '700', color: tema.texto },
  verTodas: { color: AZUL_FIGMA, fontWeight: '600', fontSize: 14 },
  cardOficina: {
    marginHorizontal: 20,
    marginBottom: 12,
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
