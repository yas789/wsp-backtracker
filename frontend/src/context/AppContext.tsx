import React, { createContext, useContext, useEffect, useState } from 'react';
import { Constraint } from '../types/wsp';

interface AppState {
  config: { steps: number; users: number };
  constraints: Constraint[];
  authMatrix: number[][];
  solutions: any[]; // Store solution history
}

interface AppContextType extends AppState {
  setConfig: (config: { steps: number; users: number }) => void;
  setConstraints: (constraints: Constraint[]) => void;
  setAuthMatrix: (matrix: number[][]) => void;
  setSolutions: (solutions: any[]) => void;
  addSolution: (solution: any) => void;
  clearAll: () => void;
  clearSolutions: () => void;
}

const defaultState: AppState = {
  config: { steps: 0, users: 0 },
  constraints: [],
  authMatrix: [],
  solutions: []
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Initialize from localStorage or use defaults
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wspAppState');
        return saved ? JSON.parse(saved) : defaultState;
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
        return defaultState;
      }
    }
    return defaultState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('wspAppState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state to localStorage:', error);
      }
    }
  }, [state]);

  // Migration from sessionStorage on first load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if we have sessionStorage data but no localStorage data
    const hasSessionData = sessionStorage.getItem('wspConfig') || 
                          sessionStorage.getItem('wspConstraints') || 
                          sessionStorage.getItem('authMatrix');
    
    const hasLocalData = localStorage.getItem('wspAppState');

    if (hasSessionData && !hasLocalData) {
      console.log('Migrating data from sessionStorage to localStorage...');
      
      try {
        const migratedState = {
          config: JSON.parse(sessionStorage.getItem('wspConfig') || '{"steps": 0, "users": 0}'),
          constraints: JSON.parse(sessionStorage.getItem('wspConstraints') || '[]'),
          authMatrix: JSON.parse(sessionStorage.getItem('authMatrix') || '[]'),
          solutions: []
        };
        
        setState(migratedState);
        
        // Clear session storage after migration
        sessionStorage.removeItem('wspConfig');
        sessionStorage.removeItem('wspConstraints');
        sessionStorage.removeItem('authMatrix');
        
        console.log('Migration completed successfully');
      } catch (error) {
        console.error('Error during migration:', error);
      }
    }
  }, []);

  const setConfig = (config: { steps: number; users: number }) => 
    setState(prev => ({ ...prev, config }));

  const setConstraints = (constraints: Constraint[]) => 
    setState(prev => ({ ...prev, constraints }));

  const setAuthMatrix = (authMatrix: number[][]) => 
    setState(prev => ({ ...prev, authMatrix }));

  const setSolutions = (solutions: any[]) => 
    setState(prev => ({ ...prev, solutions }));

  const addSolution = (solution: any) => 
    setState(prev => ({ 
      ...prev, 
      solutions: [...prev.solutions, { ...solution, timestamp: new Date().toISOString() }] 
    }));

  const clearSolutions = () => 
    setState(prev => ({ ...prev, solutions: [] }));

  const clearAll = () => {
    setState(defaultState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wspAppState');
      // Also clear any remaining sessionStorage items
      sessionStorage.removeItem('wspConfig');
      sessionStorage.removeItem('wspConstraints');
      sessionStorage.removeItem('authMatrix');
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setConfig,
        setConstraints,
        setAuthMatrix,
        setSolutions,
        addSolution,
        clearAll,
        clearSolutions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
