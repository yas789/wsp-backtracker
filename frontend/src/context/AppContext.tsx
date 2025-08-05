import React, { createContext, useContext, useEffect, useState } from 'react';
import { WSPResponse } from '@/types/wsp';

interface AppState {
  // Configuration
  numSteps: number;
  numUsers: number;
  
  // Authorization matrix
  authMatrix: number[][];
  
  // Constraints
  constraints: Array<{
    id: string;
    type: 'BOD' | 'SOD' | 'binding' | 'separation';
    steps: number[];
  }>;
  
  // Solutions
  solutions: WSPResponse[];
  currentSolution: WSPResponse | null;
  executionHistory: WSPResponse[];
}

interface AppContextType extends AppState {
  setNumSteps: (steps: number) => void;
  setNumUsers: (users: number) => void;
  setAuthMatrix: (matrix: number[][]) => void;
  addConstraint: (constraint: Omit<AppState['constraints'][0], 'id'>) => void;
  removeConstraint: (id: string) => void;
  setSolutions: (solutions: WSPResponse[]) => void;
  setCurrentSolution: (solution: WSPResponse | null) => void;
  addToHistory: (solution: WSPResponse) => void;
  resetState: () => void;
}

const initialState: AppState = {
  numSteps: 4,
  numUsers: 4,
  authMatrix: [],
  constraints: [],
  solutions: [],
  currentSolution: null,
  executionHistory: []
};

const STORAGE_KEY = 'wsp_app_state';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load state from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialState;
    }
    return initialState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setNumSteps = (steps: number) => {
    setState(prev => ({
      ...prev,
      numSteps: steps,
      // Reset auth matrix when steps change
      authMatrix: Array(steps).fill(0).map(() => Array(prev.numUsers).fill(0))
    }));
  };

  const setNumUsers = (users: number) => {
    setState(prev => ({
      ...prev,
      numUsers: users,
      // Reset auth matrix when users change
      authMatrix: prev.authMatrix.map(row => 
        row.length > users ? row.slice(0, users) : [...row, ...Array(users - row.length).fill(0)]
      )
    }));
  };

  const setAuthMatrix = (authMatrix: number[][]) => {
    setState(prev => ({
      ...prev,
      authMatrix
    }));
  };

  const addConstraint = (constraint: Omit<AppState['constraints'][0], 'id'>) => {
    setState(prev => ({
      ...prev,
      constraints: [...prev.constraints, { ...constraint, id: Date.now().toString() }]
    }));
  };

  const removeConstraint = (id: string) => {
    setState(prev => ({
      ...prev,
      constraints: prev.constraints.filter(c => c.id !== id)
    }));
  };

  const setSolutions = (solutions: WSPResponse[]) => {
    setState(prev => ({
      ...prev,
      solutions
    }));
  };

  const setCurrentSolution = (currentSolution: WSPResponse | null) => {
    setState(prev => ({
      ...prev,
      currentSolution
    }));
  };

  const addToHistory = (solution: WSPResponse) => {
    setState(prev => ({
      ...prev,
      executionHistory: [solution, ...prev.executionHistory].slice(0, 100) // Keep last 100 solutions
    }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setNumSteps,
        setNumUsers,
        setAuthMatrix,
        addConstraint,
        removeConstraint,
        setSolutions,
        setCurrentSolution,
        addToHistory,
        resetState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
