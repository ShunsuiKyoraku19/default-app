import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tema } from '../estilos/tema';

type Item = {
  id: string;
  servico: string;
  oficina: string;
  data: string;
  horario: string;
  status: string;
};

const DADOS: Item[] = [
  {
    id: '1',
    servico: 'Troca de óleo',
    oficina: 'Mecânica Seu Zé',
    data: '28/04/2026',
    horario: '09:30',
    status: 'Confirmado',
  },
  {
    id: '2',
    servico: 'Alinhamento',
    oficina: 'Pneus DF Service',
    data: '02/05/2026',
    horario: '14:00',
    status: 'Pendente',
  },
  {
    id: '3',
    servico: 'Revisão básica',
    oficina: 'Auto Elite Premium',
    data: '10/05/2026',
    horario: '11:15',
    status: 'Cancelado',
  },
];

export function TelaAgendamentos() {
  return (
    <SafeAreaView style={estilos.safe}>
      <Text style={estilos.titulo}>Agendamentos</Text>
      <FlatList
        data={DADOS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={estilos.card}>
            <Text style={estilos.servico}>{item.servico}</Text>
            <Text style={estilos.oficina}>{item.oficina}</Text>
            <View style={estilos.linha}>
              <Text style={estilos.meta}>
                {item.data} • {item.horario}
              </Text>
              <View style={estilos.pill}>
                <Text style={estilos.pillTexto}>{item.status}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tema.fundo, paddingHorizontal: 20 },
  titulo: { fontSize: 22, fontWeight: '800', color: tema.texto, marginVertical: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: tema.borda,
  },
  servico: { fontSize: 16, fontWeight: '800', color: tema.texto },
  oficina: { marginTop: 4, color: tema.textoSecundario, fontSize: 14 },
  linha: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: { color: tema.textoMuted, fontSize: 13 },
  pill: {
    backgroundColor: tema.azulClaro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillTexto: { fontSize: 12, fontWeight: '700', color: tema.azulEscuro },
});
