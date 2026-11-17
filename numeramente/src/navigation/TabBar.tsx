import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const INK = '#0f1b2d';
const BLUE = '#3d5afe';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];


const TABS: Record<string, { label: string; icon: IconName }> = {
  Operations: { label: 'Calculadora', icon: 'calculator-variant' },
  Tasks: { label: 'Tarefas', icon: 'clipboard-text' },
  Profile: { label: 'Perfil', icon: 'account' },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tab = TABS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: focused }}
              style={[styles.tab, focused && styles.tabActive]}
            >
              <MaterialCommunityIcons name={tab.icon} size={32} color={INK} />
              <Text style={styles.label}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#c9d8fb',
    paddingHorizontal: 16,
    paddingTop: 1,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#d3e6ff',
    borderRadius: 40,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#bcd0ff',
    borderColor: BLUE,
  },
  label: {
    marginTop: 2,
    fontSize: 14,
    color: INK,
  },
});