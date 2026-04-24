import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CabecalhoFluxo } from '../componentes/CabecalhoFluxo';
import type { RotasAbas } from '../navegacao/NavegacaoAbas';
import { ModalConfirmarExclusao } from '../componentes/ModalConfirmarExclusao';
import { tema } from '../estilos/tema';
import type { PilhaNoticiasAdminParametros } from '../navegacao/tiposNavegacao';
import { excluirNoticia, listarNoticias } from '../servicos/noticiaServico';
import type { Noticia } from '../tipos/noticia';

type Props = NativeStackScreenProps<PilhaNoticiasAdminParametros, 'Gerenciar'>;

const figma = {
  azul: '#1E6FD9',
  texto: '#1C1C1C',
  cinzaSecao: '#6B6B6B',
  cinzaContador: '#8A8A8A',
  cinzaData: '#8A8A8A',
  badgeBg: '#DCE8FF',
  iconeAcao: '#5C5C5C',
};

export function TelaGerenciarNoticias({ navigation }: Props) {
  const [itens, setItens] = useState<Noticia[]>([]);
  const [idExcluir, setIdExcluir] = useState<number | null>(null);
  const alturaBarraAbas = useBottomTabBarHeight();

  const recarregar = useCallback(async () => {
    setItens(await listarNoticias());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar])
  );

  function aoVoltarCabecalho() {
    const abas = navigation.getParent<BottomTabNavigationProp<RotasAbas>>();
    if (abas) {
      abas.navigate('Inicio');
      return;
    }
    (navigation as unknown as BottomTabNavigationProp<RotasAbas>).navigate('Inicio');
  }

  async function confirmarExclusao() {
    if (idExcluir == null) return;
    await excluirNoticia(idExcluir);
    setIdExcluir(null);
    await recarregar();
  }

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.headerFundo}>
        <CabecalhoFluxo
          titulo="Gerenciar notícias"
          mostrarVoltar
          aoVoltar={aoVoltarCabecalho}
          tituloAoLadoDoVoltar
          varianteFigmaGerenciar
        />
      </View>

      <View style={estilos.conteudo}>
        <TouchableOpacity
          style={estilos.btnAdd}
          onPress={() => navigation.navigate('Nova')}
          activeOpacity={0.9}
        >
          <Text style={estilos.btnAddTxt}>+ Adicionar nova notícia</Text>
        </TouchableOpacity>

        <View style={estilos.secaoTopo}>
          <Text style={estilos.secaoTitulo}>Publicações recentes</Text>
          <Text style={estilos.contador}>
            {itens.length} {itens.length === 1 ? 'Artigo' : 'Artigos'}
          </Text>
        </View>

        <FlatList
          data={itens}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={{
            paddingBottom: alturaBarraAbas + 16,
            paddingHorizontal: 24,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          decelerationRate="normal"
          ListEmptyComponent={
            <Text style={estilos.vazio}>Nenhuma notícia cadastrada ainda.</Text>
          }
          renderItem={({ item }) => (
            <View style={estilos.card}>
              {item.imagem ? (
                <Image source={{ uri: item.imagem }} style={estilos.thumb} resizeMode="cover" />
              ) : (
                <View style={[estilos.thumb, estilos.thumbSemImagem]}>
                  <Ionicons name="image-outline" size={22} color="#8A8A8A" />
                </View>
              )}
              <View style={estilos.cardCorpo}>
                <View style={estilos.cardTopo}>
                  <View style={estilos.linhaSup}>
                    <Text style={estilos.tag}>{item.categoria.toUpperCase()}</Text>
                    <Text style={estilos.data}>• {item.data}</Text>
                  </View>
                  <Text style={estilos.titulo} numberOfLines={2}>
                    {item.titulo}
                  </Text>
                </View>
                <View style={estilos.acoes}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Editar', { idNoticia: item.id })}
                    style={estilos.iconeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="pencil" size={18} color={figma.iconeAcao} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIdExcluir(item.id)}
                    style={estilos.iconeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color={figma.iconeAcao} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <ModalConfirmarExclusao
        visivel={idExcluir != null}
        aoFechar={() => setIdExcluir(null)}
        aoConfirmar={() => void confirmarExclusao()}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundoBranco },
  headerFundo: {
    backgroundColor: tema.fundoBranco,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  conteudo: {
    flex: 1,
    paddingTop: 18,
  },
  btnAdd: {
    marginHorizontal: 24,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: figma.azul,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  btnAddTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  secaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 24,
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: figma.cinzaSecao,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contador: {
    fontSize: 14,
    color: figma.cinzaContador,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: tema.fundoBranco,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  thumb: {
    width: 95,
    height: 80,
    borderRadius: 6,
    backgroundColor: figma.badgeBg,
  },
  thumbSemImagem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1F6',
  },
  cardCorpo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  cardTopo: { flexShrink: 1 },
  linhaSup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
    fontWeight: '700',
    color: figma.azul,
    backgroundColor: figma.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  data: { fontSize: 12, color: figma.cinzaData, fontWeight: '500', marginLeft: 6 },
  titulo: {
    marginTop: 4,
    fontWeight: '700',
    color: figma.texto,
    fontSize: 16,
    lineHeight: 20,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 6,
  },
  iconeBtn: { padding: 4 },
  vazio: {
    textAlign: 'center',
    color: tema.textoSecundario,
    marginTop: 24,
    fontSize: 14,
    paddingHorizontal: 24,
  },
});
