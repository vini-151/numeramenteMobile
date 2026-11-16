import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, OperationId } from '../navigation/types';