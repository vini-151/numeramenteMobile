import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OperationDetail'>;

export default function OperationDetailScreen({ route }: Props) {
  const { operationId } = route.params;

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>Operação: {operationId}</Text>
    </View>
  );
}