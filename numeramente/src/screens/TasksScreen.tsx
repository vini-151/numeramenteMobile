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

/* ---------- Imagens (ajuste os nomes se necessário) ---------- */
const GATO_AVATAR = require('../../assets/images/gato.png'); // rosto do gato de óculos

type Op = {
  label: string;
  icone: ImageSourcePropType;
  aspect: number; // largura / altura da imagem original
  larguraIcone: number; // largura do ícone em px (versão mini)
  face: string;
  borda: string;
};



/* ---------- Tela ---------- */
export default function TasksScreen() {


  return (
    <View >

    </View>
  );
}

