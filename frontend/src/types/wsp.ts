export type ConstraintType = 'BOD' | 'SOD' | 'binding' | 'separation';

export interface Constraint {
  type: ConstraintType;
  steps: number[];
}

export interface WSPRequest {
  numSteps: number;
  numUsers: number;
  authorized: number[][];
  mustSameConstraints: Array<{ step1: number; step2: number }>;
  mustDifferentConstraints: Array<{ step1: number; step2: number }>;
  solverType: 'SAT' | 'CSP' | 'BACKTRACKING' | 'PBT';
}

export interface WSPResponse {
  solutionFound: boolean;
  assignment: number[];
  solvingTimeMs: number;
  solverUsed: string;
  message: string;
  timestamp: string;
}
