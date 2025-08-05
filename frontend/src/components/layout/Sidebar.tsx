import React from 'react';
import {
  Box,
  VStack,
  Link,
  Text,
  Icon,
  useColorModeValue,
  Flex,
  Divider,
  Button,
  IconButton,
  HStack,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiSettings,
  FiUsers,
  FiLock,
  FiCpu,
  FiSun,
  FiMoon,
  FiX,
} from 'react-icons/fi';
import { useColorMode } from '@chakra-ui/react';
import { useAppContext } from '../../context/AppContext';
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
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'Configuration', href: '/config', icon: FiSettings },
    { name: 'Authorization', href: '/auth', icon: FiUsers },
    { name: 'Constraints', href: '/constraints', icon: FiLock },
    { name: 'Algorithm', href: '/solver', icon: FiCpu },
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
        {navItems.map((item) => {
          const active = isActive(item.href);
          const getStatusBadge = () => {
            if (item.href === '/config' && status.config) return 'green';
            if (item.href === '/auth' && status.auth) return 'green';
            if (item.href === '/constraints' && status.constraints) return 'green';
            return undefined;
          };

          return (
            <Link
              key={item.href}
              as={RouterLink}
              to={item.href}
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
              onClick={onClose}
            >
              <Flex
                align="center"
                justify="space-between"
                p={4}
                rounded="xl"
                cursor="pointer"
                bg={active ? activeBg : 'transparent'}
                color={active ? activeColor : 'inherit'}
                _hover={{
                  bg: hoverBg,
                  transform: 'translateX(4px)',
                  boxShadow: 'sm',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                border="1px"
                borderColor={active ? 'brand.200' : 'transparent'}
                position="relative"
                _before={active ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  bg: 'brand.500',
                  borderRadius: 'full',
                } : {}}
              >
                <HStack spacing={3}>
                  <Icon as={item.icon} boxSize={5} />
                  <Text fontWeight={active ? '600' : '500'} fontSize="sm">
                    {item.name}
                  </Text>
                </HStack>
                {getStatusBadge() && (
                  <Badge
                    colorScheme={getStatusBadge()}
                    size="sm"
                    borderRadius="full"
                    px={2}
                  >
                    ✓
                  </Badge>
                )}
              </Flex>
            </Link>
          );
        })}
      </VStack>

      <Divider my={4} />

      <Box px={4} mt="auto">
        {/* Reset Button */}
        <Box mb={3}>
          <ResetButton size="sm" variant="outline" colorScheme="red" />
        </Box>
        
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
