import Hero from "./sections/Hero.tsx";
import theme from "./styles/theme.ts";
import Header from "./components/Header.tsx";
import Navigation from "./components/Navigation.tsx";
import { ChakraProvider, Box } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box bg="black" color="white" minH="100vh">
        <Navigation />
        <Header />
        <Hero />
        {/* <About /> */}
        {/* Другие секции */}
      </Box>
    </ChakraProvider>
  );
}

export default App;