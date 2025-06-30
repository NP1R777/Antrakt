import theme from "./styles/theme.ts";
import Hero from "./sections/Hero.tsx";
import Header from "./components/Header.tsx";
import { BrowserRouter } from "react-router-dom";
import NewsSection from "./sections/NewsSection.tsx";
import Navigation from "./components/Navigation.tsx";
import Performances from "./sections/Perfomances.tsx";
import { ChakraProvider, Box } from "@chakra-ui/react";

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
        </Box>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;