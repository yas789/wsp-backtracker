import { 
  Box, 
  VStack, 
  Link, 
  Text, 
  useColorModeValue, 
  Icon, 
  Flex,
  useColorMode,
  Divider,
  Tooltip
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiSettings, 
  FiLock, 
  FiLink2, 
  FiCpu,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import ResetButton from '../shared/ResetButton';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'white');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: FiHome },
    { label: 'Configuration', path: '/config', icon: FiSettings },
    { label: 'Authorization', path: '/auth', icon: FiLock },
    { label: 'Constraints', path: '/constraints', icon: FiLink2 },
    { label: 'Solver', path: '/solver', icon: FiCpu },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box
      as="nav"
      w={{ base: '250px', md: '250px' }}
      h={{ base: '100vh', md: 'calc(100vh - 60px)' }}
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      pt={6}
      pb={4}
      overflowY="auto"
      position={{ base: 'relative', md: 'sticky' }}
      top={{ base: 0, md: '60px' }}
      left={0}
      zIndex="docked"
    >
      <VStack align="stretch" spacing={1} px={4}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            as={NavLink}
            to={item.path}
            display="flex"
            alignItems="center"
            p={3}
            borderRadius="md"
            _hover={{ 
              bg: hoverBg, 
              textDecoration: 'none',
              transform: 'translateX(4px)'
            }}
            _activeLink={{
              bg: activeBg,
              color: activeColor,
              fontWeight: 'semibold',
              borderLeft: '4px solid',
              borderLeftColor: 'blue.500',
              pl: '12px',
            }}
            transition="all 0.2s"
            onClick={onClose}
          >
            <Icon as={item.icon} mr={3} fontSize="lg" />
            <Text>{item.label}</Text>
          </Link>
        ))}
      </VStack>

      <Divider my={4} />

      <Box px={4} mt="auto">
        <Tooltip label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`} placement="right">
          <Flex
            as="button"
            align="center"
            w="full"
            p={3}
            borderRadius="md"
            _hover={{ bg: hoverBg }}
            onClick={toggleColorMode}
            transition="all 0.2s"
          >
            <Icon as={colorMode === 'light' ? FiMoon : FiSun} mr={3} fontSize="lg" />
            <Text>{colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}</Text>
          </Flex>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;
