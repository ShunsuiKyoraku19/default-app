import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  /** Gradiente horizontal #005AB3 → #0073E0 (apenas variante preenchido). */
  gradiente?: boolean;
  /** Cor do texto na variante borda (opcional). */
  corTextoBorda?: string;
};

export function BotaoPrimario({
  titulo,
  aoPressionar,
  variante = 'preenchido',
  desabilitado,
  carregando,
  estiloExtra,
  gradiente,
  corTextoBorda,
}: Props) {
  const ehBorda = variante === 'borda';
  const comGradiente = Boolean(gradiente) && !ehBorda;
  return (
    <TouchableOpacity
      style={[
        estilos.base,
        comGradiente && estilos.baseGradiente,
        ehBorda ? estilos.borda : !comGradiente && estilos.preenchido,
        (desabilitado || carregando) && estilos.desabilitado,
        estiloExtra,
      ]}
      onPress={aoPressionar}
      disabled={desabilitado || carregando}
      activeOpacity={0.85}
    >
      {carregando ? (
        <ActivityIndicator color={ehBorda ? tema.azulPrimario : '#fff'} />
      ) : comGradiente ? (
        <View style={estilos.gradienteWrap}>
          <View style={estilos.gradienteFaixas}>
            <View style={[estilos.gradienteMetade, { backgroundColor: '#005AB3' }]} />
            <View style={[estilos.gradienteMetade, { backgroundColor: '#0073E0' }]} />
          </View>
          <Text style={[estilos.texto, estilos.textoSobreGradiente]}>{titulo}</Text>
        </View>
      ) : (
        <Text
          style={[
            estilos.texto,
            ehBorda && estilos.textoBorda,
            ehBorda && corTextoBorda != null && { color: corTextoBorda },
          ]}
        >
          {titulo}
        </Text>
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
  baseGradiente: {
    paddingVertical: 0,
    backgroundColor: 'transparent',
    minHeight: 56,
    borderRadius: 8,
  },
  gradienteWrap: {
    width: '100%',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradienteFaixas: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradienteMetade: {
    flex: 1,
  },
  textoSobreGradiente: {
    zIndex: 1,
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
