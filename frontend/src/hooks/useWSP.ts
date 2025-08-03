import { useState, useCallback } from 'react';
import { wspApi, WSPRequest, WSPSolution } from '@/services/api';

interface UseWSPReturn {
  solution: WSPSolution | null;
  isLoading: boolean;
  error: string | null;
  solveWSP: (request: WSPRequest) => Promise<void>;
  reset: () => void;
}

export const useWSP = (): UseWSPReturn => {
  const [solution, setSolution] = useState<WSPSolution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const solveWSP = useCallback(async (request: WSPRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await wspApi.solveWSP(request);
      setSolution(result);
    } catch (err: unknown) {
      console.error('Error solving WSP:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to solve the workflow satisfiability problem. Please try again.';
      setError(errorMessage || 'An unknown error occurred');
      setSolution(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSolution(null);
    setError(null);
  }, []);

  return {
    solution,
    isLoading,
    error,
    solveWSP,
    reset,
  };
};

export default useWSP;
