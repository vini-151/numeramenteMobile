import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, OperationId } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OperationDetail'>;

/* ---------- Cores ---------- */
const INK = '#0f1b2d';
const BLUE = '#3d5afe';
const BG = '#eaf3ff';
const PANEL_BLUE = '#5070f8';

/* ---------- Imagem do novelo (ajuste o nome do arquivo) ---------- */
const NOVELO = require('../../assets/images/novelo.png');

/* ---------- Configuração por operação (mesmas cores do OperationsScreen) ---------- */
const CONFIG: Record<
  OperationId,
  { label: string; simbolo: string; face: string; borda: string }
> = {
  adicao: { label: 'Adição', simbolo: '+', face: '#67c365', borda: '#2f6e3e' },
  subtracao: { label: 'Subtração', simbolo: '−', face: '#eea84b', borda: '#a22e4a' },
  multiplicacao: { label: 'Multiplicação', simbolo: '×', face: '#a255d0', borda: '#4f1a7a' },
  divisao: { label: 'Divisão', simbolo: '÷', face: '#ea6e6a', borda: '#a02b45' },
};

const MAX = 10;
const POR_LINHA = 5;

type Resultado = { valor: number; resto?: number };

/* ---------- Novelos: linhas de 5 ---------- */
function Novelos({ quantidade, tamanho }: { quantidade: number; tamanho: number }) {
  const linhas: number[] = [];
  for (let i = 0; i < quantidade; i += POR_LINHA) {
    linhas.push(Math.min(POR_LINHA, quantidade - i));
  }

  return (
    <View>
      {linhas.map((qtd, i) => (
        <View key={i} style={{ flexDirection: 'row' }}>
          {Array.from({ length: qtd }).map((_, j) => (
            <Image
              key={j}
              source={NOVELO}
              style={{ width: tamanho, height: tamanho }}
              resizeMode="contain"
            />
          ))}
        </View>
      ))}
    </View>
  );
}