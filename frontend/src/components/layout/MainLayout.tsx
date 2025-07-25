import { Box, Flex, Container, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex minH="100vh" direction="column" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar onOpen={onOpen} />
      
      <Flex flex="1" pt="60px">
        {/* Mobile Sidebar */}
        <Box
          as="aside"
          w={{ base: '0', md: '250px' }}
          bg={bgColor}
          borderRight="1px"
          borderColor={borderColor}
          position={{ base: 'fixed', md: 'static' }}
          top="60px"
          left={isOpen ? '0' : '-250px'}
          bottom="0"
          zIndex="sticky"
          transition="all 0.3s"
          overflowY="auto"
          boxShadow={{ base: isOpen ? 'lg' : 'none', md: 'none' }}
        >
          <Sidebar onClose={onClose} />
        </Box>

        {/* Overlay for mobile */}
        {isOpen && (
          <Box
            display={{ base: 'block', md: 'none' }}
            position="fixed"
            top="60px"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
            zIndex="overlay"
            onClick={onClose}
          />
        )}

        {/* Main Content */}
        <Box
          as="main"
          flex="1"
          p={{ base: 4, md: 6 }}
          ml={{ base: 0, md: '250px' }}
          transition="all 0.3s"
          width={{ base: '100%', md: 'calc(100% - 250px)' }}
        >
          <Container maxW="container.xl" px={{ base: 0, md: 4 }}>
            <Box
              bg={bgColor}
              borderRadius="lg"
              boxShadow="sm"
              p={{ base: 4, md: 6 }}
              minH="calc(100vh - 120px)"
            >
              <Outlet />
            </Box>
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;
