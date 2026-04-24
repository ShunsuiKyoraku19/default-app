import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { tema } from '../estilos/tema';

type Props = {
  titulo: string;
  aoPressionar: () => void;
  variante?: 'preenchido' | 'borda';
  desabilitado?: boolean;
  carregando?: boolean;
  estiloExtra?: StyleProp<ViewStyle>;
};

export function BotaoPrimario({
  titulo,
  aoPressionar,
  variante = 'preenchido',
  desabilitado,
  carregando,
  estiloExtra,
}: Props) {
  const ehBorda = variante === 'borda';
  return (
    <TouchableOpacity
      style={[
        estilos.base,
        ehBorda ? estilos.borda : estilos.preenchido,
        (desabilitado || carregando) && estilos.desabilitado,
        estiloExtra,
      ]}
      onPress={aoPressionar}
      disabled={desabilitado || carregando}
      activeOpacity={0.85}
    >
      {carregando ? (
        <ActivityIndicator color={ehBorda ? tema.azulPrimario : '#fff'} />
      ) : (
        <Text style={[estilos.texto, ehBorda && estilos.textoBorda]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  base: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preenchido: {
    backgroundColor: tema.azulPrimario,
  },
  borda: {
    backgroundColor: tema.fundo,
    borderWidth: 2,
    borderColor: tema.azulPrimario,
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  textoBorda: {
    color: tema.azulPrimario,
  },
  desabilitado: {
    opacity: 0.55,
  },
});
