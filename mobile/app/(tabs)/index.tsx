import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Антракт — Главная</Text>
			<View style={styles.block}><Text style={styles.blockText}>Хедер / Навигация</Text></View>
			<View style={styles.block}><Text style={styles.blockText}>Герой</Text></View>
			<View style={styles.block}><Text style={styles.blockText}>Спектакли</Text></View>
			<View style={styles.block}><Text style={styles.blockText}>Новости</Text></View>
			<View style={styles.block}><Text style={styles.blockText}>Отзывы</Text></View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, backgroundColor: '#000' },
	title: { color: '#fff', fontSize: 22, fontWeight: '600', marginBottom: 12 },
	block: { height: 160, backgroundColor: '#111', borderRadius: 12, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
	blockText: { color: '#bbb' },
});