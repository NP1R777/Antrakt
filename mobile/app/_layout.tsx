import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeProvider';

export default function RootLayout() {
	return (
		<ThemeProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="(auth)" />
				<Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
			</Stack>
		</ThemeProvider>
	);
}