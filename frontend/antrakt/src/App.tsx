import React from "react";
import theme from "./styles/theme";
import Hero from "./sections/Hero";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UsersPage from "./pages/admin/UsersPage";
import Dashboard from "./pages/admin/Dashboard";
import NewsSection from "./sections/NewsSection";
import Navigation from "./components/Navigation";
import ActorsPage from "./pages/admin/ActorsPage";
import Performances from "./sections/Perfomances";
import Testimonials from "./sections/Testimonials";
import { ChakraProvider, Box, Input, Button, Text, VStack } from "@chakra-ui/react";
import NewsPageAdmin from "./pages/admin/NewsPageAdmin";
import DirectorsPage from "./pages/admin/DirectorsPage";
import AdminLayout from "./components/admin/AdminLayout";
import ArchivePageAadmin from "./pages/admin/ArchivePageAdmin";
import AchievementsPageAdmin from './pages/admin/AchievementsPageAdmin'
import PerformancesPageAdmin from './pages/admin/PerformancesPageAdmin'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { getAdminKey, setAdminKey } from "./utils/adminKey";

// Добавленные импорты
import TeamPage from "./pages/TeamPage";
import NewsPage from "./pages/NewsPage";
import AfishaPage from "./pages/AfishaPage";
import ArchivePage from "./pages/ArchivePage";
import AboutTheatre from "./pages/AboutTheatre";
import NewsDetail from "./pages/cards/NewsDetail";
import ScrollToTop from "./components/ScrollToTop";
import ActorDetail from "./pages/cards/ActorDetail";
import AfishaDetail from "./pages/cards/AfishaDetail";
import AchievementsPage from "./pages/AchievementsPage";
import ArchiveDetail from "./pages/cards/ArchiveDetail";
import PerformancesPage from "./pages/PerformancesPage";
import DirectorDetail from "./pages/cards/DirectorDetail";
import AchievementDetail from "./pages/cards/AchievementDetail";
import PerformanceDetail from "./pages/cards/PerfomancesDetail";

// Главная страница сайта
const MainPage = () => (
	<Box bg="black" color="white" minH="100vh">
		<Navigation />
		<Header />
		<Hero />
		<Performances />
		<NewsSection />
		<Testimonials />
		<Footer />
	</Box>
);

// Защищенный маршрут для админов через админ-ключ
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [adminKey, setAdminKeyState] = React.useState<string>(getAdminKey() || "");
	const [verifying, setVerifying] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string>("");
	const [isVerified, setIsVerified] = React.useState<boolean>(false);

	React.useEffect(() => {
		// Авто-верификация при наличии сохраненного ключа
		const saved = getAdminKey();
		if (!saved) return;
		setVerifying(true);
		axios
			.get('http://localhost:8000/users-admin/')
			.then(() => setIsVerified(true))
			.catch(() => setIsVerified(false))
			.finally(() => setVerifying(false));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setVerifying(true);
		setError("");
		try {
			setAdminKey(adminKey);
			await axios.get('http://localhost:8000/users-admin/');
			setIsVerified(true);
		} catch (err) {
			setError('Неверный админ-ключ');
		} finally {
			setVerifying(false);
		}
	};

	if (isVerified) return <>{children}</>;

	return (
		<Box minH="100vh" bg="black" display="flex" alignItems="center" justifyContent="center" color="white" px={4}>
			<VStack as="form" onSubmit={handleSubmit} spacing={4} w="full" maxW="sm" bg="#111" p={6} borderRadius="md" borderColor="#800020" borderWidth="1px">
				<Text fontSize="lg" fontWeight="bold">Вход в админ‑панель</Text>
				<Input
					placeholder="Введите админ-ключ"
					value={adminKey}
					onChange={(e) => setAdminKeyState(e.target.value)}
					bg="#1a1a1a"
					borderColor="#333"
					color="white"
				/>
				{error && <Text color="red.300" w="full">{error}</Text>}
				<Button type="submit" isLoading={verifying} bg="#800020" _hover={{ bg: '#600018' }} w="full">Войти</Button>
			</VStack>
		</Box>
	);
};

function App() {
	return (
		<BrowserRouter>
			<ChakraProvider theme={theme}>
				<ScrollToTop />
				<Routes>
					{/* Главная страница */}
					<Route path="/" element={<MainPage />} />

					{/* Новые маршруты для страницы команды и актеров */}
					<Route path="/team" element={<TeamPage />} />
					<Route path="/actor/:id" element={<ActorDetail />} />
					<Route path="/director/:id" element={<DirectorDetail />} />
					<Route path="/performances" element={<PerformancesPage />} />
					<Route path="/performance/:id" element={<PerformanceDetail />} />
					<Route path="/achievements" element={<AchievementsPage />} />
					<Route path="/achievement/:id" element={<AchievementDetail />} />
					<Route path="/about" element={<AboutTheatre />} />
					<Route path="/news" element={<NewsPage />} />
					<Route path="/news/:id" element={<NewsDetail />} />
					<Route path="/afisha" element={<AfishaPage />} />
					<Route path="/:type/:id" element={<AfishaDetail />} />
					<Route path="/archive" element={<ArchivePage />} />
					<Route path="/archive/:id" element={<ArchiveDetail />} />
					{/* Страница профиля удалена вместе с аутентификацией пользователей */}

					{/* Админ-панель */}
					<Route
						path="/admin"
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<Dashboard />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>

					{/* Админские страницы */}
					<Route
						path="/admin/performances"
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<PerformancesPageAdmin />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>

					<Route
						path="/admin/actors"
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<ActorsPage />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>

					<Route
						path="/admin/directors"
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<DirectorsPage />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>

					<Route
						path="/admin/news"
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<NewsPageAdmin />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>

					<Route
						path="/admin/achievements"
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<AchievementsPageAdmin />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>

					<Route
						path="/admin/archive"
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<ArchivePageAadmin />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>

					<Route
						path="/admin/users"
						element={
							<ProtectedAdminRoute>
								<AdminLayout>
									<UsersPage />
								</AdminLayout>
							</ProtectedAdminRoute>
						}
					/>

					{/* Перенаправление на главную для неизвестных маршрутов */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</ChakraProvider>
		</BrowserRouter >
	);
}

export default App;