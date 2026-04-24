import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BarraNavegacaoAuth } from '../componentes/BarraNavegacaoAuth';
import { BotaoPrimario } from '../componentes/BotaoPrimario';
import { CampoTexto } from '../componentes/CampoTexto';
import { CabecalhoLogo } from '../componentes/CabecalhoFluxo';
import { tema } from '../estilos/tema';
import type { PilhaAutenticacaoParametros } from '../navegacao/tiposNavegacao';
import { cadastrarCliente, emailJaExiste } from '../servicos/usuarioServico';

type Props = NativeStackScreenProps<PilhaAutenticacaoParametros, 'Cadastro'>;

const estiloInputAuth = { borderRadius: 10 };

export function TelaCadastro({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [modalOk, setModalOk] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function criarConta() {
    if (!nome.trim() || !email.trim() || !senha || !confirmar) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmar) {
      Alert.alert('Senha', 'A confirmação não bate com a senha.');
      return;
    }
    if (await emailJaExiste(email)) {
      Alert.alert('Email', 'Este email já está cadastrado.');
      return;
    }
    setSalvando(true);
    try {
      await cadastrarCliente(nome, email, senha);
      setModalOk(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={estilos.flex}>
          <ScrollView
            style={estilos.rolagem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={estilos.scroll}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('BoasVindas')}
              style={estilos.voltar}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back" size={24} color={tema.azulPrimario} />
            </TouchableOpacity>

            <View style={estilos.logoWrap}>
              <CabecalhoLogo />
            </View>

            <View style={estilos.cabecalhoForm}>
              <Text style={estilos.titulo}>Cadastrar</Text>
              <Text style={estilos.sub}>Crie Sua Conta Agora</Text>
            </View>

            <CampoTexto
              rotulo="Seu nome completo"
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
              style={estiloInputAuth}
            />
            <CampoTexto
              rotulo="Email"
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={estiloInputAuth}
            />
            <CampoTexto
              rotulo="Senha"
              placeholder="Digite sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={estiloInputAuth}
            />
            <CampoTexto
              rotulo="Confirmar Senha"
              placeholder="Confirme sua senha"
              secureTextEntry
              value={confirmar}
              onChangeText={setConfirmar}
              style={estiloInputAuth}
            />

            <BotaoPrimario
              titulo="Criar conta"
              aoPressionar={criarConta}
              carregando={salvando}
              estiloExtra={estilos.botaoCriar}
            />

            <TouchableOpacity
              style={estilos.linkEntrar}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={estilos.link}>Já tem conta? Entrar</Text>
            </TouchableOpacity>
          </ScrollView>

          <BarraNavegacaoAuth rotaAtiva="cadastro" navigation={navigation} />
        </View>
      </KeyboardAvoidingView>

      <Modal visible={modalOk} transparent animationType="fade">
        <View style={estilosModal.fundo}>
          <View style={estilosModal.cartao}>
            <View style={estilosModal.iconeWrap}>
              <View style={estilosModal.iconeCirculo}>
                <Ionicons name="checkmark" size={36} color="#fff" />
              </View>
            </View>
            <Text style={estilosModal.titulo}>Cadastro realizado!</Text>
            <Text style={estilosModal.texto}>
              Sua conta foi criada com sucesso. Agora você já pode acessar o app.
            </Text>
            <BotaoPrimario
              titulo="Entrar agora →"
              aoPressionar={() => {
                setModalOk(false);
                navigation.navigate('Login');
              }}
            />
            <TouchableOpacity
              style={estilosModal.voltar}
              onPress={() => setModalOk(false)}
            >
              <Text style={estilosModal.voltarTexto}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundo },
  flex: { flex: 1 },
  rolagem: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 28,
  },
  voltar: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  logoWrap: { marginBottom: 8 },
  cabecalhoForm: {
    marginBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: tema.texto,
    textAlign: 'center',
  },
  sub: {
    marginTop: 10,
    color: tema.textoSecundario,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  botaoCriar: { marginTop: 8, borderRadius: 12 },
  linkEntrar: { marginTop: 28, alignItems: 'center', paddingBottom: 8 },
  link: { color: tema.azulPrimario, fontWeight: '600', fontSize: 15 },
});

const estilosModal = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  iconeWrap: { marginBottom: 12 },
  iconeCirculo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: tema.azulPrimario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: tema.texto,
    textAlign: 'center',
    marginBottom: 10,
  },
  texto: {
    fontSize: 15,
    color: tema.textoSecundario,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  voltar: { marginTop: 12, padding: 8 },
  voltarTexto: { color: tema.textoSecundario, fontWeight: '600', fontSize: 15 },
});
