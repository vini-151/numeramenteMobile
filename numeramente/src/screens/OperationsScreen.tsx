import React from 'react';
import { View, Text, Image, Pressable, ScrollView, ImageSourcePropType, useWindowDimensions, StyleSheet,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, TabParamList, OperationId } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Operations'>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ---------- Cores ---------- */
const INK = '#0f1b2d';
const BLUE = '#3d5afe';
const BG = '#eaf3ff';
const PANEL = '#c9d8fb';

type Operacao = {
  id: OperationId;
  label: string;
  icone: ImageSourcePropType;
  iconeAspect: number; // largura / altura da imagem original
  iconeLargura: number; // fração da largura da tela
  face: string; // cor da face do botão
  borda: string; // cor da borda e da base 3D
};

const OPERACOES: Operacao[] = [
  {
    id: 'adicao',
    label: 'Adição',
    icone: require('../../assets/images/icone-adicao.png'), // 110x104
    iconeAspect: 110 / 104,
    iconeLargura: 0.14,
    face: '#67c365',
    borda: '#2f6e3e',
  },
  {
    id: 'subtracao',
    label: 'Subtração',
    icone: require('../../assets/images/icone-subtracao.png'), // 155x55
    iconeAspect: 155 / 55,
    iconeLargura: 0.19,
    face: '#eea84b',
    borda: '#a22e4a',
  },
  {
    id: 'multiplicacao',
    label: 'Multiplicação',
    icone: require('../../assets/images/icone-multiplicacao.png'), // 107x108
    iconeAspect: 107 / 108,
    iconeLargura: 0.135,
    face: '#a255d0',
    borda: '#4f1a7a',
  },
  {
    id: 'divisao',
    label: 'Divisão',
    icone: require('../../assets/images/icone-divisao.png'), // 120x105
    iconeAspect: 120 / 105,
    iconeLargura: 0.155,
    face: '#ea6e6a',
    borda: '#a02b45',
  },
];

/* ---------- Tela ---------- */
export default function OperationsScreen({ navigation }: Props) {
  const { width: W } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Text style={[styles.title, { paddingTop: insets.top + 28 }]}>
        Escolha uma{'\n'}
        <Text style={styles.titleAccent}>operação matemática</Text>
        {'\n'}para praticar!
      </Text>

      <ScrollView
        style={styles.panel}
        contentContainerStyle={styles.panelContent}
        showsVerticalScrollIndicator={false}
      >
        {OPERACOES.map((op) => (
          <Pressable
            key={op.id}
            accessibilityRole="button"
            accessibilityLabel={op.label}
            onPress={() => navigation.navigate('OperationDetail', { operationId: op.id })}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: op.borda },
              pressed && styles.cardPressed,
            ]}
          >
            <View
              style={[
                styles.cardFace,
                { height: W * 0.25, backgroundColor: op.face, borderColor: op.borda },
              ]}
            >
              {/* área fixa para o ícone: todos os rótulos ficam alinhados */}
              <View style={[styles.iconArea, { height: W * 0.14 }]}>
                <Image
                  source={op.icone}
                  style={{
                    width: W * op.iconeLargura,
                    height: (W * op.iconeLargura) / op.iconeAspect,
                  }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.cardLabel}>{op.label}</Text>
            </View>
          </Pressable>
        ))}
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
  title: {
    paddingHorizontal: 24,
    marginBottom: 28,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    color: INK,
  },
  titleAccent: {
    color: BLUE,
  },
  panel: {
    flex: 1,
    backgroundColor: PANEL,
    borderTopLeftRadius: 64,
    borderTopRightRadius: 64,
  },
  panelContent: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    width: '62%',
    borderRadius: 18,
    paddingBottom: 12, // espessura da base 3D
  },
  cardPressed: {
    transform: [{ translateY: 4 }],
    paddingBottom: 8,
  },
  cardFace: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 18,
  },
  iconArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
});