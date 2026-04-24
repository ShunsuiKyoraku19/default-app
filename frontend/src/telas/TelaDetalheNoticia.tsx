import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CabecalhoFluxo } from '../componentes/CabecalhoFluxo';
import { tema } from '../estilos/tema';
import type { PropsTelaDetalhe } from '../navegacao/tiposNavegacao';
import { buscarNoticiaPorId } from '../servicos/noticiaServico';
import type { Noticia } from '../tipos/noticia';

export function TelaDetalheNoticia({ navigation, route }: PropsTelaDetalhe) {
  const { idNoticia } = route.params;
  const [noticia, setNoticia] = useState<Noticia | null>(null);

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
      <View style={estilos.safe}>
        <CabecalhoFluxo titulo="Notícia" aoVoltar={() => navigation.goBack()} />
        <Text style={estilos.carregando}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.safe}>
      <CabecalhoFluxo titulo="Notícia" aoVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
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
    </View>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundo },
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
