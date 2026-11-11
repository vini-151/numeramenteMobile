import React from 'react';
import { View, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      {/* seus inputs aqui */}
      <Button title="Entrar" onPress={() => signIn('email', 'senha')} />
    </View>
  );
}