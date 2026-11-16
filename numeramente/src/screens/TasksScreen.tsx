import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ImageSourcePropType,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/* ---------- Cores ---------- */
const INK = '#0f1b2d';
const BG = '#eaf3ff';
const BORDA = '#2a35b8'; // borda azul-escura dos balões
const SOMBRA = '#b9c6f0'; // "sombra" 3D dos balões
const VERDE_TEXTO = '#2f6e3e';

/* ---------- Imagens ---------- */
const GATO_AVATAR = require('../../assets/images/gato.png'); // rosto do gato de óculos

type Op = {
  label: string;
  icone: ImageSourcePropType;
  aspect: number; // largura / altura da imagem original
  larguraIcone: number; // largura do ícone em px (versão mini)
  face: string;
  borda: string;
};

const OPS: Op[] = [
  { label: 'Adição', icone: require('../../assets/images/icone-adicao.png'), aspect: 110 / 104, larguraIcone: 22, face: '#67c365', borda: '#2f6e3e' },
  { label: 'Subtração', icone: require('../../assets/images/icone-subtracao.png'), aspect: 155 / 55, larguraIcone: 32, face: '#eea84b', borda: '#a22e4a' },
  { label: 'Multiplicação', icone: require('../../assets/images/icone-multiplicacao.png'), aspect: 107 / 108, larguraIcone: 22, face: '#a255d0', borda: '#4f1a7a' },
  { label: 'Divisão', icone: require('../../assets/images/icone-divisao.png'), aspect: 120 / 105, larguraIcone: 24, face: '#ea6e6a', borda: '#a02b45' },
];

/* ---------- Botão mini de operação (dentro do balão) ---------- */
function OpMini({ op, largura }: { op: Op; largura?: number | `${number}%` }) {
  return (
    <View style={[styles.opBase, { backgroundColor: op.borda, width: largura }]}>
      <View style={[styles.opFace, { backgroundColor: op.face, borderColor: op.borda }]}>
        <View style={styles.opIconArea}>
          <Image
            source={op.icone}
            style={{ width: op.larguraIcone, height: op.larguraIcone / op.aspect }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.opLabel} numberOfLines={1}>
          {op.label}
        </Text>
      </View>
    </View>
  );
}

/* ---------- Tela ---------- */
export default function TasksScreen() {


  return (
    <View >

    </View>
  );
}

/* ---------- Estilos ---------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 28,
  },

  /* botão mini 3D */
  opBase: {
    borderRadius: 12,
    paddingBottom: 5,
  },

  opFace: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },

  opIconArea: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  opLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
});
