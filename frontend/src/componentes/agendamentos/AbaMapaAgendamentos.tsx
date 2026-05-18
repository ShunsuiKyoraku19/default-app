import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { tema } from '../../estilos/tema';

const mapaFake = require('../../../assets/mapa-google.png');

export type OficinaMapaCard = {
  id: string;
  nome: string;
  clientesDistancia: string;
  nota: string;
  tags: string[];
  horarioAbertura: string;
  confiavel?: boolean;
  marcador: { leftPct: number; topPct: number };
};

const OFICINAS_MAPA: OficinaMapaCard[] = [
  {
    id: 'mapa-carro-top',
    nome: 'Carro top',
    clientesDistancia: '1.2 Clientes',
    nota: '4.8',
    tags: ['Baterias', 'Motor', 'Lanternagem'],
    horarioAbertura: 'Aberto, 08:00 horas',
    confiavel: true,
    marcador: { leftPct: 0.28, topPct: 0.38 },
  },
  {
    id: 'mapa-moto',
    nome: 'Moto',
    clientesDistancia: '2.4 clientes',
    nota: '4.6',
    tags: ['alguma coisa', 'Repara moto'],
    horarioAbertura: 'Aberto, 9:00 horas',
    marcador: { leftPct: 0.62, topPct: 0.22 },
  },
];

type Props = {
  paddingInferior: number;
  onVerMais?: (oficinaId: string) => void;
};

