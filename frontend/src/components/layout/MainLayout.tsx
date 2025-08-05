import { Box, Flex, useDisclosure, useColorModeValue, Container, IconButton, Text, HStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';
import ColorModeToggle from '../shared/ColorModeToggle';

const MainLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('white', 'gray.800');
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.3)');

  return (
    <Flex minH="100vh" direction="column">
      {/* Enhanced Header */}
      <Box
        as="header"
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="sticky"
        bg={headerBg}
        borderBottom="1px"
        borderColor={borderColor}
        boxShadow={`0 1px 3px ${shadowColor}`}
        backdropFilter="blur(10px)"
        h="16"
      >
        <Flex h="full" align="center" justify="space-between" px={{ base: 4, md: 6 }}>
          <HStack spacing={4}>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              variant="ghost"
              icon={<FiMenu />}
              aria-label="Open Menu"
              size="md"
            />
            <Text fontSize="xl" fontWeight="bold" color="brand.500">
              WSP Solver
            </Text>
          </HStack>
          <ColorModeToggle />
        </Flex>
      </Box>
      
      <Flex flex="1" pt="16">
        {/* Enhanced Desktop Sidebar */}
        <Box
          as="aside"
          display={{ base: 'none', md: 'block' }}
          w="280px"
          bg={bgColor}
          borderRight="1px"
          borderColor={borderColor}
          position="fixed"
          top="16"
          left="0"
          bottom="0"
          zIndex="docked"
          overflowY="auto"
          boxShadow="sm"
        >
          <Sidebar onClose={onClose} />
        </Box>

        {/* Mobile Sidebar Drawer */}
        <Box
          display={{ base: 'block', md: 'none' }}
          position="fixed"
          top="16"
          left={isOpen ? '0' : '-100%'}
          bottom="0"
          w="280px"
          bg={bgColor}
          borderRight="1px"
          borderColor={borderColor}
          zIndex="modal"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          overflowY="auto"
          boxShadow="xl"
        >
          <Sidebar onClose={onClose} />
        </Box>

        {/* Mobile Overlay */}
        {isOpen && (
          <Box
            display={{ base: 'block', md: 'none' }}
            position="fixed"
            top="16"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
            zIndex="overlay"
            onClick={onClose}
            transition="opacity 0.3s"
          />
        )}

        {/* Enhanced Main Content */}
        <Box
          as="main"
          flex="1"
          ml={{ base: 0, md: '280px' }}
          transition="all 0.3s"
          minH="calc(100vh - 64px)"
        >
          <Container maxW="7xl" p={{ base: 4, md: 8 }}>
            <Box
              bg={bgColor}
              borderRadius="2xl"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              p={{ base: 6, md: 8 }}
              minH="calc(100vh - 160px)"
              position="relative"
              _hover={{
                boxShadow: 'md',
              }}
              transition="all 0.2s"
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
