import { Spinner, Center, Box } from '@chakra-ui/react';

const LoadingSpinner = () => (
  <Center h="100vh">
    <Box textAlign="center">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  </Center>
);

export default LoadingSpinner;
