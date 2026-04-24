import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoPrimario } from '../componentes/BotaoPrimario';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';
import { tema } from '../estilos/tema';

export function TelaPerfil() {
  const { usuario, sair } = useAutenticacao();

  const tipoLegivel =
    usuario?.tipo === 'administrador' ? 'Administrador' : 'Cliente';

  return (
    <SafeAreaView style={estilos.safe}>
      <Text style={estilos.titulo}>Perfil</Text>
      <View style={estilos.card}>
        <Text style={estilos.rotulo}>Nome</Text>
        <Text style={estilos.valor}>{usuario?.nome}</Text>
        <Text style={[estilos.rotulo, { marginTop: 14 }]}>Email</Text>
        <Text style={estilos.valor}>{usuario?.email}</Text>
        <Text style={[estilos.rotulo, { marginTop: 14 }]}>Tipo de conta</Text>
        <Text style={estilos.valor}>{tipoLegivel}</Text>
      </View>
      <BotaoPrimario titulo="Sair" variante="borda" aoPressionar={() => void sair()} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundo, padding: 20 },
  titulo: { fontSize: 22, fontWeight: '800', color: tema.texto, marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: tema.borda,
  },
  rotulo: { fontSize: 12, fontWeight: '700', color: tema.textoMuted, textTransform: 'uppercase' },
  valor: { marginTop: 4, fontSize: 16, fontWeight: '600', color: tema.texto },
});
