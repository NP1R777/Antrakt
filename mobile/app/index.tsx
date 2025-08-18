import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import authService from '../src/services/authService';

export default function Entry() {
	const [ready, setReady] = useState(false);
	const [authed, setAuthed] = useState(false);

	useEffect(() => {
		(async () => {
			setAuthed(authService.isAuthenticated());
			setReady(true);
		})();
	}, []);

	if (!ready) {
		return (
			<View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator color="#fff" />
			</View>
		);
	}

	return <Redirect href={authed ? '/(tabs)' : '/(auth)/login'} />;
}