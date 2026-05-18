import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PropsTelaDetalhe } from '../navegacao/tiposNavegacao';
import { buscarNoticiaPorId } from '../servicos/noticiaServico';
import type { Noticia } from '../tipos/noticia';

function HeaderDetalheNoticia({
  onVoltar,
  inicial,
}: {
  onVoltar: () => void;
  inicial: string;
}) {
  return (
    <View style={estilos.header}>
      <Pressable
        onPress={onVoltar}
        hitSlop={12}
        style={estilos.btnVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <Ionicons name="chevron-back" size={26} color={tema.azulPrimario} />
      </Pressable>
      <Text style={estilos.tituloHeader} numberOfLines={1}>
        Notícia
      </Text>
      <View style={estilos.avatar}>
        <Text style={estilos.avatarLetra}>{inicial}</Text>
      </View>
    </View>
  );
}

export function TelaDetalheNoticia({ navigation, route }: PropsTelaDetalhe) {
  const { idNoticia } = route.params;
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const alturaBarraAbas = useBottomTabBarHeight();
  const [noticia, setNoticia] = useState<Noticia | null>(null);

  const voltar = useCallback(() => navigation.goBack(), [navigation]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        const n = await buscarNoticiaPorId(idNoticia);
        if (ativo) setNoticia(n);
      })();
      return () => {
        ativo = false;
      };
    }, [idNoticia])
  );

  if (!noticia) {
    return (
      <SafeAreaView style={estilos.safe} edges={['top']}>
        <HeaderDetalheNoticia onVoltar={voltar} inicial={inicial} />
        <Text style={estilos.carregando}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <HeaderDetalheNoticia onVoltar={voltar} inicial={inicial} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: alturaBarraAbas + 28 }}
      >
        {noticia.imagem ? (
          <Image source={{ uri: noticia.imagem }} style={estilos.hero} />
        ) : null}
        <View style={estilos.corpo}>
          <View style={estilos.pill}>
            <Text style={estilos.pillTxt}>{noticia.categoria}</Text>
          </View>
          <Text style={estilos.titulo}>{noticia.titulo}</Text>
          <Text style={estilos.linhaAutor}>
            Por FLUXCARR News • {noticia.data}
          </Text>
          <Text style={estilos.resumo}>{noticia.resumo}</Text>
          <Text style={estilos.conteudo}>{noticia.conteudo}</Text>
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
    paddingHorizontal: 16,
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
  carregando: { textAlign: 'center', marginTop: 40, color: tema.textoSecundario },
  hero: { width: '100%', height: 220 },
  corpo: { padding: 20 },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: tema.azulClaro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  pillTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: tema.azulEscuro,
    textTransform: 'uppercase',
  },
  titulo: { fontSize: 24, fontWeight: '800', color: tema.texto, marginBottom: 10 },
  linhaAutor: { color: tema.textoMuted, marginBottom: 16, fontSize: 13 },
  resumo: {
    fontSize: 16,
    lineHeight: 24,
    color: tema.textoSecundario,
    marginBottom: 16,
    fontWeight: '600',
  },
  conteudo: { fontSize: 16, lineHeight: 26, color: tema.texto },
});
