import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

export type User = { id: number; nome: string; email: string };

type AuthContextData = {
  user: User | null;
  loading: boolean;
  signIn: (nome: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  atualizarNome: (nome: string) => Promise<void>;
};







const USER_KEY = 'auth_user';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o app: restaura o usuário salvo, se existir
  useEffect(() => {
    async function restoreSession() {
      try {
        const saved = await SecureStore.getItemAsync(USER_KEY);
        if (saved) setUser(JSON.parse(saved));
      } catch {
        await SecureStore.deleteItemAsync(USER_KEY);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function signIn(nome: string, email: string) {
    const { data } = await api.post<User>('/login', { nome, email });
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data));
    setUser(data); // a navegação troca de tela sozinha
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(USER_KEY);
    setUser(null);
  }

  async function atualizarNome(nome: string) {
    if (!user) return;
    const { data } = await api.patch<User>(`/usuarios/${user.id}`, { nome });
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data));
    setUser(data);
  }



  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, atualizarNome  }}>
      {children}
    </AuthContext.Provider>

  );
}

export const useAuth = () => useContext(AuthContext);