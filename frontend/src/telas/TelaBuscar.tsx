import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';

export function TelaBuscar() {
  return (
    <SafeAreaView style={estilos.safe}>
      <Text style={estilos.titulo}>Buscar</Text>
      <View style={estilos.busca}>
        <Ionicons name="search" size={22} color={tema.textoSecundario} />
        <TextInput
          placeholder="Oficinas, serviços..."
          placeholderTextColor={tema.textoMuted}
          style={estilos.input}
        />
      </View>
      <Text style={estilos.ajuda}>Ainda em desenvolvimento 1.0 FLUXCARR</Text>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundo, padding: 20 },
  titulo: { fontSize: 22, fontWeight: '800', color: tema.texto, marginBottom: 16 },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: tema.fundoInput,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 15, color: tema.texto },
  ajuda: { marginTop: 20, color: tema.textoSecundario, lineHeight: 22 },
});
