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