export function AbaMapaAgendamentos({ paddingInferior, onVerMais }: Props) {
  const { width: larguraTela } = useWindowDimensions();
  const larguraCard = Math.min(320, larguraTela - 48);

  return (
    <View style={[estilos.wrap, { paddingBottom: paddingInferior }]}>
      <ImageBackground
        source={mapaFake}
        style={estilos.mapaArea}
        imageStyle={estilos.mapaImagem}
        resizeMode="cover"
      >
        {OFICINAS_MAPA.map((o) => (
          <View
            key={o.id}
            pointerEvents="none"
            style={[
              estilos.marcadorWrap,
              { left: `${o.marcador.leftPct * 100}%`, top: `${o.marcador.topPct * 100}%` },
            ]}
          >
            <View style={estilos.marcadorLabel}>
              <Text style={estilos.marcadorLabelTxt} numberOfLines={1}>
                {o.nome}
              </Text>
            </View>
            <View style={estilos.marcadorIcone}>
              <MaterialCommunityIcons name="hammer-wrench" size={18} color="#fff" />
            </View>
          </View>
        ))}

        <View style={estilos.controlesCol}>
          <View style={estilos.zoomBox}>
            <Pressable style={estilos.zoomBtn} accessibilityLabel="Aumentar zoom">
              <Ionicons name="add" size={18} color={tema.texto} />
            </Pressable>
            <View style={estilos.zoomDivisor} />
            <Pressable style={estilos.zoomBtn} accessibilityLabel="Diminuir zoom">
              <Ionicons name="remove" size={18} color={tema.texto} />
            </Pressable>
          </View>
          <Pressable style={estilos.localBtn} accessibilityLabel="Minha localização">
            <Ionicons name="navigate" size={20} color={tema.azulPrimario} />
          </Pressable>
        </View>

        <View style={estilos.cardsFlutuantes} pointerEvents="box-none">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={larguraCard + 12}
            contentContainerStyle={estilos.cardsScroll}
          >
            {OFICINAS_MAPA.map((o) => (
              <CardOficinaMapa
                key={o.id}
                oficina={o}
                largura={larguraCard}
                onVerMais={onVerMais != null ? () => onVerMais(o.id) : undefined}
              />
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

function CardOficinaMapa({
  oficina,
  largura,
  onVerMais,
}: {
  oficina: OficinaMapaCard;
  largura: number;
  onVerMais?: () => void;
}) {
  return (
    <View style={[estilos.card, { width: largura }]}>
      <View style={estilos.cardTopo}>
        <View style={estilos.cardTituloCol}>
          <Text style={estilos.cardNome}>{oficina.nome}</Text>
          <View style={estilos.cardMetaRow}>
            <Text style={estilos.cardMeta}>
              {oficina.clientesDistancia} • {oficina.nota}{' '}
            </Text>
            <MaterialCommunityIcons name="star" size={12} color="#9A4100" />
          </View>
        </View>
        {oficina.confiavel ? (
          <View style={estilos.badgeConfiavel}>
            <MaterialCommunityIcons name="check-decagram" size={12} color={tema.azulPrimario} />
            <Text style={estilos.badgeConfiavelTxt}>Confiável</Text>
          </View>
        ) : null}
      </View>

      <View style={estilos.tagsRow}>
        {oficina.tags.map((t) => (
          <View key={t} style={estilos.tag}>
            <Text style={estilos.tagTxt} numberOfLines={1}>
              {t}
            </Text>
          </View>
        ))}
      </View>

      <View style={estilos.cardDivisor} />

      <View style={estilos.cardRodape}>
        <View style={estilos.funcCol}>
          <Text style={estilos.funcLabel}>FUNCIONAMENTO</Text>
          <Text style={estilos.funcValor}>{oficina.horarioAbertura}</Text>
        </View>
        <Pressable
          style={estilos.btnVerMais}
          onPress={onVerMais}
          disabled={onVerMais == null}
          accessibilityRole="button"
          accessibilityLabel={`Ver mais sobre ${oficina.nome}`}
        >
          <Text style={estilos.btnVerMaisTxt}>Ver mais</Text>
          <Ionicons name="chevron-forward" size={14} color={tema.azulEscuro} />
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  wrap: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
  },
  mapaArea: {
    flex: 1,
    minHeight: 320,
    borderRadius: 10,
    overflow: 'visible',
    position: 'relative',
  },
  mapaImagem: {
    borderRadius: 10,
  },
  marcadorWrap: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -40 }, { translateY: -48 }],
    width: 80,
  },
  marcadorLabel: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 100,
  },
  marcadorLabelTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: tema.texto,
    textAlign: 'center',
  },
  marcadorIcone: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: tema.azulPrimario,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  controlesCol: {
    position: 'absolute',
    right: 12,
    top: 16,
    gap: 10,
    alignItems: 'center',
  },
  zoomBox: {
    backgroundColor: 'rgba(252, 248, 251, 0.95)',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#1B1B1D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
  },
  zoomBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivisor: {
    height: 1,
    backgroundColor: 'rgba(192, 198, 214, 0.20)',
  },
  localBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(252, 248, 251, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B1B1D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
  },
  cardsFlutuantes: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -32,
  },
  cardsScroll: {
    paddingHorizontal: 12,
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(252, 248, 251, 0.98)',
    borderRadius: 8,
    padding: 20,
    gap: 16,
    shadowColor: '#1B1B1D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
    marginRight: 12,
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTituloCol: { flex: 1, minWidth: 0, gap: 4 },
  cardNome: {
    fontSize: 18,
    lineHeight: 22.5,
    fontWeight: '700',
    color: tema.texto,
  },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center' },
  cardMeta: {
    fontSize: 14,
    lineHeight: 22.75,
    fontWeight: '400',
    color: '#414754',
  },
  badgeConfiavel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(166, 196, 253, 0.30)',
    borderRadius: 2,
  },
  badgeConfiavelTxt: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: tema.azulPrimario,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EAE7EA',
    borderRadius: 2,
  },
  tagTxt: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: '#414754',
  },
  cardDivisor: {
    height: 1,
    backgroundColor: 'rgba(192, 198, 214, 0.15)',
  },
  cardRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 4,
  },
  funcCol: { flex: 1, minWidth: 0, gap: 2 },
  funcLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: '#414754',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  funcValor: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: tema.azulPrimario,
  },
  btnVerMais: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EAE7EA',
    borderRadius: 4,
    minHeight: 36,
  },
  btnVerMaisTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: tema.azulEscuro,
  },
});
