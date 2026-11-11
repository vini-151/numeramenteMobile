import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';
import { useAuth } from '../contexts/AuthContext';

/* ---------- Ilustração (gato + estrelas) ---------- */
const INK = '#0f1b2d';
const BLUE = '#3d5afe';
const BG = '#e6f2ff';
const ORANGE = '#f5882a';

function Star({ x, y, size, rotate = 0 }: { x: number; y: number; size: number; rotate?: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size / 100})`}>
      <Path
        d="M0,-50 L12,-18 L46,-24 L24,2 L40,34 L8,22 L-14,48 L-18,14 L-50,0 L-20,-14 Z"
        fill={ORANGE}
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </G>
  );
}

function Ilustracao() {
  return (
    <Svg width="100%" style={{ aspectRatio: 360 / 260 }} viewBox="0 0 360 260">
      <Circle cx={180} cy={270} r={250} fill={BLUE} />
      <Circle cx={180} cy={270} r={150} fill={BG} />

      <Star x={34} y={118} size={44} rotate={-12} />
      <Star x={328} y={112} size={50} rotate={10} />
      <Star x={308} y={218} size={30} rotate={-8} />
      <Star x={60} y={240} size={26} rotate={14} />

      {/* corpo */}
      <Path
        d="M96 260 C100 200 120 168 150 156 L210 156 C240 168 260 200 264 260 Z"
        fill="#17253d"
      />
      {/* cabeça */}
      <Path
        d="M112 112 L118 62 L146 88 C166 82 194 82 214 88 L242 62 L248 112 C252 150 224 176 180 176 C136 176 108 150 112 112 Z"
        fill="#17253d"
      />
      {/* olhos */}
      <Ellipse cx={150} cy={122} rx={13} ry={15} fill="#fff" />
      <Ellipse cx={210} cy={122} rx={13} ry={15} fill="#fff" />
      <Circle cx={152} cy={124} r={6.5} fill="#17253d" />
      <Circle cx={208} cy={124} r={6.5} fill="#17253d" />
      {/* nariz e boca */}
      <Path d="M174 142 L186 142 L180 150 Z" fill={BG} />
      <Path
        d="M180 150 C180 158 170 160 166 156 M180 150 C180 158 190 160 194 156"
        stroke={BG}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      {/* bigodes */}
      <G stroke={BG} strokeWidth={2} strokeLinecap="round">
        <Line x1={136} y1={146} x2={108} y2={142} />
        <Line x1={136} y1={152} x2={108} y2={156} />
        <Line x1={224} y1={146} x2={252} y2={142} />
        <Line x1={224} y1={152} x2={252} y2={156} />
      </G>
    </Svg>
  );
}

/* ---------- Tela ---------- */
export default function LoginScreen() {
  const { signIn } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ilustração fixa no rodapé, atrás do conteúdo */}
      <View style={styles.art} pointerEvents="none">
        <Ilustracao />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Boas Vindas ao{'\n'}
          <Text style={styles.titleAccent}>NumeraMente</Text>!
        </Text>

        <Text style={styles.description}>
          O NumeraMente ajuda crianças com discalculia a praticarem operações
          matemáticas de forma interativa e acessível
        </Text>

        <Text style={styles.label}>Qual seu nome?</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#8a94a3"
          value={nome}
          onChangeText={setNome}
          autoComplete="name"
        />

        <Text style={styles.label}>Qual seu email?</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#8a94a3"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Pressable accessibilityRole="link" hitSlop={8}>
          <Text style={styles.terms}>Termos de privacidade e uso</Text>
        </Pressable>

        {/* ajuste os argumentos conforme o seu signIn */}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => signIn(email, nome)}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- Estilos (mesmo arquivo) ---------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 200,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: INK,
    marginBottom: 12,
  },
  titleAccent: {
    color: BLUE,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: INK,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: INK,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: INK,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: INK,
    marginBottom: 20,
  },
  terms: {
    alignSelf: 'center',
    fontSize: 12,
    color: BLUE,
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  button: {
    marginTop: 24,
    backgroundColor: BLUE,
    borderWidth: 2,
    borderColor: INK,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  art: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
