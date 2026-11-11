import React, { useLayoutEffect } from 'react';
import { View, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Operations'>;

export default function OperationsScreen({ navigation }: Props) {
  // Botão de perfil no cabeçalho
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Perfil" onPress={() => navigation.navigate('Profile')} />
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Button
        title="Abrir operação 1"
        onPress={() => navigation.navigate('OperationDetail', { operationId: '1' })}
      />
    </View>
  );
}