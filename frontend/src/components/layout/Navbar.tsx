import { Box, Button } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4} color="white">
      <Box maxW="1200px" mx="auto" display="flex" gap={4}>
        <Button variant="ghost" color="white" _hover={{ bg: 'blue.600' }}>Home</Button>
        <Button variant="ghost" color="white" _hover={{ bg: 'blue.600' }}>Solver</Button>
        <Button variant="ghost" color="white" _hover={{ bg: 'blue.600' }}>About</Button>
      </Box>
    </Box>
  );
};

export default Navbar;