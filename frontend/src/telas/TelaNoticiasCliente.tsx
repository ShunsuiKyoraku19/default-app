import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CabecalhoFluxo } from '../componentes/CabecalhoFluxo';
import { FILTROS_CLIENTE } from '../constantes/categoriasNoticia';
import { tema } from '../estilos/tema';
import type { PilhaNoticiasClienteParametros } from '../navegacao/tiposNavegacao';
import { listarNoticias } from '../servicos/noticiaServico';
import type { Noticia } from '../tipos/noticia';

type Props = NativeStackScreenProps<PilhaNoticiasClienteParametros, 'Feed'>;

function corCategoria(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('manuten')) return tema.laranja;
  if (c.includes('corrida')) return tema.azulEscuro;
  return tema.azulPrimario;
}

export function TelaNoticiasCliente({ navigation }: Props) {
  const [lista, setLista] = useState<Noticia[]>([]);
  const [filtro, setFiltro] = useState('Todas');

  const recarregar = useCallback(async () => {
    const todos = await listarNoticias();
    setLista(todos);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar])
  );

  const filtrada =
    filtro === 'Todas'
      ? lista
      : lista.filter((n) => n.categoria.toLowerCase() === filtro.toLowerCase());

  const cabecalhoFiltros = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.filtros}
    >
      {FILTROS_CLIENTE.map((nome) => {
        const ativo = filtro === nome;
        return (
          <TouchableOpacity
            key={nome}
            onPress={() => setFiltro(nome)}
            style={[estilos.chip, ativo && estilos.chipAtivo]}
          >
            <Text style={[estilos.chipTexto, ativo && estilos.chipTextoAtivo]}>{nome}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  return (
    <View style={estilos.safe}>
      <CabecalhoFluxo titulo="Notícias" mostrarVoltar={false} mostrarAvatar />

      <FlatList
        data={filtrada}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View>
            {cabecalhoFiltros}
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={estilos.vazio}>Nenhuma notícia encontrada para este filtro.</Text>
        }
        renderItem={({ item, index }) => {
          const destaque = filtro === 'Todas' && index === 0;
          return (
            <TouchableOpacity
              style={estilos.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Detalhe', { idNoticia: item.id })}
            >
              {item.imagem ? (
                <View>
                  <Image source={{ uri: item.imagem }} style={estilos.img} />
                  {destaque && (
                    <View style={estilos.badge}>
                      <Text style={estilos.badgeTxt}>DESTAQUE</Text>
                    </View>
                  )}
                </View>
              ) : null}
              <View style={estilos.corpo}>
                <View style={estilos.linhaCat}>
                  <Text style={[estilos.cat, { color: corCategoria(item.categoria) }]}>
                    {item.categoria}
                  </Text>
                  <Text style={estilos.data}>• {item.data}</Text>
                </View>
                <Text style={estilos.titulo}>{item.titulo}</Text>
                <Text style={estilos.resumo} numberOfLines={3}>
                  {item.resumo}
                </Text>
                {destaque ? (
                  <Text style={estilos.lerMaisLink}>Ler mais →</Text>
                ) : (
                  <View style={estilos.lerMaisBtn}>
                    <Text style={estilos.lerMaisBtnTxt}>Ler mais</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundo },
  filtros: { paddingVertical: 8, paddingRight: 16 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: tema.borda,
    marginRight: 10,
  },
  chipAtivo: { backgroundColor: tema.azulPrimario, borderColor: tema.azulPrimario },
  chipTexto: { fontWeight: '600', color: tema.textoSecundario },
  chipTextoAtivo: { color: '#fff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  img: { width: '100%', height: 180 },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: tema.azulPrimario,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  corpo: { padding: 16 },
  linhaCat: { flexDirection: 'row', alignItems: 'center' },
  cat: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginRight: 6 },
  data: { fontSize: 12, color: tema.textoMuted },
  titulo: { marginTop: 8, fontSize: 18, fontWeight: '800', color: tema.texto },
  resumo: { marginTop: 8, color: tema.textoSecundario, lineHeight: 20 },
  lerMaisLink: { marginTop: 12, color: tema.azulPrimario, fontWeight: '800' },
  lerMaisBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: tema.borda,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  lerMaisBtnTxt: { color: tema.textoSecundario, fontWeight: '700' },
  vazio: { textAlign: 'center', color: tema.textoSecundario, marginTop: 24 },
});
