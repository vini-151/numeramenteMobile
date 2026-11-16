import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
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

/* ---------- Operações ---------- */
type OpId = 'adicao' | 'subtracao' | 'multiplicacao' | 'divisao';

type Op = {
  id: OpId;
  label: string;
  icone: ImageSourcePropType;
  aspect: number; // largura / altura da imagem original
  larguraIcone: number; // largura do ícone em px (versão mini)
  face: string;
  borda: string;
};

const OPS: Op[] = [
  { id: 'adicao', label: 'Adição', icone: require('../../assets/images/icone-adicao.png'), aspect: 110 / 104, larguraIcone: 22, face: '#67c365', borda: '#2f6e3e' },
  { id: 'subtracao', label: 'Subtração', icone: require('../../assets/images/icone-subtracao.png'), aspect: 155 / 55, larguraIcone: 32, face: '#eea84b', borda: '#a22e4a' },
  { id: 'multiplicacao', label: 'Multiplicação', icone: require('../../assets/images/icone-multiplicacao.png'), aspect: 107 / 108, larguraIcone: 22, face: '#a255d0', borda: '#4f1a7a' },
  { id: 'divisao', label: 'Divisão', icone: require('../../assets/images/icone-divisao.png'), aspect: 120 / 105, larguraIcone: 24, face: '#ea6e6a', borda: '#a02b45' },
];

/* ---------- Gerador de contas ---------- */
type Conta = { texto: string; resultado: number };

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function gerarConta(op: Op): Conta {
  switch (op.id) {
    case 'adicao': {
      const a = rand(1, 50);
      const b = rand(1, 50);
      return { texto: `${a} + ${b}`, resultado: a + b };
    }
    case 'subtracao': {
      const a = rand(5, 60);
      const b = rand(1, a); // garante resultado >= 0
      return { texto: `${a} − ${b}`, resultado: a - b };
    }
    case 'multiplicacao': {
      const a = rand(2, 10);
      const b = rand(2, 10);
      return { texto: `${a} × ${b}`, resultado: a * b };
    }
    case 'divisao': {
      const b = rand(2, 10);
      const resultado = rand(1, 10);
      return { texto: `${b * resultado} ÷ ${b}`, resultado }; // sempre exata
    }
  }
}

/* ---------- Mensagens ---------- */
type Msg =
  | { id: number; de: 'bot'; tipo: 'ops'; texto: string }
  | { id: number; de: 'bot'; tipo: 'texto'; texto: string }
  | { id: number; de: 'bot'; tipo: 'conta'; intro: string; conta: string }
  | { id: number; de: 'usuario'; tipo: 'op'; op: Op }
  | { id: number; de: 'usuario'; tipo: 'resposta'; texto: string };

/* escolhendo: botões ativos | aguardando: gato digitando | respondendo: campo ativo */
type Etapa = 'escolhendo' | 'aguardando' | 'respondendo';

