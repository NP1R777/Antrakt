import React from "react";
import theme from "./styles/theme";
import Hero from "./sections/Hero";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter } from "react-router-dom";
import NewsSection from "./sections/NewsSection";
import Navigation from "./components/Navigation";
import Performances from "./sections/Perfomances";
import { ChakraProvider, Box } from "@chakra-ui/react";
import Testimonials from "./sections/Testimonials";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Box bg="black" color="white" minH="100vh">
            <Navigation />
            <Header />
            <Hero />
            <Performances />
            <NewsSection />
            <Testimonials />
            <Footer />
          </Box>
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;