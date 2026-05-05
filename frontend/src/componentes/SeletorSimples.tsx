import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';

export type OpcaoSeletor = { id: number; label: string };

type Props = {
  rotulo: string;
  placeholder: string;
  opcoes: OpcaoSeletor[];
  valorSelecionadoId: number | null;
  onChange: (id: number) => void;
  desabilitado?: boolean;
};

export function SeletorSimples({
  rotulo,
  placeholder,
  opcoes,
  valorSelecionadoId,
  onChange,
  desabilitado,
}: Props) {
  const [aberto, setAberto] = useState(false);

  const textoExibicao = useMemo(() => {
    if (valorSelecionadoId == null) return placeholder;
    const op = opcoes.find((o) => o.id === valorSelecionadoId);
    return op?.label ?? placeholder;
  }, [valorSelecionadoId, opcoes, placeholder]);

  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TouchableOpacity
        style={[estilos.campo, desabilitado && estilos.campoOff]}
        onPress={() => !desabilitado && setAberto(true)}
        disabled={desabilitado}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={rotulo}
      >
        <Text
          style={[
            estilos.campoTexto,
            valorSelecionadoId == null && estilos.campoPlaceholder,
          ]}
          numberOfLines={1}
        >
          {textoExibicao}
        </Text>
        <Ionicons name="chevron-down" size={20} color={tema.textoSecundario} />
      </TouchableOpacity>

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <Pressable style={estilos.modalFundo} onPress={() => setAberto(false)}>
          <Pressable style={estilos.modalCartao} onPress={(e) => e.stopPropagation()}>
            <Text style={estilos.modalTitulo}>{rotulo}</Text>
            <FlatList
              data={opcoes}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={estilos.itemLista}
                  onPress={() => {
                    onChange(item.id);
                    setAberto(false);
                  }}
                >
                  <Text style={estilos.itemTexto}>{item.label}</Text>
                  {valorSelecionadoId === item.id ? (
                    <Ionicons name="checkmark" size={20} color={tema.azulPrimario} />
                  ) : null}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={estilos.fechar} onPress={() => setAberto(false)}>
              <Text style={estilos.fecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { marginBottom: 16 },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: tema.texto,
    marginBottom: 8,
    marginLeft: 4,
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tema.fundoInput,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  campoOff: { opacity: 0.5 },
  campoTexto: { flex: 1, fontSize: 16, color: tema.texto, marginRight: 8 },
  campoPlaceholder: { color: tema.textoMuted },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCartao: {
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  modalTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: tema.texto,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  itemLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tema.borda,
  },
  itemTexto: { fontSize: 16, color: tema.texto, flex: 1, marginRight: 8 },
  fechar: { paddingVertical: 14, alignItems: 'center' },
  fecharTexto: { fontSize: 16, fontWeight: '600', color: tema.azulPrimario },
});
