import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

export function ThemeProvider({ children }: PropsWithChildren<{}>) {
	return (
		<SafeAreaProvider>
			<View style={{ flex: 1, backgroundColor: '#000' }}>{children}</View>
		</SafeAreaProvider>
	);
}