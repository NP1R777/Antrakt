import theme from "./styles/theme.ts";
import Hero from "./sections/Hero.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import { BrowserRouter } from "react-router-dom";
import NewsSection from "./sections/NewsSection.tsx";
import Navigation from "./components/Navigation.tsx";
import Performances from "./sections/Perfomances.tsx";
import { ChakraProvider, Box } from "@chakra-ui/react";
import Testimonials from "./sections/Testimonials.tsx";

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Box bg="black" color="white" minH="100vh">
          <Navigation />
          <Header />
          <Hero />
          <Performances />
          <NewsSection />
          <Testimonials />
          <Footer />
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;