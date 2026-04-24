import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';

type Props = {
  visivel: boolean;
  aoFechar: () => void;
  aoConfirmar: () => void;
};

export function ModalConfirmarExclusao({ visivel, aoFechar, aoConfirmar }: Props) {
  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={estilos.fundo}>
        <View style={estilos.cartao}>
          <View style={estilos.icone}>
            <Ionicons name="warning" size={36} color={tema.vermelho} />
          </View>
          <Text style={estilos.titulo}>Excluir notícia?</Text>
          <Text style={estilos.texto}>
            Tem certeza que deseja excluir esta notícia? Essa ação não poderá ser desfeita.
          </Text>
          <TouchableOpacity style={estilos.btnExcluir} onPress={aoConfirmar}>
            <Text style={estilos.btnExcluirTxt}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.btnCancelar} onPress={aoFechar}>
            <Text style={estilos.btnCancelarTxt}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={estilos.rodape}>
            LEMBRANDO QUE SERÁ DELETADA PERMANENTEMENTE
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  icone: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: tema.vermelhoClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: { fontSize: 20, fontWeight: '800', color: tema.texto, marginBottom: 10 },
  texto: {
    textAlign: 'center',
    color: tema.textoSecundario,
    lineHeight: 22,
    marginBottom: 20,
  },
  btnExcluir: {
    width: '100%',
    backgroundColor: tema.vermelho,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnExcluirTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  btnCancelar: {
    width: '100%',
    backgroundColor: tema.fundoInput,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnCancelarTxt: { color: tema.texto, fontWeight: '700', fontSize: 16 },
  rodape: {
    marginTop: 16,
    fontSize: 10,
    color: tema.textoMuted,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
