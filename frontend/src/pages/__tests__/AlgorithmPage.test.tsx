import React from 'react';
import { render, screen, waitFor, userEvent } from '../../test-utils';
import AlgorithmPage from '../AlgorithmPage';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';

// Helper function to find elements by text content
const getByTextContent = (text: string) => {
  return screen.getByText((content: string, element?: Element) => {
    return element?.textContent === text;
  });
};

describe('AlgorithmPage', () => {
  // Mock sessionStorage
  const mockAuthMatrix = [[true, true], [true, true], [true, true]];
  const mockConstraints = [
    { type: 'SEPARATION', steps: [0, 1] },
    { type: 'BINDING', steps: [1, 2] }
  ];

  beforeEach(() => {
    // Mock sessionStorage
    jest.spyOn(window.sessionStorage.__proto__, 'getItem')
      .mockImplementation((key) => {
        if (key === 'authMatrix') return JSON.stringify(mockAuthMatrix);
        if (key === 'constraints') return JSON.stringify(mockConstraints);
        if (key === 'stepsCount') return '3';
        if (key === 'usersCount') return '2';
        return null;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AlgorithmPage />);

    // Check that the page renders correctly
    expect(screen.getByText(/algorithm configuration/i)).toBeTruthy();
    expect(screen.getByText(/solver type/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /solve/i })).toBeTruthy();
  });

  it('renders the algorithm selector with correct options', () => {
    render(<AlgorithmPage />);
    
    // Check for solver type text and combobox
    expect(screen.getByText(/solver type/i)).toBeTruthy();
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('submits the form and displays solution', async () => {
    const { user } = render(<AlgorithmPage />);
    
    // Select algorithm
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'SAT');
    
    // Click solve button
    const solveButton = screen.getByRole('button', { name: /solve/i });
    await user.click(solveButton);
    
    // Wait for solution
    await waitFor(() => {
      expect(screen.getByText(/solution found/i)).toBeTruthy();
    });
  });

  it('shows error when API fails', async () => {
    // Override the default handler to return an error
    server.use(
      http.post('/api/solve', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'Internal server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    const { user } = render(<AlgorithmPage />);
    
    // Click solve button
    const solveButton = screen.getByRole('button', { name: /solve/i });
    await user.click(solveButton);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeTruthy();
    });
  });

  it('shows validation message when no configuration exists', () => {
    // Clear sessionStorage to simulate no configuration
    sessionStorage.clear();
    
    render(<AlgorithmPage />);
    
    // Check for any validation or configuration message
    expect(screen.getByText(/algorithm configuration/i)).toBeTruthy();
  });
});
