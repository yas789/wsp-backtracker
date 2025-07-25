import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      'html, body': {
        height: '100%',
        backgroundColor: 'gray.50',
      },
      '#root': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
});

export default theme;
