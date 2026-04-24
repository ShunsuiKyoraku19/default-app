import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { tema } from '../estilos/tema';

type Props = TextInputProps & {
  rotulo: string;
};

export function CampoTexto({ rotulo, style, ...rest }: Props) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        placeholderTextColor={tema.textoMuted}
        style={[estilos.input, style]}
        {...rest}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: tema.texto,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: tema.fundoInput,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: tema.texto,
  },
});
