import React from "react";
import theme from "./styles/theme";
import Hero from "./sections/Hero";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/admin/Dashboard";
import NewsSection from "./sections/NewsSection";
import Navigation from "./components/Navigation";
import ActorsPage from "./pages/admin/ActorsPage";
import Performances from "./sections/Perfomances";
import Testimonials from "./sections/Testimonials";
import { ChakraProvider, Box } from "@chakra-ui/react";
import AdminLayout from "./components/admin/AdminLayout";
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
                    <Box p={8} color="white">
                      <h1>Управление спектаклями</h1>
                      <p>Скоро здесь будет CRUD для спектаклей</p>
                    </Box>
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
                    <Box p={8} color="white">
                      <h1>Управление режиссёрами</h1>
                      <p>Скоро здесь будет CRUD для режиссёров</p>
                    </Box>
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/news"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <Box p={8} color="white">
                      <h1>Управление новостями</h1>
                      <p>Скоро здесь будет CRUD для новостей</p>
                    </Box>
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/achievements"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <Box p={8} color="white">
                      <h1>Управление достижениями</h1>
                      <p>Скоро здесь будет CRUD для достижений</p>
                    </Box>
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/archive"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <Box p={8} color="white">
                      <h1>Управление архивом</h1>
                      <p>Скоро здесь будет CRUD для архива</p>
                    </Box>
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
