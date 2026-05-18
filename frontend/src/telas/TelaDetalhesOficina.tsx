import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { obterDetalhesPorLojaId, obterLojaPorId } from '../constantes/lojasFicticias';
import {
  carregarAvaliacoesLocaisDaLoja,
  obterChaveAutorAvaliacao,
  salvarOuAtualizarAvaliacaoLocal,
} from '../servicos/avaliacoesLocaisLoja';
import { obterResumoAvaliacaoLoja, type ResumoAvaliacaoLoja } from '../servicos/avaliacoesResumoLoja';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PilhaInicioParametros } from '../navegacao/tiposNavegacao';
import type { AvaliacaoOficina } from '../tipos/loja';

type Props = NativeStackScreenProps<PilhaInicioParametros, 'DetalhesOficina'>;

const AZUL_FUNDO = '#EFF6FF';
const TAG_ATIVA_FUNDO = 'rgba(166, 196, 253, 0.30)';
const TAG_ATIVA_TEXTO = '#315182';

type NomeMci = ComponentProps<typeof MaterialCommunityIcons>['name'];

const CHIPS_OPCOES = ['Rápido', 'Confiável', 'Limpo'] as const;

export function TelaDetalhesOficina({ navigation, route }: Props) {
  const { lojaId } = route.params;
  const dados = useMemo(() => obterDetalhesPorLojaId(lojaId), [lojaId]);
  const lojaCard = useMemo(() => obterLojaPorId(lojaId), [lojaId]);
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();
  const [indiceTag, setIndiceTag] = useState(0);
  const [resumo, setResumo] = useState<ResumoAvaliacaoLoja | null>(null);
  const [modalAval, setModalAval] = useState(false);
  const [modalEstrelas, setModalEstrelas] = useState(0);
  const [modalTexto, setModalTexto] = useState('');
  const [chipsSel, setChipsSel] = useState<Set<string>>(() => new Set());

  const recarregarResumo = useCallback(async () => {
    const r = await obterResumoAvaliacaoLoja(lojaId);
    setResumo(r);
  }, [lojaId]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      void obterResumoAvaliacaoLoja(lojaId).then((r) => {
        if (ativo) setResumo(r);
      });
      return () => {
        ativo = false;
      };
    }, [lojaId])
  );

  async function abrirModalAvaliacao() {
    setChipsSel(new Set());
    setModalEstrelas(0);
    setModalTexto('');
    const locais = await carregarAvaliacoesLocaisDaLoja(lojaId);
    const chave = obterChaveAutorAvaliacao(usuario);
    const existente = locais.find((x) => x.autorChave === chave);
    if (existente != null) {
      setModalEstrelas(existente.estrelas);
      setModalTexto(existente.texto);
    }
    setModalAval(true);
  }

  function fecharModalAvaliacao() {
    setModalAval(false);
  }

  async function postarAvaliacaoModal() {
    if (modalEstrelas < 1) return;
    const base = modalTexto.trim();
    const extras = CHIPS_OPCOES.filter((c) => chipsSel.has(c));
    const partes: string[] = [];
    if (base.length > 0) partes.push(base);
    if (extras.length > 0) partes.push(extras.join(' · '));
    const textoFinal = partes.join('\n');
    const item: AvaliacaoOficina = {
      nome: usuario?.nome?.trim() || 'Cliente',
      data: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
      estrelas: modalEstrelas,
      texto: textoFinal,
    };
    await salvarOuAtualizarAvaliacaoLocal(lojaId, item, obterChaveAutorAvaliacao(usuario));
    await recarregarResumo();
    fecharModalAvaliacao();
  }

  function alternarChip(rotulo: string) {
    setChipsSel((prev) => {
      const n = new Set(prev);
      if (n.has(rotulo)) n.delete(rotulo);
      else n.add(rotulo);
      return n;
    });
  }

  const notaTopo = resumo?.mediaTexto ?? dados.nota;
  const totalTopo = resumo?.total ?? dados.avaliacoes;
  const maxBar = useMemo(() => {
    if (resumo == null) return 1;
    return Math.max(...resumo.contagemPorEstrela, 1);
  }, [resumo]);
  const fallbackMedia = parseFloat(String(dados.nota).replace(',', '.')) || 0;
  const mTopo = resumo?.mediaNumero;
  const estrelasTopo = Math.min(
    5,
    Math.max(0, Math.round(mTopo != null && !Number.isNaN(mTopo) ? mTopo : fallbackMedia))
  );

  const [imgPrincipal, imgSecA, imgSecB] = dados.galeria;

  return (
    <>
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
              <Text style={estilos.nomeOficina} numberOfLines={2}>
                {dados.nome}
              </Text>
              <View style={estilos.enderecoLinha}>
                <Ionicons name="location-outline" size={14} color="#414754" />
                <Text style={estilos.endereco} numberOfLines={2}>
                  {dados.endereco}
                </Text>
              </View>
            </View>
            <View style={estilos.cardNota}>
              <View style={estilos.linhaEstrelaNota}>
                <MaterialCommunityIcons name="star" size={15} color={tema.azulPrimario} />
                <Text style={estilos.notaGrande}>{notaTopo}</Text>
              </View>
              <Text style={estilos.subNotaContagem}>
                {totalTopo}
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
            onPress={() => navigation.navigate('SelecionarServicos', { lojaId })}
          >
            <Text style={estilos.botaoPrincipalTexto}>Ver Serviços</Text>
          </TouchableOpacity>

          <View style={estilos.avSecao}>
            <View style={estilos.avLinhaTopo}>
              <View style={estilos.avTitulosCol}>
                <Text style={estilos.avTitulo}>Avaliação da loja</Text>
                <Text style={estilos.avSubtitulo}>Dê sua opinião sobre o atendimento</Text>
              </View>
              <Pressable hitSlop={8}>
                <Text style={estilos.avLinkTodas}>Todas</Text>
              </Pressable>
            </View>

            <View style={estilos.avResumoRow}>
              <View style={estilos.avColEsquerda}>
                <Text style={estilos.avMediaGrande}>{notaTopo}</Text>
                <View style={estilos.avEstrelasMedia}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <MaterialCommunityIcons
                      key={i}
                      name="star"
                      size={12}
                      color={i <= estrelasTopo ? tema.azulPrimario : '#D1D5DB'}
                    />
                  ))}
                </View>
                <Text style={estilos.avTotalTxt}>
                  {totalTopo} {totalTopo === 1 ? 'avaliação' : 'avaliações'}
                </Text>
              </View>
              <View style={estilos.avBarrasCol}>
                {[5, 4, 3, 2, 1].map((est) => {
                  const count = resumo?.contagemPorEstrela[5 - est] ?? 0;
                  const pct = maxBar > 0 ? (count / maxBar) * 100 : 0;
                  return (
                    <View key={est} style={estilos.avBarLinha}>
                      <Text style={estilos.avBarLabel}>{est}</Text>
                      <View style={estilos.avBarTrilho}>
                        <View style={[estilos.avBarPreench, { width: `${pct}%` }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <Pressable style={estilos.avEscreverLinha} onPress={abrirModalAvaliacao}>
              <Text style={estilos.avEscreverTxt}>Escreva uma avaliação</Text>
              <Ionicons name="chevron-forward" size={16} color={tema.azulPrimario} />
            </Pressable>

            {(resumo?.listaComentarios ?? dados.avaliacoesLista).map((a, idx, arr) => (
              <View
                key={`${lojaId}-${a.nome}-${a.data}-${idx}`}
                style={[
                  estilos.cardAvalNovo,
                  idx === 0 && estilos.cardAvalPrimeiro,
                  idx < arr.length - 1 && estilos.cardAvalNovoMargin,
                ]}
              >
                <View style={estilos.avalTopoNovo}>
                  <View style={estilos.avalAvatarNovo}>
                    <Text style={estilos.avalAvatarLetraNovo}>{a.nome.charAt(0)}</Text>
                  </View>
                  <View style={estilos.avalMeioNovo}>
                    <View style={estilos.avalLinhaNomeData}>
                      <Text style={estilos.avalNomeNovo} numberOfLines={1}>
                        {a.nome}
                      </Text>
                      <Text style={estilos.avalDataNovo}>{a.data}</Text>
                    </View>
                    <View style={estilos.avalEstrelasNovo}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <MaterialCommunityIcons
                          key={i}
                          name="star"
                          size={12}
                          color={i < a.estrelas ? tema.azulPrimario : '#D1D5DB'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                {a.texto.length > 0 ? <Text style={estilos.avalTextoNovo}>{a.texto}</Text> : null}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>

      <Modal
        visible={modalAval}
        animationType="slide"
        transparent
        onRequestClose={fecharModalAvaliacao}
      >
      <View style={estilos.modalFundo}>
        <Pressable style={estilos.modalFundoToque} onPress={fecharModalAvaliacao} />
        <View style={estilos.modalCard}>
          <View style={estilos.modalHeader}>
            <View style={estilos.modalHeaderEsquerda}>
              <Pressable onPress={fecharModalAvaliacao} hitSlop={10} style={estilos.modalBtnX}>
                <Ionicons name="close" size={22} color={tema.texto} />
              </Pressable>
              <Text style={estilos.modalTitulo}>Avaliar loja</Text>
            </View>
            <Pressable
              onPress={postarAvaliacaoModal}
              disabled={modalEstrelas < 1}
              style={modalEstrelas < 1 ? estilos.modalPostarTopoOff : undefined}
            >
              <Text style={estilos.modalPostarTopoTxt}>Postar</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.modalScroll}
          >
            <View style={estilos.modalLojaRow}>
              <View style={estilos.modalThumbWrap}>
                {lojaCard?.imagemCard != null ? (
                  <Image source={lojaCard.imagemCard} style={estilos.modalThumb} resizeMode="cover" />
                ) : (
                  <View style={[estilos.modalThumb, estilos.modalThumbPlaceholder]} />
                )}
              </View>
              <View style={estilos.modalLojaTxtCol}>
                <Text style={estilos.modalLojaNome}>{dados.nome}</Text>
                <Text style={estilos.modalLojaCat}>
                  {lojaCard?.categoriaPrincipal ?? dados.tags[0] ?? 'Oficina'}
                </Text>
              </View>
            </View>

            <View style={estilos.modalUserRow}>
              <View style={estilos.modalUserAvatar}>
                <Text style={estilos.modalUserAvatarTxt}>{inicial}</Text>
              </View>
              <View style={estilos.modalUserCol}>
                <Text style={estilos.modalUserNome}>
                  {usuario?.nome?.trim() || 'Você'} (Você)
                </Text>
                <Text style={estilos.modalUserAviso}>
                  As avaliações são públicas e ajudam outros usuários.
                </Text>
              </View>
            </View>

            <View style={estilos.modalEstrelasBloco}>
              <View style={estilos.modalEstrelasLinha}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Pressable key={n} onPress={() => setModalEstrelas(n)} hitSlop={8}>
                    <MaterialCommunityIcons
                      name="star"
                      size={36}
                      color={n <= modalEstrelas ? tema.azulPrimario : '#E4E2E4'}
                    />
                  </Pressable>
                ))}
              </View>
              <Text style={estilos.modalEstrelasDica}>Toque nas estrelas para avaliar</Text>
            </View>

            <View style={estilos.modalCampoWrap}>
              <TextInput
                value={modalTexto}
                onChangeText={setModalTexto}
                placeholder="Descreva sua experiência (opcional)"
                placeholderTextColor="rgba(65, 71, 84, 0.60)"
                style={estilos.modalTextoGrande}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={estilos.modalContador}>
                {modalTexto.length}/500
              </Text>
            </View>

            <View style={estilos.modalChipsRow}>
              {CHIPS_OPCOES.map((c) => {
                const ativo = chipsSel.has(c);
                return (
                  <Pressable
                    key={c}
                    onPress={() => alternarChip(c)}
                    style={[estilos.modalChip, ativo && estilos.modalChipAtivo]}
                  >
                    <Text style={[estilos.modalChipTxt, ativo && estilos.modalChipTxtAtivo]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={estilos.modalRodape}>
            <TouchableOpacity style={estilos.modalBtnCancel} onPress={fecharModalAvaliacao}>
              <Text style={estilos.modalBtnCancelTxt}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[estilos.modalBtnPostar, modalEstrelas < 1 && estilos.modalBtnPostarOff]}
              onPress={postarAvaliacaoModal}
              disabled={modalEstrelas < 1}
              activeOpacity={0.85}
            >
              <Text style={estilos.modalBtnPostarTxt}>Postar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
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
    minWidth: 0,
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
    flexShrink: 1,
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
    flexShrink: 1,
    minWidth: 0,
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
  avSecao: {
    marginTop: 16,
    paddingTop: 16,
    gap: 24,
  },
  avLinhaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avTitulosCol: { flex: 1, minWidth: 0, gap: 0 },
  avTitulo: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: tema.texto,
  },
  avSubtitulo: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#414754',
  },
  avLinkTodas: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: tema.azulPrimario,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  avResumoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  avColEsquerda: { alignItems: 'center', minWidth: 72 },
  avMediaGrande: {
    fontSize: 48,
    lineHeight: 48,
    fontWeight: '800',
    color: tema.texto,
  },
  avEstrelasMedia: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 8,
    alignItems: 'center',
  },
  avTotalTxt: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '500',
    color: '#414754',
  },
  avBarrasCol: { flex: 1, minWidth: 0, gap: 4 },
  avBarLinha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avBarLabel: {
    width: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: tema.texto,
    textAlign: 'center',
  },
  avBarTrilho: {
    flex: 1,
    height: 8,
    borderRadius: 12,
    backgroundColor: '#EAE7EA',
    overflow: 'hidden',
  },
  avBarPreench: {
    height: '100%',
    borderRadius: 12,
    backgroundColor: tema.azulPrimario,
  },
  avEscreverLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  avEscreverTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: tema.azulPrimario,
  },
  cardAvalNovo: { marginTop: 0 },
  cardAvalPrimeiro: { marginTop: 24 },
  cardAvalNovoMargin: { marginBottom: 24 },
  avalTopoNovo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avalAvatarNovo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#A6C4FD',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avalAvatarLetraNovo: { fontSize: 14, fontWeight: '700', color: '#315182' },
  avalMeioNovo: { flex: 1, minWidth: 0, gap: 2 },
  avalLinhaNomeData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  avalNomeNovo: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '600', color: tema.texto },
  avalDataNovo: { fontSize: 10, lineHeight: 15, fontWeight: '400', color: '#414754' },
  avalEstrelasNovo: { flexDirection: 'row', gap: 2, alignItems: 'center' },
  avalTextoNovo: {
    marginTop: 8,
    paddingHorizontal: 4,
    fontSize: 14,
    lineHeight: 23,
    fontWeight: '400',
    color: '#414754',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalFundoToque: { ...StyleSheet.absoluteFillObject },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDEF',
  },
  modalHeaderEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  modalBtnX: { padding: 4 },
  modalTitulo: { fontSize: 18, lineHeight: 28, fontWeight: '700', color: tema.texto },
  modalPostarTopoTxt: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: tema.azulPrimario },
  modalPostarTopoOff: { opacity: 0.4 },
  modalScroll: { padding: 24, gap: 24, paddingBottom: 32 },
  modalLojaRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  modalThumbWrap: { borderRadius: 16, overflow: 'hidden' },
  modalThumb: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#EAE7EA' },
  modalThumbPlaceholder: { borderWidth: 0 },
  modalLojaTxtCol: { flex: 1, minWidth: 0, gap: 2 },
  modalLojaNome: { fontSize: 20, lineHeight: 25, fontWeight: '800', color: tema.texto },
  modalLojaCat: { fontSize: 14, lineHeight: 20, fontWeight: '400', color: '#414754' },
  modalUserRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: tema.azulPrimario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalUserAvatarTxt: { fontSize: 18, lineHeight: 28, fontWeight: '700', color: '#fff' },
  modalUserCol: { flex: 1, minWidth: 0, gap: 2 },
  modalUserNome: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: tema.texto },
  modalUserAviso: { fontSize: 12, lineHeight: 19.5, fontWeight: '400', color: '#414754' },
  modalEstrelasBloco: { alignItems: 'center', gap: 16, paddingVertical: 8 },
  modalEstrelasLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
  },
  modalEstrelasDica: { fontSize: 14, lineHeight: 20, fontWeight: '500', color: tema.azulPrimario },
  modalCampoWrap: {
    position: 'relative',
    borderRadius: 16,
    backgroundColor: '#F6F3F5',
    minHeight: 120,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  modalTextoGrande: {
    fontSize: 16,
    lineHeight: 24,
    color: tema.texto,
    minHeight: 80,
  },
  modalContador: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(65, 71, 84, 0.5)',
  },
  modalChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  modalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EAE7EA',
  },
  modalChipAtivo: { backgroundColor: tema.azulClaro },
  modalChipTxt: { fontSize: 12, lineHeight: 16, fontWeight: '500', color: '#414754' },
  modalChipTxtAtivo: { color: tema.azulEscuro, fontWeight: '600' },
  modalRodape: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0EDEF',
    backgroundColor: '#fff',
  },
  modalBtnCancel: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  modalBtnCancelTxt: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#414754' },
  modalBtnPostar: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: tema.azulPrimario,
  },
  modalBtnPostarOff: { opacity: 0.45 },
  modalBtnPostarTxt: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: '#fff' },
});
