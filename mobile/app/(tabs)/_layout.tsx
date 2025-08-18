import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="index" options={{ title: 'Главная' }} />
			<Tabs.Screen name="news" options={{ title: 'Новости' }} />
			<Tabs.Screen name="afisha" options={{ title: 'Афиша' }} />
			<Tabs.Screen name="profile" options={{ title: 'Профиль' }} />
		</Tabs>
	);
}