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

/* ---------- Tela ---------- */
export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const { width: W } = useWindowDimensions();

  const nome = user?.nome ?? 'Lulu';
  const avatar = W * 0.3;
  const alturaTopo = W * 0.92;

  function confirmarExclusao() {
    Alert.alert(
      'Excluir conta',
      'Tem certeza? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (user) await api.delete(`/usuarios/${user.id}`);
            } catch {
              // se a API falhar, ainda assim encerra a sessão local
            }
            await signOut();
          },
        },
      ]
    );
  }


  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- Topo: arco azul + avatar + nome ---------- */}
      <View style={{ height: alturaTopo, overflow: 'hidden' }}>
        {/* arco: círculo azul com círculo claro por cima */}
        <View
          style={{
            position: 'absolute',
            left: -0.4 * W,
            top: 0.31 * W,
            width: 1.8 * W,
            height: 1.8 * W,
            borderRadius: 0.9 * W,
            backgroundColor: BLUE,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: -0.18 * W,
            top: 0.53 * W,
            width: 1.36 * W,
            height: 1.36 * W,
            borderRadius: 0.68 * W,
            backgroundColor: BG,
          }}
        />
        </View>
    </ScrollView>

  );
}


/* ---------- Estilos ---------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

});