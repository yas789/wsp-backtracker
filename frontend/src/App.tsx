import { ChakraProvider, Box, Heading, Button } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading color="blue.500">Welcome to WSP Solver</Heading>
        <Box mt={4} color="gray.700">The application is running!</Box>
        <Button colorScheme="blue" mt={4}>Click me</Button>
      </Box>
    </ChakraProvider>
  );
}

export default App;