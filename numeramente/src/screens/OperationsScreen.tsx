import React from 'react';
import { View, Text, Image, Pressable, ScrollView ImageSourcePropType, useWindowDimensions, StyleSheet,
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
