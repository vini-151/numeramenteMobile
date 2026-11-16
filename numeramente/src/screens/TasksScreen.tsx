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

/* ---------- Balão ---------- */
function Balao({
  lado,
  children,
  largura,
}: {
  lado: 'bot' | 'usuario';
  children: React.ReactNode;
  largura?: number | `${number}%`;
}) {
  const bot = lado === 'bot';
  return (
    <View style={[styles.balaoSombra, { width: largura }]}>
      <View style={styles.balao}>
        {/* "rabinho" apontando para o avatar */}
        <View style={[styles.rabo, bot ? styles.raboEsq : styles.raboDir]} />
        {children}
      </View>
    </View>
  );
}

/* ---------- Mensagens ---------- */
function MsgBot({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.linhaBot}>
      <Image source={GATO_AVATAR} style={styles.avatarGato} resizeMode="contain" />
      <View style={{ flex: 1 }}>
        <Balao lado="bot">{children}</Balao>
      </View>
    </View>
  );
}

function MsgUsuario({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.linhaUsuario}>
      <Balao lado="usuario">{children}</Balao>
      <View style={styles.avatarUsuario}>
        <MaterialCommunityIcons name="account" size={30} color="#9aa7d6" />
      </View>
    </View>
  );
}

/* ---------- Tela ---------- */
export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { width: W } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >


        {/* 2. Usuário escolhe Adição */}
        <MsgUsuario>
          <OpMini op={OPS[0]} largura={W * 0.3} />
        </MsgUsuario>

    
      
      </ScrollView>
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

  /* balão */
  balaoSombra: {
    backgroundColor: SOMBRA,
    borderRadius: 24,
    paddingRight: 6,
    paddingBottom: 6,
  },

  balao: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: BORDA,
    borderRadius: 24,
    padding: 16,
  },

  rabo: {
    position: 'absolute',
    top: 18,
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },

  raboEsq: {
    left: -9,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: BORDA,
  },

  raboDir: {
    right: -9,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: BORDA,
  },

  /* linhas */
  linhaBot: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },

  linhaUsuario: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: 14,
  },

  avatarGato: {
    width: 64,
    height: 64,
  },

  avatarUsuario: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3e9fb',
    borderWidth: 3,
    borderColor: '#c3cbe8',
    alignItems: 'center',
    justifyContent: 'center',
  },


  
});
