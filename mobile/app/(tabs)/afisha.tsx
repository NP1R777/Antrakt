import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AfishaScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Афиша</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#000', padding: 16 },
	title: { color: '#fff', fontSize: 22, fontWeight: '600' },
});