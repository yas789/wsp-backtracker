import { Box, Container, Flex, useColorMode, IconButton, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box as="header" borderBottom="1px" borderColor={borderColor} bg={bg} position="sticky" top={0} zIndex={10}>
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <Box fontWeight="bold" fontSize="xl">
              WSP Solver
            </Box>
            <Navbar />
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </Flex>
        </Container>
      </Box>

      <Box as="main" flex={1} py={8}>
        <Container maxW="container.xl">
          <Outlet />
        </Container>
      </Box>

      <Box as="footer" py={4} borderTop="1px" borderColor={borderColor} bg={bg}>
        <Container maxW="container.xl" textAlign="center" color="gray.500" fontSize="sm">
          © {new Date().getFullYear()} WSP Solver. All rights reserved.
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
