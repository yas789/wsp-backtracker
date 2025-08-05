import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Theme configuration for dark mode
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

// Custom color palette
const colors = {
  brand: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: 'lg',
      _focus: {
        boxShadow: '0 0 0 3px rgba(66, 165, 245, 0.15)',
      },
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: 'brand.700',
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
          transform: 'translateY(-1px)',
          boxShadow: 'md',
        },
        _dark: {
          borderColor: 'brand.300',
          color: 'brand.300',
          _hover: {
            bg: 'brand.900',
          },
        },
        transition: 'all 0.2s',
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'sm',
        _hover: {
          boxShadow: 'md',
        },
        transition: 'all 0.2s',
      },
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: 'gray.50',
          _hover: {
            bg: 'gray.100',
          },
          _focus: {
            bg: 'white',
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
          _dark: {
            bg: 'gray.800',
            _hover: {
              bg: 'gray.700',
            },
            _focus: {
              bg: 'gray.900',
            },
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Select: {
    variants: {
      filled: {
        field: {
          bg: 'gray.50',
          _hover: {
            bg: 'gray.100',
          },
          _focus: {
            bg: 'white',
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
          _dark: {
            bg: 'gray.800',
            _hover: {
              bg: 'gray.700',
            },
            _focus: {
              bg: 'gray.900',
            },
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          borderColor: 'gray.200',
          color: 'gray.600',
          fontSize: 'sm',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          _dark: {
            borderColor: 'gray.600',
            color: 'gray.400',
          },
        },
        td: {
          borderColor: 'gray.200',
          _dark: {
            borderColor: 'gray.600',
          },
        },
      },
    },
  },
};

// Global styles
const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      transition: 'background-color 0.2s, color 0.2s',
    },
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: props.colorMode === 'dark' ? 'gray.600 gray.800' : 'gray.400 gray.100',
    },
    '*::-webkit-scrollbar': {
      width: '8px',
    },
    '*::-webkit-scrollbar-track': {
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.100',
    },
    '*::-webkit-scrollbar-thumb': {
      bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.400',
      borderRadius: 'full',
    },
  }),
};

// Font configuration
const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
};

// Shadow configuration
const shadows = {
  outline: '0 0 0 3px rgba(66, 165, 245, 0.15)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

const theme = extendTheme({
  config,
  colors,
  components,
  styles,
  fonts,
  shadows,
  space: {
    '18': '4.5rem',
    '88': '22rem',
  },
  sizes: {
    '18': '4.5rem',
    '88': '22rem',
  },
});

export default theme;
