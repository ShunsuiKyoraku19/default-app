import React, { useState } from 'react';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CabecalhoFluxo } from '../componentes/CabecalhoFluxo';
import { BotaoPrimario } from '../componentes/BotaoPrimario';
import { tema } from '../estilos/tema';
import { CATEGORIAS_NOTICIA } from '../constantes/categoriasNoticia';
import type { PilhaNoticiasAdminParametros } from '../navegacao/tiposNavegacao';
import { criarNoticia } from '../servicos/noticiaServico';
import { resolverUriCapa } from '../servicos/uploadImagemServico';
import {
  dataPublicacaoCompleta,
  formatarDataPublicacaoDigitando,
} from '../util/formatarDataPublicacao';

type Props = NativeStackScreenProps<PilhaNoticiasAdminParametros, 'Nova'>;

function BarraEditorFalso() {
  return (
    <View style={estilosBarra.wrap}>
      <TouchableOpacity onPress={() => Alert.alert('Editor', 'Barra ilustrativa (sem formatação real).')}>
        <Text style={estilosBarra.icone}>B</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Alert.alert('Editor', 'Barra ilustrativa (sem formatação real).')}>
        <Text style={estilosBarra.icone}>I</Text>
      </TouchableOpacity>
      <Ionicons name="link" size={20} color={tema.textoSecundario} />
      <Ionicons name="list" size={20} color={tema.textoSecundario} />
      <Ionicons name="image-outline" size={20} color={tema.textoSecundario} style={{ marginLeft: 'auto' }} />
    </View>
  );
}

export function TelaNovaNoticia({ navigation }: Props) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Carros');
  const [data, setData] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function escolherImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão', 'Precisamos acessar a galeria para a capa.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
    });
    if (!resultado.canceled && resultado.assets[0]) {
      setImagemUri(resultado.assets[0].uri);
    }
  }

  async function publicar() {
    if (!titulo.trim() || !data.trim() || !resumo.trim() || !conteudo.trim()) {
      Alert.alert('Formulário', 'Preencha título, data, resumo e conteúdo.');
      return;
    }
    if (!dataPublicacaoCompleta(data)) {
      Alert.alert('Data', 'Informe a data completa no formato dd/mm/aaaa.');
      return;
    }
    setSalvando(true);
    try {
      let imagemFinal: string | null = null;
      if (imagemUri) {
        imagemFinal = await resolverUriCapa(imagemUri);
      }
      await criarNoticia({
        titulo: titulo.trim(),
        resumo: resumo.trim(),
        conteudo: conteudo.trim(),
        categoria,
        data: data.trim(),
        imagem: imagemFinal,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível publicar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.safe} edges={['top']}>
      <View style={estilos.cabecalhoArea}>
        <CabecalhoFluxo titulo="Nova Notícia" aoVoltar={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          <Text style={estilos.label}>TÍTULO DA NOTÍCIA</Text>
          <TextInput
            placeholder="Ex: Os carros mais velozes de 2026"
            placeholderTextColor={tema.textoMuted}
            style={estilos.input}
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={[estilos.label, { marginTop: 16 }]}>CATEGORIA</Text>
          <View style={estilos.chips}>
            {CATEGORIAS_NOTICIA.map((c) => {
              const ativo = categoria === c;
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategoria(c)}
                  style={[estilos.chip, ativo && estilos.chipAtivo]}
                >
                  <Text style={[estilos.chipTxt, ativo && estilos.chipTxtAtivo]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[estilos.label, { marginTop: 16 }]}>IMAGEM DE CAPA (OPCIONAL)</Text>
          <TouchableOpacity style={estilos.upload} onPress={escolherImagem} activeOpacity={0.85}>
            {imagemUri ? (
              <Image source={{ uri: imagemUri }} style={estilos.prev} />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={40} color={tema.textoMuted} />
                <Text style={estilos.uploadTxt}>Toque para escolher uma imagem</Text>
                <Text style={estilos.uploadSub}>PNG ou JPG — pode publicar sem capa</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={[estilos.label, { marginTop: 16 }]}>DATA DE PUBLICAÇÃO</Text>
          <View style={estilos.dataRow}>
            <TextInput
              placeholder="dd/mm/aaaa"
              placeholderTextColor="#9E9E9E"
              style={[estilos.input, { flex: 1 }]}
              value={data}
              onChangeText={(t) => setData(formatarDataPublicacaoDigitando(t))}
              keyboardType="number-pad"
              maxLength={10}
            />
            <Ionicons name="calendar-outline" size={22} color={tema.textoMuted} style={{ marginLeft: 8 }} />
          </View>
          <View style={estilos.infoBox}>
            <Ionicons name="information-circle" size={20} color={tema.azulEscuro} />
            <Text style={estilos.infoTxt}>
              Coloque a data que você está publicando sua notícia
            </Text>
          </View>

          <Text style={[estilos.label, { marginTop: 16 }]}>RESUMO</Text>
          <TextInput
            placeholder="Uma breve descrição para atrair os leitores..."
            placeholderTextColor={tema.textoMuted}
            style={[estilos.input, estilos.area]}
            multiline
            value={resumo}
            onChangeText={setResumo}
          />

          <Text style={[estilos.label, { marginTop: 16 }]}>CONTEÚDO DA NOTÍCIA</Text>
          <View style={estilos.editor}>
            <BarraEditorFalso />
            <TextInput
              placeholder="Escreva aqui o conteúdo completo da notícia..."
              placeholderTextColor={tema.textoMuted}
              style={estilos.areaConteudo}
              multiline
              value={conteudo}
              onChangeText={setConteudo}
            />
          </View>

          <BotaoPrimario
            titulo="Publicar notícia"
            aoPressionar={() => void publicar()}
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
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: tema.textoSecundario,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: tema.fundoInput,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: tema.texto,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: tema.fundoInput,
  },
  chipAtivo: { backgroundColor: tema.azulPrimario },
  chipTxt: { fontWeight: '600', color: tema.textoSecundario },
  chipTxtAtivo: { color: '#fff' },
  upload: {
    borderWidth: 2,
    borderColor: tema.borda,
    borderStyle: 'dashed',
    borderRadius: 14,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.fundoSuave,
  },
  uploadTxt: { marginTop: 8, fontWeight: '600', color: tema.textoSecundario },
  uploadSub: { fontSize: 12, color: tema.textoMuted, marginTop: 4 },
  prev: { width: '100%', height: 160, borderRadius: 10 },
  dataRow: { flexDirection: 'row', alignItems: 'center' },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: tema.azulClaro,
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  infoTxt: { flex: 1, fontSize: 12, color: tema.azulEscuro, lineHeight: 18 },
  area: { minHeight: 80, textAlignVertical: 'top' },
  editor: {
    borderWidth: 1,
    borderColor: tema.borda,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  areaConteudo: {
    minHeight: 160,
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
