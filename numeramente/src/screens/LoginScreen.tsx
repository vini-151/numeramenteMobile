import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator, 
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

/* ---------- Cores ---------- */
const INK = '#0f1b2d';
const BLUE = '#3d5afe';
const BG = '#e6f2ff';

/* ---------- Imagens da designer (ajuste o caminho se necessário) ---------- */
const IMG = {
  gato: require('../../assets/images/gato.png'), // 530x718
  brilhoPequeno: require('../../assets/images/estrela-brilho-pequena.png'), // 66x80
  estrelaTorta: require('../../assets/images/estrela-torta.png'), // 158x190
  estrelaCincoPontas: require('../../assets/images/estrela-cinco-pontas.png'), // 160x180
  brilhoMais: require('../../assets/images/estrela-brilho-mais.png'), // 132x158
};

/* ---------- Ilustração (posições relativas à largura da tela) ---------- */
function Ilustracao() {
  const { width: W } = useWindowDimensions();
  const altura = W * 0.912;

  // helper: posiciona uma imagem por fração da largura (W)
  const pos = (left: number, top: number, largura: number, w: number, h: number) => ({
    position: 'absolute' as const,
    left: left * W,
    top: top * W,
    width: largura * W,
    height: largura * W * (h / w),
  });

  return (
    <View style={[styles.art, { height: altura }]} pointerEvents="none">
      {/* círculo azul grande */}
      <View
        style={{
          position: 'absolute',
          left: -0.3 * W,
          top: 0.162 * W,
          width: 1.6 * W,
          height: 1.6 * W,
          borderRadius: 0.8 * W,
          backgroundColor: BLUE,
        }}
      />
      {/* círculo claro interno */}
      <View
        style={{
          position: 'absolute',
          left: 0.15 * W,
          top: 0.292 * W,
          width: 0.7 * W,
          height: 0.7 * W,
          borderRadius: 0.35 * W,
          backgroundColor: BG,
        }}
      />

      {/* gato */}
      <Image source={IMG.gato} style={pos(0.16, 0, 0.68, 530, 718)} resizeMode="contain" />

      {/* estrelas */}
      <Image source={IMG.brilhoPequeno} style={pos(0.077, 0.38, 0.075, 66, 80)} resizeMode="contain" />
      <Image source={IMG.brilhoMais} style={pos(0.78, 0.317, 0.17, 132, 158)} resizeMode="contain" />
      <Image source={IMG.estrelaTorta} style={pos(0.007, 0.634, 0.18, 158, 190)} resizeMode="contain" />
      <Image source={IMG.estrelaCincoPontas} style={pos(0.806, 0.67, 0.15, 160, 180)} resizeMode="contain" />
    </View>
  );
}

/* ---------- Tela ---------- */
export default function LoginScreen() {
  const { signIn } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    if (enviando) return;

    if (!nome.trim() || !email.trim()) {
      setErro('Preencha seu nome e seu email.');
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      // sucesso: o AuthContext define o usuário e a navegação troca de tela sozinha
      await signIn(nome.trim(), email.trim());
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      setErro(
        typeof detail === 'string'
          ? detail
          : 'Não foi possível conectar ao servidor. Tente novamente.'
      );
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ilustração fixa no rodapé, atrás do conteúdo */}
      <Ilustracao />

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
          editable={!enviando}
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
          editable={!enviando}
        />

        {!!erro && (
          <Text style={styles.error} accessibilityRole="alert">
            {erro}
          </Text>
        )}

        <Pressable accessibilityRole="link" hitSlop={8}>
          <Text style={styles.terms}>Termos de privacidade e uso</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (pressed || enviando) && styles.buttonPressed,
          ]}
          onPress={handleEntrar}
          disabled={enviando}
          accessibilityRole="button"
          accessibilityState={{ disabled: enviando }}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
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
    paddingBottom: 240,
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
    overflow: 'hidden',
  },
    error: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: -8,
  },
});
