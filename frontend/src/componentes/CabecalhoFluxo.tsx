import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tema } from '../estilos/tema';
import { useAutenticacao } from '../contexto/ContextoAutenticacao';

const figma = {
  azul: '#1E6FD9',
  texto: '#1C1C1C',
};

type Props = {
  titulo: string;
  mostrarVoltar?: boolean;
  aoVoltar?: () => void;
  mostrarAvatar?: boolean;
  tituloAoLadoDoVoltar?: boolean;
  varianteFigmaGerenciar?: boolean;
};

export function CabecalhoFluxo({
  titulo,
  mostrarVoltar = true,
  aoVoltar,
  mostrarAvatar = true,
  tituloAoLadoDoVoltar = false,
  varianteFigmaGerenciar = false,
}: Props) {
  const { usuario } = useAutenticacao();
  const inicial = usuario?.nome?.charAt(0)?.toUpperCase() ?? '?';

  if (tituloAoLadoDoVoltar && mostrarVoltar) {
    const f = varianteFigmaGerenciar;
    return (
      <View style={[estilos.linha, f && estilos.linhaFigmaGerenciar]}>
        <View style={[estilos.linhaTituloEsquerda, f && estilos.linhaTituloEsquerdaFigma]}>
          <TouchableOpacity
            onPress={aoVoltar}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            accessibilityRole="button"
            accessibilityLabel="Voltar para o início"
          >
            <Ionicons name="arrow-back" size={f ? 22 : 24} color={f ? figma.azul : tema.azulPrimario} />
          </TouchableOpacity>
          <Text style={[estilos.tituloEsquerda, f && estilos.tituloEsquerdaFigma]} numberOfLines={1}>
            {titulo}
          </Text>
        </View>
        <View style={[estilos.direita, f && estilos.direitaFigma]}>
          {mostrarAvatar ? (
            <View style={[estilos.avatar, f && estilos.avatarFigma]}>
              <Text style={[estilos.avatarTexto, f && estilos.avatarTextoFigma]}>{inicial}</Text>
            </View>
          ) : (
            <View style={{ width: 36 }} />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={estilos.linha}>
      <View style={estilos.esquerda}>
        {mostrarVoltar ? (
          <TouchableOpacity
            onPress={aoVoltar}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={24} color={tema.azulPrimario} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>
      <Text style={estilos.titulo} numberOfLines={1}>
        {titulo}
      </Text>
      <View style={estilos.direita}>
        {mostrarAvatar ? (
          <View style={estilos.avatar}>
            <Text style={estilos.avatarTexto}>{inicial}</Text>
          </View>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>
    </View>
  );
}

function IconeMarcaFluxcarr() {
  return (
    <View style={estilosLogo.iconeChave} accessibilityLabel="Marca FLUXCARR">
      <MaterialCommunityIcons name="wrench" size={28} color={tema.azulPrimario} />
    </View>
  );
}

export function CabecalhoLogo() {
  return (
    <View style={estilosLogo.container}>
      <IconeMarcaFluxcarr />
      <Text style={estilosLogo.marca}>FLUXCARR</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: tema.fundo,
  },
  esquerda: {
    width: 40,
    alignItems: 'flex-start',
  },
  direita: {
    width: 40,
    alignItems: 'flex-end',
  },
  titulo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: tema.texto,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: tema.azulClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    fontWeight: '700',
    color: tema.azulEscuro,
    fontSize: 14,
  },
  linhaTituloEsquerda: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    marginRight: 8,
    gap: 6,
  },
  tituloEsquerda: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: tema.texto,
  },
  linhaFigmaGerenciar: {
    minHeight: 70,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  linhaTituloEsquerdaFigma: {
    marginRight: 10,
    gap: 8,
  },
  tituloEsquerdaFigma: {
    fontSize: 22,
    fontWeight: '700',
    color: figma.texto,
  },
  direitaFigma: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  avatarFigma: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarTextoFigma: {
    fontSize: 15,
  },
});

const estilosLogo = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  iconeChave: {
    transform: [{ rotate: '22deg' }],
    marginBottom: 2,
  },
  marca: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    color: tema.texto,
  },
});
