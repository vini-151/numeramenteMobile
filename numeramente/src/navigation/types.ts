import { NavigatorScreenParams } from '@react-navigation/native';

export type OperationId = 'adicao' | 'subtracao' | 'multiplicacao' | 'divisao';

export type TabParamList = {
  Operations: undefined; // Início
  Tasks: undefined;      // Tarefas
  Profile: undefined;    // Perfil
};

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  OperationDetail: { operationId: OperationId };
};