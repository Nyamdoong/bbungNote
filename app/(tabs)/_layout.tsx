import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '새 게임',
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: '히스토리',
        }}
      />

      <Tabs.Screen
        name="rules"
        options={{
          title: '룰',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
        }}
      />
    </Tabs>
  );
}