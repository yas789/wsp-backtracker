import { Box, Flex, Heading, IconButton, useColorMode, useColorModeValue, HStack, Button, useBreakpointValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
  onOpen: () => void;
}

const Navbar = ({ onOpen }: NavbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box 
      as="header" 
      bg={bgColor} 
      borderBottom="1px" 
      borderColor={borderColor}
      position="fixed" 
      top="0" 
      left="0" 
      right="0" 
      zIndex="sticky"
      boxShadow="sm"
    >
      <Flex 
        align="center" 
        justify="space-between" 
        h="60px"
        px={{ base: 4, md: 6 }}
        maxW="container.xl" 
        mx="auto"
      >
        <HStack spacing={6}>
          {isMobile && (
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              onClick={onOpen}
              mr={2}
            />
          )}
          <Heading 
            as="h1" 
            size="lg" 
            bgGradient="linear(to-r, blue.500, teal.400)"
            bgClip="text"
            fontWeight="bold"
          >
            WSP Solver
          </Heading>
        </HStack>

        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
            fontSize="lg"
          />
          {!isMobile && (
            <Button 
              as={RouterLink} 
              to="/config" 
              colorScheme="blue" 
              size="sm"
              variant="solid"
            >
              Get Started
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
