import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CabecalhoFluxo } from '../componentes/CabecalhoFluxo';
import { BotaoPrimario } from '../componentes/BotaoPrimario';
import { CATEGORIAS_NOTICIA } from '../constantes/categoriasNoticia';
import { tema } from '../estilos/tema';
import type { PilhaNoticiasAdminParametros } from '../navegacao/tiposNavegacao';
import { atualizarNoticia, buscarNoticiaPorId } from '../servicos/noticiaServico';
import { resolverUriCapa } from '../servicos/uploadImagemServico';
import type { Noticia } from '../tipos/noticia';
type Props = NativeStackScreenProps<PilhaNoticiasAdminParametros, 'Editar'>;

function BarraEditorFalso() {
  return (
    <View style={estilosBarra.wrap}>
      <Text style={estilosBarra.icone}>B</Text>
      <Text style={estilosBarra.icone}>I</Text>
      <Ionicons name="list" size={20} color={tema.textoSecundario} />
      <Ionicons name="link" size={20} color={tema.textoSecundario} />
      <Ionicons name="image-outline" size={20} color={tema.textoSecundario} style={{ marginLeft: 'auto' }} />
    </View>
  );
}

export function TelaEditarNoticia({ navigation, route }: Props) {
  const { idNoticia } = route.params;
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [salvando, setSalvando] = useState(false);

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

  async function trocarCapa() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão', 'Precisamos acessar a galeria.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
    });
    if (!resultado.canceled && resultado.assets[0] && noticia) {
      setNoticia({ ...noticia, imagem: resultado.assets[0].uri });
    }
  }

  async function salvar() {
    if (!noticia) return;
    if (!noticia.titulo.trim() || !noticia.data.trim()) {
      Alert.alert('Formulário', 'Preencha pelo menos título e data.');
      return;
    }
    setSalvando(true);
    try {
      let imagem = noticia.imagem;
      // upload só se for arquivo local (http já serve direto)
      if (imagem && !imagem.startsWith('http')) {
        imagem = await resolverUriCapa(imagem);
      }
      await atualizarNoticia({ ...noticia, imagem });
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  if (!noticia) {
    return (
      <SafeAreaView style={estilos.safe} edges={['top']}>
        <View style={estilos.cabecalhoArea}>
          <CabecalhoFluxo titulo="Editar Notícia" aoVoltar={() => navigation.goBack()} />
        </View>
        <Text style={estilos.carregando}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.cabecalhoArea}>
        <CabecalhoFluxo titulo="Editar Notícia" aoVoltar={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          <Text style={estilos.label}>IMAGEM DE CAPA</Text>
          <TouchableOpacity onPress={trocarCapa}>
            {noticia.imagem ? (
              <Image source={{ uri: noticia.imagem }} style={estilos.capa} />
            ) : (
              <View style={estilos.placeholder}>
                <Text style={estilos.phTxt}>Toque para escolher imagem</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={[estilos.label, { marginTop: 16 }]}>Título da Notícia</Text>
          <TextInput
            style={estilos.input}
            value={noticia.titulo}
            onChangeText={(t) => setNoticia({ ...noticia, titulo: t })}
          />

          <View style={estilos.linha2}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={estilos.label}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 4 }}>
                  {CATEGORIAS_NOTICIA.map((c) => {
                    const ativo = noticia.categoria === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        onPress={() => setNoticia({ ...noticia, categoria: c })}
                        style={[estilos.miniChip, ativo && estilos.miniChipAtivo]}
                      >
                        <Text style={[estilos.miniChipTxt, ativo && { color: '#fff' }]}>{c}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={estilos.label}>Data de Publicação</Text>
              <TextInput
                style={estilos.input}
                value={noticia.data}
                onChangeText={(t) => setNoticia({ ...noticia, data: t })}
                placeholder="dd/mm/aaaa ou texto livre"
                placeholderTextColor="#9E9E9E"
              />
            </View>
          </View>

          <Text style={[estilos.label, { marginTop: 12 }]}>Resumo</Text>
          <TextInput
            style={[estilos.input, { minHeight: 80, textAlignVertical: 'top' }]}
            multiline
            value={noticia.resumo}
            onChangeText={(t) => setNoticia({ ...noticia, resumo: t })}
          />

          <Text style={[estilos.label, { marginTop: 12 }]}>Conteúdo da Matéria</Text>
          <View style={estilos.editor}>
            <BarraEditorFalso />
            <TextInput
              style={estilos.areaConteudo}
              multiline
              value={noticia.conteudo}
              onChangeText={(t) => setNoticia({ ...noticia, conteudo: t })}
            />
          </View>

          <BotaoPrimario
            titulo="Salvar alterações"
            aoPressionar={() => void salvar()}
            carregando={salvando}
            estiloExtra={{ marginTop: 20 }}
          />
          <BotaoPrimario
            titulo="Cancelar"
            variante="borda"
            aoPressionar={() => navigation.goBack()}
            estiloExtra={{ marginTop: 12 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundo },
  cabecalhoArea: {
    paddingTop: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  carregando: { textAlign: 'center', marginTop: 40, color: tema.textoSecundario },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: tema.textoSecundario,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: tema.fundoInput,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: tema.texto,
  },
  capa: { width: '100%', height: 180, borderRadius: 14 },
  placeholder: {
    height: 140,
    borderRadius: 14,
    backgroundColor: tema.fundoInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phTxt: { color: tema.textoMuted },
  linha2: { flexDirection: 'row', marginTop: 12 },
  miniChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: tema.fundoInput,
  },
  miniChipAtivo: { backgroundColor: tema.azulPrimario },
  miniChipTxt: { fontSize: 12, fontWeight: '600', color: tema.texto },
  editor: {
    borderWidth: 1,
    borderColor: tema.borda,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  areaConteudo: {
    minHeight: 180,
    padding: 14,
    fontSize: 15,
    color: tema.texto,
    textAlignVertical: 'top',
  },
});

const estilosBarra = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: tema.fundoInput,
    borderBottomWidth: 1,
    borderBottomColor: tema.borda,
  },
  icone: { fontSize: 18, fontWeight: '800', color: tema.textoSecundario },
});
