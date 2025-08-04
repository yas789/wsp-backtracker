import { render as rtlRender } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { ReactElement, ReactNode } from 'react';
import userEvent from '@testing-library/user-event';

// Custom screen implementation for @testing-library/react v16.3.0
const screen = {
  getByText: (text: string | RegExp | ((content: string, element?: Element) => boolean)) => {
    if (typeof text === 'string') {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.find(el => el.textContent?.includes(text)) as HTMLElement | null;
    } else if (text instanceof RegExp) {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.find(el => text.test(el.textContent || '')) as HTMLElement | null;
    } else if (typeof text === 'function') {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.find(el => text(el.textContent || '', el)) as HTMLElement | null;
    }
    return null;
  },
  getByLabelText: (text: string) => {
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(el => el.textContent === text);
    return label ? document.getElementById(label.getAttribute('for') || '') : null;
  },
  getByRole: (role: string, options?: { name?: string | RegExp }) => {
    let selector = `[role="${role}"]`;
    if (options?.name) {
      if (typeof options.name === 'string') {
        selector += `[aria-label*="${options.name}"]`;
      } else if (options.name instanceof RegExp) {
        const elements = Array.from(document.querySelectorAll(`[role="${role}"]`));
        return elements.find(el => {
          const ariaLabel = el.getAttribute('aria-label') || el.textContent || '';
          return options.name instanceof RegExp && options.name.test(ariaLabel);
        }) as HTMLElement;
      }
    }
    return document.querySelector(selector) as HTMLElement;
  },
  getAllByRole: (role: string) => {
    return Array.from(document.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
  },
  queryByText: (text: string | RegExp) => {
    if (typeof text === 'string') {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.find(el => el.textContent?.includes(text)) as HTMLElement | null;
    } else if (text instanceof RegExp) {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.find(el => text.test(el.textContent || '')) as HTMLElement | null;
    }
    return null;
  }
};

// Custom waitFor implementation for @testing-library/react v16.3.0
function waitFor<T>(
  callback: () => T | Promise<T>,
  options: { timeout?: number; interval?: number } = {}
): Promise<T> {
  const { timeout = 1000, interval = 50 } = options;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const result = await callback();
        resolve(result);
      } catch (err) {
        if (Date.now() - startTime > timeout) {
          reject(new Error(`waitFor timed out after ${timeout}ms: ${err}`));
        } else {
          setTimeout(check, interval);
        }
      }
    };
    check();
  });
}

// Wrapper component that includes all necessary providers
function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </ChakraProvider>
  );
}

// Custom render function that includes all providers
function customRender(
  ui: ReactElement,
  options: any = {}
) {
  const utils = rtlRender(ui, { 
    wrapper: AllTheProviders, 
    ...options 
  });
  
  return {
    ...utils,
    user: userEvent,
  };
}

// Export our custom utilities
export { 
  customRender as render,
  screen,
  waitFor,
  userEvent 
};
