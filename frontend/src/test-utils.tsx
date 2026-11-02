import { ReactElement, ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <AppProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </AppProvider>
    </ChakraProvider>
  );
}

export function render(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, { wrapper: AllTheProviders }),
  };
}

export * from '@testing-library/react';
