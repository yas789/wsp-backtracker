import React from 'react';
import {
  IconButton,
  useColorMode,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<FiMoon />, <FiSun />);
  const label = useColorModeValue('Switch to dark mode', 'Switch to light mode');

  return (
    <Tooltip label={label} placement="bottom">
      <IconButton
        aria-label={label}
        icon={icon}
        onClick={toggleColorMode}
        variant="ghost"
        size="md"
        _hover={{
          bg: useColorModeValue('gray.100', 'gray.700'),
          transform: 'scale(1.05)',
        }}
        _active={{
          transform: 'scale(0.95)',
        }}
        transition="all 0.2s"
      />
    </Tooltip>
  );
};

export default ColorModeToggle;