/* ---------- Botão mini de operação (dentro do balão) ---------- */
function OpMini({
  op,
  largura,
  onPress,
  desabilitado,
}: {
  op: Op;
  largura?: number | `${number}%`;
  onPress?: () => void;
  desabilitado?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado || !onPress}
      style={({ pressed }) => [
        { width: largura },
        pressed && { transform: [{ translateY: 3 }] },
        desabilitado && { opacity: 0.55 },
      ]}
    >
      <View style={[styles.opBase, { backgroundColor: op.borda }]}>
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
    </Pressable>
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

  const idRef = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const proximoId = () => ++idRef.current;

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      de: 'bot',
      tipo: 'ops',
      texto: 'Vamos praticar mais? Selecione a operação matemática que deseja praticar:',
    },
  ]);
  const [idOpsAtivo, setIdOpsAtivo] = useState<number | null>(1);
  const [etapa, setEtapa] = useState<Etapa>('escolhendo');
  const [contaAtual, setContaAtual] = useState<Conta | null>(null);
  const [digitando, setDigitando] = useState(false);
  const [resposta, setResposta] = useState('');

  /* limpa timeouts ao sair da tela */
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const adicionar = (...novas: Msg[]) => setMsgs((m) => [...m, ...novas]);

  /* o gato "digita" por um instante e depois manda as mensagens */
  const gatoFala = (montar: () => Msg[], depois?: () => void) => {
    setDigitando(true);
    const t = setTimeout(() => {
      adicionar(...montar());
      setDigitando(false);
      depois?.();
    }, 800);
    timers.current.push(t);
  };

  /* 1. Usuário escolhe a operação */
  const escolherOperacao = (op: Op) => {
    if (etapa !== 'escolhendo') return;
    setEtapa('aguardando');
    setIdOpsAtivo(null);
    adicionar({ id: proximoId(), de: 'usuario', tipo: 'op', op });

    const conta = gerarConta(op);
    gatoFala(
      () => [
        {
          id: proximoId(),
          de: 'bot',
          tipo: 'conta',
          intro: 'Legal! Vamos começar. Resolva a operação:',
          conta: conta.texto,
        },
      ],
      () => {
        setContaAtual(conta);
        setEtapa('respondendo');
      }
    );
  };

  /* 2. Usuário envia a resposta */
  const enviarResposta = () => {
    if (etapa !== 'respondendo' || !contaAtual) return;
    const texto = resposta.trim().replace(',', '.');
    if (texto === '' || isNaN(Number(texto))) return;

    const valor = Number(texto);
    adicionar({ id: proximoId(), de: 'usuario', tipo: 'resposta', texto: resposta.trim() });
    setResposta('');
    setEtapa('aguardando');

    if (valor === contaAtual.resultado) {
      /* acertou: comemora e oferece novas operações */
      const idOps = proximoId();
      gatoFala(
        () => [
          {
            id: proximoId(),
            de: 'bot',
            tipo: 'texto',
            texto: 'Você acertou, Parabéns! Você é incrível em matemática!',
          },
          {
            id: idOps,
            de: 'bot',
            tipo: 'ops',
            texto: 'Quer praticar mais? Escolha a próxima operação:',
          },
        ],
        () => {
          setContaAtual(null);
          setIdOpsAtivo(idOps);
          setEtapa('escolhendo');
        }
      );
    } else {
      /* errou: repete a mesma conta */
      gatoFala(
        () => [
          {
            id: proximoId(),
            de: 'bot',
            tipo: 'conta',
            intro: 'Quase lá! Tente de novo:',
            conta: contaAtual.texto,
          },
        ],
        () => setEtapa('respondendo')
      );
    }
  };

  const podeEnviar = etapa === 'respondendo' && resposta.trim() !== '';

  const renderMsg = (m: Msg) => {
    if (m.de === 'usuario') {
      return (
        <MsgUsuario key={m.id}>
          {m.tipo === 'op' ? (
            <OpMini op={m.op} largura={W * 0.3} />
          ) : (
            <Text style={styles.resposta}>{m.texto}</Text>
          )}
        </MsgUsuario>
      );
    }

    switch (m.tipo) {
      case 'ops':
        return (
          <MsgBot key={m.id}>
            <Text style={styles.texto}>{m.texto}</Text>
            <View style={styles.grade}>
              {OPS.map((op) => (
                <OpMini
                  key={op.id}
                  op={op}
                  largura="48%"
                  desabilitado={m.id !== idOpsAtivo}
                  onPress={() => escolherOperacao(op)}
                />
              ))}
            </View>
          </MsgBot>
        );
      case 'conta':
        return (
          <MsgBot key={m.id}>
            <Text style={styles.texto}>{m.intro}</Text>
            <Text style={styles.conta}>{m.conta}</Text>
            <Text style={styles.texto}>Resolva no seu tempo e me mande o resultado.</Text>
          </MsgBot>
        );
      case 'texto':
        return (
          <MsgBot key={m.id}>
            <Text style={styles.texto}>{m.texto}</Text>
          </MsgBot>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Tarefas</Text>

        {msgs.map(renderMsg)}

        {digitando && (
          <MsgBot>
            <Text style={styles.digitando}>• • •</Text>
          </MsgBot>
        )}
      </ScrollView>

      {/* Barra de resposta */}
      <View style={styles.inputBar}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={resposta}
            onChangeText={(t) => setResposta(t.replace(/[^0-9-]/g, ''))}
            placeholder={
              etapa === 'respondendo'
                ? 'Digite sua resposta...'
                : etapa === 'escolhendo'
                ? 'Escolha uma operação acima'
                : 'Aguarde o gatinho...'
            }
            placeholderTextColor="#8a96bd"
            keyboardType="number-pad"
            editable={etapa === 'respondendo'}
            returnKeyType="send"
            onSubmitEditing={enviarResposta}
            maxLength={6}
          />
        </View>
        <Pressable
          onPress={enviarResposta}
          disabled={!podeEnviar}
          style={({ pressed }) => [
            styles.botaoEnviar,
            !podeEnviar && styles.botaoEnviarOff,
            pressed && { transform: [{ translateY: 2 }] },
          ]}
        >
          <MaterialCommunityIcons name="send" size={22} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 16,
    gap: 28,
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000',
    marginLeft: 8,
    marginBottom: 8,
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

  /* textos */
  texto: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
    color: INK,
  },

  conta: {
    fontSize: 24,
    fontWeight: '800',
    color: VERDE_TEXTO,
    textAlign: 'center',
    marginVertical: 14,
  },

  resposta: {
    fontSize: 24,
    fontWeight: '800',
    color: VERDE_TEXTO,
    textAlign: 'center',
    paddingHorizontal: 36,
    paddingVertical: 6,
  },

  digitando: {
    fontSize: 20,
    fontWeight: '900',
    color: BORDA,
    letterSpacing: 2,
  },

  /* grade de operações */
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginTop: 16,
  },

  /* barra de resposta */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 12,
    backgroundColor: BG,
  },

  inputWrap: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: BORDA,
    borderRadius: 24,
    paddingHorizontal: 18,
  },

  input: {
    height: 48,
    fontSize: 17,
    fontWeight: '800',
    color: INK,
  },

  botaoEnviar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BORDA,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoEnviarOff: {
    backgroundColor: '#aab4e0',
  },
});