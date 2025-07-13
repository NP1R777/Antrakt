import React from "react";
import theme from "./styles/theme";
import Hero from "./sections/Hero";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsPage from "./pages/admin/NewsPage";
import UsersPage from "./pages/admin/UsersPage";
import Dashboard from "./pages/admin/Dashboard";
import NewsSection from "./sections/NewsSection";
import Navigation from "./components/Navigation";
import ActorsPage from "./pages/admin/ActorsPage";
import Performances from "./sections/Perfomances";
import Testimonials from "./sections/Testimonials";
import TeamSection from "./sections/TeamSection";
import ArchivePage from "./pages/admin/ArchivePage";
import { ChakraProvider, Box } from "@chakra-ui/react";
import DirectorsPage from "./pages/admin/DirectorsPage";
import AdminLayout from "./components/admin/AdminLayout";
import PerformancesPage from './pages/admin/PerformancesPage'
import AchievementsPage from './pages/admin/AchievementsPage'
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Главная страница сайта
const MainPage = () => (
  <Box bg="black" color="white" minH="100vh">
    <Navigation />
    <Header />
    <Hero />
    <Performances />
    <NewsSection />
    <TeamSection />
    <Testimonials />
    <Footer />
  </Box>
);

// Защищенный маршрут для админов
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        bg="black"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
      >
        Загрузка...
      </Box>
    );
  }

  if (!isAuthenticated || !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={<MainPage />} />

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

            {/* Заглушки для будущих админских страниц */}
            <Route
              path="/admin/performances"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <PerformancesPage />
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
                    <NewsPage />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/achievements"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AchievementsPage />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/archive"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ArchivePage />
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
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter >
  );
}

export default App;
