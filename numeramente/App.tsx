import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { RootStackParamList } from './src/navigation/types';

import LoginScreen from './src/screens/LoginScreen';
import OperationsScreen from './src/screens/OperationsScreen';
import OperationDetailScreen from './src/screens/OperationDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Routes() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Telas disponíveis apenas com o usuário logado
          <>
            <Stack.Screen
              name="Operations"
              component={OperationsScreen}
              options={{ title: 'Operações' }}
            />
            <Stack.Screen
              name="OperationDetail"
              component={OperationDetailScreen}
              options={{ title: 'Operação' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Perfil' }}
            />
          </>
        ) : (
          // Tela exibida quando não está logado (primeira ao abrir o app)
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}