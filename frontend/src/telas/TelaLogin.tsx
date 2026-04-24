import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
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
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';
import type { PilhaAutenticacaoParametros } from '../navegacao/tiposNavegacao';

type Props = NativeStackScreenProps<PilhaAutenticacaoParametros, 'Login'>;

const raioInput = 10;

export function TelaLogin({ navigation }: Props) {
  const { entrar } = useAutenticacao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoEntrar() {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }
    setEnviando(true);
    const ok = await entrar(email, senha);
    setEnviando(false);
    if (!ok) {
      Alert.alert('Login', 'Email ou senha incorretos.');
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
          <TouchableOpacity
            onPress={() => navigation.navigate('BoasVindas')}
            style={estilos.voltar}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={24} color={tema.azulPrimario} />
          </TouchableOpacity>

          <ScrollView
            style={estilos.rolagem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={estilos.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={estilos.logoWrap}>
              <CabecalhoLogo />
            </View>

            <View style={estilos.cabecalhoForm}>
              <Text style={estilos.titulo}>Entrar</Text>
              <Text style={estilos.sub}>Acesse sua conta para continuar</Text>
            </View>

            <CampoTexto
              rotulo="Email"
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={estilos.inputArredondado}
            />
            <CampoTexto
              rotulo="Senha"
              placeholder="Digite sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={estilos.inputArredondado}
            />

            <TouchableOpacity
              style={estilos.esqueci}
              onPress={() =>
                Alert.alert('Esqueci minha senha', 'Recurso apenas demonstrativo nesta versão.')
              }
            >
              <Text style={estilos.link}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <BotaoPrimario
              titulo="Entrar"
              aoPressionar={aoEntrar}
              carregando={enviando}
              estiloExtra={estilos.botaoEntrar}
            />

            <View style={estilos.rodape}>
              <Text style={estilos.textoRodape}>Ainda não tem uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                <Text style={estilos.linkGrande}>Criar conta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <BarraNavegacaoAuth rotaAtiva="login" navigation={navigation} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tema.fundo,
  },
  flex: {
    flex: 1,
  },
  rolagem: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  voltar: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 8,
  },
  logoWrap: {
    marginBottom: 8,
  },
  cabecalhoForm: {
    marginBottom: 28,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  titulo: {
    fontSize: 32,
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
  inputArredondado: {
    borderRadius: raioInput,
  },
  esqueci: {
    alignSelf: 'flex-end',
    marginBottom: 22,
    marginTop: 4,
    paddingVertical: 4,
  },
  link: {
    color: tema.azulPrimario,
    fontWeight: '600',
    fontSize: 14,
  },
  botaoEntrar: {
    borderRadius: 12,
  },
  rodape: {
    marginTop: 32,
    alignItems: 'center',
  },
  textoRodape: {
    color: tema.textoSecundario,
    fontSize: 15,
    textAlign: 'center',
  },
  linkGrande: {
    marginTop: 10,
    color: tema.azulPrimario,
    fontWeight: '800',
    fontSize: 17,
    textAlign: 'center',
  },
});
