import React, { useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions, StyleSheet,
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

/* ---------- Card: cabeçalho colorido com o número + corpo branco com novelos ---------- */
function CardNumero({
  face,
  borda,
  quantidade,
  tamanho,
  children,
}: {
  face: string;
  borda: string;
  quantidade: number;
  tamanho: number;
  children: React.ReactNode; // conteúdo do cabeçalho (input ou número)
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardHeader, { backgroundColor: face, borderColor: borda }]}>
        {children}
      </View>
      <View style={[styles.cardBody, { borderColor: borda }]}>
        <Novelos quantidade={quantidade} tamanho={tamanho} />
      </View>
    </View>
  );
}

/* ---------- Tela ---------- */
export default function OperationDetailScreen({ route, navigation }: Props) {
  const { operationId } = route.params;
  const op = CONFIG[operationId];

  const { width: W } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState('');

  // tamanho do novelo para caber 5 por linha dentro do card
  const tamanho = Math.floor((W - 24 - 48 - 24 - 8) / POR_LINHA);

  function alterar(setter: (v: string) => void) {
    return (texto: string) => {
      const digitos = texto.replace(/\D/g, '');
      setter(digitos === '' ? '' : String(Math.min(parseInt(digitos, 10), MAX)));
      setResultado(null);
      setErro('');
    };
  }

  function calcular() {
    if (a === '' || b === '') {
      setErro('Preencha os dois números.');
      return;
    }
    const x = Number(a);
    const y = Number(b);

    switch (operationId) {
      case 'adicao':
        setResultado({ valor: x + y });
        break;
      case 'subtracao':
        if (y > x) {
          setErro('O primeiro número precisa ser maior ou igual ao segundo.');
          return;
        }
        setResultado({ valor: x - y });
        break;
      case 'multiplicacao':
        setResultado({ valor: x * y });
        break;
      case 'divisao':
        if (y === 0) {
          setErro('Não dá para dividir por 0.');
          return;
        }
        setResultado({ valor: Math.floor(x / y), resto: x % y });
        break;
    }
    setErro('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* cabeçalho: voltar + título */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
        >
          <Text style={styles.back}>{'<'}</Text>
        </Pressable>
        <Text style={[styles.title, { color: op.borda }]}>{op.label}</Text>
      </View>

      {/* painel azul */}
      <View style={styles.panel}>
        <ScrollView
          style={styles.inner}
          contentContainerStyle={styles.innerContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.instrucao}>Insira valores de 0 a {MAX}:</Text>

          {/* primeiro número */}
          <CardNumero face={op.face} borda={op.borda} quantidade={Number(a || 0)} tamanho={tamanho}>
            <TextInput
              style={styles.numero}
              value={a}
              onChangeText={alterar(setA)}
              placeholder="0"
              placeholderTextColor="#00000055"
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              accessibilityLabel="Primeiro número"
            />
          </CardNumero>

          {/* símbolo da operação */}
          <Text
            style={[styles.simbolo, { color: op.face, textShadowColor: op.borda }]}
            accessibilityElementsHidden
          >
            {op.simbolo}
          </Text>

          {/* segundo número */}
          <CardNumero face={op.face} borda={op.borda} quantidade={Number(b || 0)} tamanho={tamanho}>
            <TextInput
              style={styles.numero}
              value={b}
              onChangeText={alterar(setB)}
              placeholder="0"
              placeholderTextColor="#00000055"
              keyboardType="number-pad"
              maxLength={2}
              selectTextOnFocus
              accessibilityLabel="Segundo número"
            />
          </CardNumero>

          {!!erro && (
            <Text style={styles.erro} accessibilityRole="alert">
              {erro}
            </Text>
          )}

          {/* botão calcular */}
          <Pressable
            onPress={calcular}
            accessibilityRole="button"
            style={({ pressed }) => [styles.botaoBase, pressed && styles.botaoBasePressed]}
          >
            <View style={styles.botaoFace}>
              <Text style={styles.botaoTexto}>Calcular</Text>
            </View>
          </Pressable>

          {/* resultado */}
          {resultado && (
            <>
              <CardNumero
                face={op.face}
                borda={op.borda}
                quantidade={resultado.valor}
                tamanho={tamanho}
              >
                <Text style={styles.numero}>{resultado.valor}</Text>
              </CardNumero>

              {!!resultado.resto && (
                <Text style={styles.resto}>Sobrou {resultado.resto}</Text>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}/* ---------- Estilos ---------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  back: {
    fontSize: 34,
    fontWeight: '700',
    color: BLUE,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
  },
  panel: {
    flex: 1,
    backgroundColor: PANEL_BLUE,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 12,
    paddingBottom: 0,
  },
  inner: {
    flex: 1,
    backgroundColor: BG,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  innerContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  instrucao: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '800',
    color: INK,
    marginBottom: 12,
  },

  /* card */
  card: {
    width: '100%',
  },
  cardHeader: {
    borderWidth: 2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 2,
    paddingBottom: 18,
    alignItems: 'center',
  },
  cardBody: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 16,
    marginTop: -14,
    padding: 12,
    minHeight: 64,
  },
  numero: {
    minWidth: 60,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    paddingVertical: 2,
  },

  simbolo: {
    fontSize: 56,
    lineHeight: 60,
    fontWeight: '900',
    marginVertical: 4,
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 0,
  },

  erro: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },

  /* botão 3D */
  botaoBase: {
    marginVertical: 20,
    backgroundColor: '#0f22a8',
    borderRadius: 18,
    paddingBottom: 6,
  },
  botaoBasePressed: {
    transform: [{ translateY: 3 }],
    paddingBottom: 3,
  },
  botaoFace: {
    backgroundColor: PANEL_BLUE,
    borderWidth: 2,
    borderColor: '#0f22a8',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 56,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  resto: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: INK,
  },
});