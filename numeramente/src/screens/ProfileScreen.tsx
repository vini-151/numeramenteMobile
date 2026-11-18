
import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { buscarStreak, StreakInfo } from '../services/streak';
import { dataLocal } from '../utils/data';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
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

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

type Celula = { dia: number; doMes: boolean; chave: string };

// 6 semanas (42 células) começando no domingo da semana do dia 1
function montarCalendario(ano: number, mes: number): Celula[] {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const celulas: Celula[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(ano, mes, 1 - primeiroDiaSemana + i);
    celulas.push({ dia: d.getDate(), doMes: d.getMonth() === mes, chave: dataLocal(d) });
  }
  return celulas;
}

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
  const { user, signOut, atualizarNome } = useAuth();
  const insets = useSafeAreaInsets();
  const { width: W } = useWindowDimensions();

  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [streak, setStreak] = useState<StreakInfo | null>(null);

  // edição do nome
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Recarrega sempre que a aba de Perfil ganha foco
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      buscarStreak(user.id).then(setStreak).catch((e) => console.log('Erro streak:', e?.message));
    }, [user?.id])
  );

  const celulas = useMemo(() => montarCalendario(ano, mes), [ano, mes]);
  const diasMarcados = useMemo(() => new Set(streak?.dias ?? []), [streak]);
  const totalDias = streak?.streak_atual ?? 0;

  function mudarMes(delta: number) {
    const d = new Date(ano, mes + delta, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth());
  }

  const nome = user?.nome ?? 'Lulu';
  const avatar = W * 0.3;
  const alturaTopo = W * 0.92;

  function abrirEdicao() {
    setNovoNome(user?.nome ?? '');
    setErroNome('');
    setEditando(true);
  }

  function fecharEdicao() {
    if (salvando) return;
    setEditando(false);
  }

  async function salvarNome() {
    const limpo = novoNome.trim();
    if (!limpo) {
      setErroNome('O nome não pode ficar vazio.');
      return;
    }
    if (limpo === user?.nome) {
      setEditando(false);
      return;
    }

    setSalvando(true);
    setErroNome('');
    try {
      await atualizarNome(limpo);
      setEditando(false);
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      setErroNome(
        typeof detail === 'string' ? detail : 'Não foi possível salvar. Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  }

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
    <>
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
              <View
                style={[
                  styles.avatarFace,
                  { borderRadius: avatar * 0.38, borderWidth: 4, borderColor: BLUE },
                ]}
              >
                <MaterialCommunityIcons name="account" size={avatar * 0.78} color={BLUE} />
              </View>
            </View>

            {/* lápis: abre a edição do nome */}
            <Pressable
              onPress={abrirEdicao}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Editar nome"
              style={styles.lapis}
            >
              <MaterialCommunityIcons name="pencil" size={34} color={INK} />
            </Pressable>
          </View>

          <Pressable
            onPress={abrirEdicao}
            accessibilityRole="button"
            accessibilityLabel="Editar nome"
            style={[styles.nome, { top: insets.top + 24 + W * 0.17 + avatar + 24 }]}
          >
            <Text style={styles.nomeTexto} numberOfLines={1}>
              {nome}
            </Text>
          </Pressable>
        </View>

        {/* ---------- Sequência ---------- */}
        <View style={styles.sequenciaLinha}>
          <Text style={styles.sequenciaTitulo}>Sua sequência</Text>
          <View style={styles.badgeBase}>
            <View style={styles.badgeFace}>
              <MaterialCommunityIcons name="star-four-points-outline" size={18} color={INK} />
              <Text style={styles.badgeTexto}>
                {totalDias} {totalDias === 1 ? 'Dia' : 'Dias'}
              </Text>
            </View>
          </View>
        </View>

        {/* ---------- Calendário ---------- */}
        <View style={styles.panel}>
          <View style={styles.mesLinha}>
            <Text style={styles.mesTitulo}>
              {MESES[mes]} {ano}
            </Text>
            <View style={styles.setas}>
              <Pressable onPress={() => mudarMes(-1)} hitSlop={8} accessibilityLabel="Mês anterior">
                <MaterialCommunityIcons name="chevron-left" size={30} color={INK} />
              </Pressable>
              <Pressable onPress={() => mudarMes(1)} hitSlop={8} accessibilityLabel="Próximo mês">
                <MaterialCommunityIcons name="chevron-right" size={30} color={INK} />
              </Pressable>
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
            {celulas.map((c, i) => {
              const marcado = diasMarcados.has(c.chave);
              return (
                <View key={i} style={styles.celula}>
                  {marcado && <View style={styles.circulo} />}
                  <Text style={[styles.diaNumero, !c.doMes && styles.diaCinza]}>{c.dia}</Text>
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

      {/* ---------- Modal: editar nome ---------- */}
      <Modal
        visible={editando}
        transparent
        animationType="fade"
        onRequestClose={fecharEdicao}
      >
        <KeyboardAvoidingView
          style={styles.modalFundo}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={fecharEdicao} />

          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>Editar nome</Text>

            <TextInput
              style={styles.modalInput}
              value={novoNome}
              onChangeText={(t) => {
                setNovoNome(t);
                setErroNome('');
              }}
              placeholder="Digite seu nome"
              placeholderTextColor="#8a94a3"
              autoFocus
              maxLength={40}
              editable={!salvando}
              returnKeyType="done"
              onSubmitEditing={salvarNome}
              autoComplete="name"
            />

            {!!erroNome && (
              <Text style={styles.modalErro} accessibilityRole="alert">
                {erroNome}
              </Text>
            )}

            <View style={styles.modalBotoes}>
              <Pressable
                onPress={fecharEdicao}
                disabled={salvando}
                accessibilityRole="button"
                style={styles.modalCancelar}
              >
                <Text style={styles.modalCancelarTexto}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={salvarNome}
                disabled={salvando}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.salvarBase,
                  (pressed || salvando) && styles.salvarBasePressed,
                ]}
              >
                <View style={styles.salvarFace}>
                  {salvando ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.salvarTexto}>Salvar</Text>
                  )}
                </View>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
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
    right: -10,
    top: 120,
  },

  nome: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '80%',
  },
  nomeTexto: {
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

  /* modal de edição */
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(15, 27, 45, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCaixa: {
    backgroundColor: BG,
    borderWidth: 2,
    borderColor: INK,
    borderRadius: 24,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: '900',
    color: INK,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: INK,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: INK,
  },
  modalErro: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
  modalCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  modalCancelarTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: BLUE,
  },
  salvarBase: {
    backgroundColor: PANEL_BORDA,
    borderRadius: 16,
    paddingBottom: 5,
  },
  salvarBasePressed: {
    transform: [{ translateY: 2 }],
    paddingBottom: 3,
  },
  salvarFace: {
    backgroundColor: BLUE,
    borderWidth: 2,
    borderColor: PANEL_BORDA,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    minWidth: 110,
    alignItems: 'center',
  },
  salvarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});