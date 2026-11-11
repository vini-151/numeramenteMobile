import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>{user?.name}</Text>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
}