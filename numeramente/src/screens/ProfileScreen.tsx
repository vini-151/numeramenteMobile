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
            top: 0.34 * W,
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

        {/* título + excluir conta */}
        <View style={[styles.topoLinha, { paddingTop: insets.top + 24 }]}>
          <Text style={styles.titulo}>Perfil</Text>
          <Pressable onPress={confirmarExclusao} hitSlop={8} accessibilityRole="button">
            <Text style={styles.excluir}>Excluir conta</Text>
          </Pressable>
        </View>

        {/* avatar */}
        <View style={[styles.avatarWrap, { top: insets.top + 24 + W * 0.17 }]}>
          <View
            style={{
              width: avatar,
              height: avatar,
              borderRadius: avatar * 0.38,
              backgroundColor: '#3a56d4',
              paddingBottom: 10,
            }}
          >
            <View style={[styles.avatarFace, { borderRadius: avatar * 0.38, borderWidth: 4, borderColor: BLUE }]}>
              <MaterialCommunityIcons name="account" size={avatar * 0.78} color={BLUE} />
            </View>
          </View>
          <MaterialCommunityIcons
            name="pencil"
            size={34}
            color={INK}
            style={styles.lapis}
          />
        </View>

        <Text style={[styles.nome, { top: insets.top + 24 + W * 0.17 + avatar + 24 }]}>
          {nome}
        </Text>
        </View>

              {/* ---------- Sequência ---------- */}
      <View style={styles.sequenciaLinha}>
        <Text style={styles.sequenciaTitulo}>Sua sequência</Text>
        <View style={styles.badgeBase}>
          <View style={styles.badgeFace}>
            <MaterialCommunityIcons name="star-four-points-outline" size={18} color={INK} />
            <Text style={styles.badgeTexto}>7 Dias</Text>
          </View>
        </View>
      </View>

      {/* ---------- Calendário ---------- */}
      <View style={styles.panel}>
        <View style={styles.mesLinha}>
          <Text style={styles.mesTitulo}>Janeiro 2026</Text>
          <View style={styles.setas}>
            <MaterialCommunityIcons name="chevron-left" size={30} color={INK} />
            <MaterialCommunityIcons name="chevron-right" size={30} color={INK} />
          </View>
        </View>

        <View style={styles.semanaLinha}>
          {SEMANA.map((d) => (
            <Text key={d} style={styles.semanaDia}>
              {d}
            </Text>
          ))}
        </View>
        <View style={styles.divisor} />

        <View style={styles.grade}>
          {CELULAS.map((c, i) => {
            const marcado = c.doMes && DIAS_SEQUENCIA.includes(c.dia);
            return (
              <View key={i} style={styles.celula}>
                {marcado && <View style={styles.circulo} />}
                <Text style={[styles.diaNumero, !c.doMes && styles.diaCinza]}>
                  {c.dia < 10 && c.doMes ? `0${c.dia}`.replace(/^0(?=[2-9])/, '') : c.dia}
                </Text>
                {marcado && (
                  <View style={styles.estrela}>
                    <Estrela />
                  </View>
                )}
              </View>
            );
          })}
        </View>
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

  /* topo */
  topoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

   avatarWrap: {
    position: 'absolute',
    alignSelf: 'center',
  },

  titulo: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000',
  },

  excluir: {
    fontSize: 13,
    color: VERMELHO,
    textDecorationLine: 'underline',
  },

  avatarFace: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },

  lapis: {
    position: 'absolute',
    right: -2,
    top: -10,
  },

  nome: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 34,
    fontWeight: '900',
    color: '#000',
  },


  /* sequência */
  sequenciaLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sequenciaTitulo: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  badgeBase: {
    backgroundColor: LARANJA_ESCURO,
    borderRadius: 14,
    paddingBottom: 3,
  },
  badgeFace: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: LARANJA,
    borderWidth: 1.5,
    borderColor: LARANJA_ESCURO,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeTexto: {
    fontSize: 15,
    fontWeight: '900',
    color: INK,
  },

  /* painel do calendário */
  panel: {
    backgroundColor: PANEL,
    borderWidth: 2,
    borderColor: PANEL_BORDA,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
  },
  
  mesLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  mesTitulo: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },

  setas: {
    flexDirection: 'row',
    gap: 10,
  },

  semanaLinha: {
    flexDirection: 'row',
  },

  semanaDia: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    color: INK,
  },

  divisor: {
    height: 2,
    backgroundColor: '#aebffa',
    marginTop: 10,
    marginBottom: 8,
  },

  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  celula: {
    width: `${100 / 7}%`,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circulo: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: MARCADO,
  },

  diaNumero: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },

  diaCinza: {
    color: CINZA,
  },

  estrela: {
    position: 'absolute',
    top: 2,
    right: 0,
  },
});