import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { inicializarBanco } from './src/banco/inicializarBanco';
import { ProvedorAutenticacao } from './src/contexto/ContextoAutenticacao';
import { NavegacaoRaiz } from './src/navegacao/NavegacaoRaiz';
import { tema } from './src/estilos/tema';

export default function App() {
  const [bancoOk, setBancoOk] = useState(false);
  const [erroBanco, setErroBanco] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        await inicializarBanco();
        setErroBanco(null);
        setBancoOk(true);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('[FLUXCARR] Falha ao inicializar SQLite:', e);
        setErroBanco(msg);
      }
    })();
  }, []);

  if (erroBanco) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backgroundColor: tema.fundo,
        }}
      >
        <Text style={{ color: tema.vermelho, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>
          Erro ao preparar o banco de dados
        </Text>
        <Text style={{ color: tema.textoSecundario, textAlign: 'center', fontSize: 14 }}>{erroBanco}</Text>
        <Text style={{ color: tema.textoMuted, marginTop: 20, textAlign: 'center', fontSize: 12 }}>
          Feche o app, limpe dados do Expo Go ou reinstale o build e tente de novo. Se persistir, copie a mensagem acima.
        </Text>
      </View>
    );
  }

  if (!bancoOk) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tema.fundo }}>
        <ActivityIndicator size="large" color={tema.azulPrimario} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ProvedorAutenticacao>
        <NavigationContainer>
          <StatusBar style="dark" />
          <NavegacaoRaiz />
        </NavigationContainer>
      </ProvedorAutenticacao>
    </SafeAreaProvider>
  );
}
