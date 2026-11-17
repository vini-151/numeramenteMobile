import axios from 'axios';

// localhost NÃO funciona no celular físico. Use o IP da sua máquina na rede local.
// Android Emulator: http://10.0.2.2:8000 | iOS Simulator: http://localhost:8000
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000',
  timeout: 10000,
});