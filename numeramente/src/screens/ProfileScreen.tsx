import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  useWindowDimensions,
  StyleSheet,
  Button,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

/* ---------- Cores ---------- */
const INK = '#0f1b2d';
const BLUE = '#5070f8';
const BG = '#eaf3ff';
const PANEL = '#c9d8fb';
const PANEL_BORDA = '#0f22a8';
const MARCADO = '#a9bcf8';
const CINZA = '#9aa7c7';
const LARANJA = '#f5b04c';
const LARANJA_ESCURO = '#d98a2b';
const VERMELHO = '#c62828';

/* ---------- Mock: Janeiro de 2026 ---------- */
const ANO = 2026;
const MES = 0; // janeiro
const DIAS_SEQUENCIA = [1, 2, 3, 4, 5, 6]; // dias com estrela
const SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

type Celula = { dia: number; doMes: boolean };

// Monta 6 semanas (42 células), completando com dias do mês anterior e do seguinte
function montarCalendario(): Celula[] {
  const primeiroDiaSemana = new Date(ANO, MES, 1).getDay();
  const diasNoMes = new Date(ANO, MES + 1, 0).getDate();
  const diasMesAnterior = new Date(ANO, MES, 0).getDate();

  const celulas: Celula[] = [];
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    celulas.push({ dia: diasMesAnterior - i, doMes: false });
  }
  for (let d = 1; d <= diasNoMes; d++) celulas.push({ dia: d, doMes: true });
  let proximo = 1;
  while (celulas.length < 42) celulas.push({ dia: proximo++, doMes: false });
  return celulas;
}

const CELULAS = montarCalendario();

/* ---------- Estrela com contorno ---------- */
function Estrela({ tamanho = 22 }: { tamanho?: number }) {
  return (
    <View style={{ width: tamanho, height: tamanho }}>
      <MaterialCommunityIcons
        name="star-four-points"
        size={tamanho}
        color={INK}
        style={StyleSheet.absoluteFill}
      />
      <MaterialCommunityIcons
        name="star-four-points"
        size={tamanho - 6}
        color={LARANJA}
        style={{ position: 'absolute', left: 3, top: 3 }}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, padding: 24, gap: 8 }}>
      <Text style={{ fontSize: 20 }}>{user?.nome}</Text>
      <Text>{user?.email}</Text>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
}