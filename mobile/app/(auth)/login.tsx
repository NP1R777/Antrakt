import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import authService from '../../src/services/authService';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
	const router = useRouter();
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		if (loading) return;
		setLoading(true);
		const ok = await authService.login(login.trim(), password);
		setLoading(false);
		if (ok) {
			router.replace('/(tabs)');
		} else {
			Alert.alert('Ошибка', 'Неверные данные входа');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Вход</Text>
			<TextInput
				style={styles.input}
				placeholder="Email или телефон"
				placeholderTextColor="#666"
				value={login}
				onChangeText={setLogin}
				autoCapitalize="none"
			/>
			<TextInput
				style={styles.input}
				placeholder="Пароль"
				placeholderTextColor="#666"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<Pressable onPress={onSubmit} style={styles.button}>
				<Text style={styles.buttonText}>{loading ? 'Входим...' : 'Войти'}</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#000', padding: 16, justifyContent: 'center' },
	title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
	input: { backgroundColor: '#111', color: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
	button: { backgroundColor: '#e91e63', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
	buttonText: { color: '#fff', fontWeight: '600' },
});