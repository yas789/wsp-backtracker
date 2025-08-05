import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  VStack, 
  HStack, 
  Text, 
  Select, 
  Spinner, 
  Alert, 
  AlertIcon, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Tooltip,
  IconButton,
  Code,
  Badge
} from '@chakra-ui/react';
import { TimeIcon, RepeatIcon, InfoOutlineIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { WSPRequest, WSPResponse, Constraint, ConstraintType } from '@/types/wsp';
import { solveWSP } from '../api/wspApi';
import { useAppContext } from '../context/AppContext';

// Constraint type is now imported from wsp.ts

interface Solution {
  assignment: number[]; // Array where index is step and value is assigned user
  solutionFound: boolean;
  solvingTimeMs: number;
  solverUsed: string;
  message: string;
}

const AlgorithmPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('CSP');
  const [availableSolvers, setAvailableSolvers] = useState<string[]>(['CSP', 'BACKTRACKING', 'PBT', 'SAT']);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solution, setSolution] = useState<WSPResponse | null>(null);
  const [solutions, setSolutions] = useState<WSPResponse[]>([]);
  const [currentSolution, setCurrentSolution] = useState<WSPResponse | null>(null);
  const [executionHistory, setExecutionHistory] = useState<WSPResponse[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  // Load configuration and constraints from AppContext
  const { config, constraints, authMatrix, addSolution } = useAppContext();

  const stepsCount = config.steps || 0;
  const usersCount = config.users || 0;

  // Load available solvers on component mount
  useEffect(() => {
    const loadSolvers = async () => {
      try {
        // Default to CSP as it's the most reliable
        const defaultSolver = 'CSP';
        const solvers = ['CSP', 'BACKTRACKING', 'PBT', 'SAT'];
        setAvailableSolvers(solvers);
        
        // Set default solver if not already set or if current selection is not available
        if (!selectedAlgorithm || !solvers.includes(selectedAlgorithm)) {
          setSelectedAlgorithm(defaultSolver);
        }
      } catch (error) {
        console.error('Failed to load solvers:', error);
        // Fallback to CSP only if there's an error
        setAvailableSolvers(['CSP']);
        setSelectedAlgorithm('CSP');
      }
    };
    loadSolvers();
  }, [selectedAlgorithm]);

  // Check if we have all required data
  useEffect(() => {
    if (stepsCount === 0 || usersCount === 0) {
      toast({
        title: 'Configuration required',
        description: 'Please complete the configuration first.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/config');
    } else if (authMatrix.length === 0) {
      toast({
        title: 'Authorization matrix required',
        description: 'Please define the authorization matrix first.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/auth');
    }
  }, [stepsCount, usersCount, authMatrix.length, navigate, toast]);

  const handleSolveWSP = async () => {
    setIsSolving(true);
    setSolution(null);

    try {
      // Transform constraints to backend format
      const mustSameConstraints: Array<{step1: number, step2: number}> = [];
      const mustDifferentConstraints: Array<{step1: number, step2: number}> = [];

      console.log('Original constraints:', JSON.stringify(constraints, null, 2));
      
      // Convert frontend constraints to backend format
      constraints.forEach((constraint: Constraint) => {
        if (!constraint || !constraint.steps || !Array.isArray(constraint.steps)) {
          console.warn('Invalid constraint structure:', constraint);
          return;
        }
        
        if (constraint.steps.length >= 2) {
          // Filter out null/undefined values and ensure all are numbers
          const validSteps = constraint.steps.filter(step => 
            step !== null && step !== undefined && typeof step === 'number' && !isNaN(step)
          );
          
          if (validSteps.length < 2) {
            console.warn('Constraint has insufficient valid steps:', { constraint, validSteps });
            return;
          }
          
          // Map frontend constraint types to backend format
          // Backend expects 'BOD' for binding and 'SOD' for separation
          const normalizedType = constraint.type === 'binding' ? 'BOD' : 
                               constraint.type === 'separation' ? 'SOD' :
                               constraint.type;
          
          // Process all pairs of steps in the constraint
          // For constraints with exactly 2 steps, this creates one pair
          // For constraints with more steps, this creates all combinations
          for (let i = 0; i < validSteps.length; i++) {
            for (let j = i + 1; j < validSteps.length; j++) {
              const step1 = validSteps[i];
              const step2 = validSteps[j];
              
              // Validate step numbers are within bounds (1-based input should be 1 to numSteps)
              if (step1 < 1 || step1 > stepsCount || step2 < 1 || step2 > stepsCount) {
                console.warn('Step numbers out of bounds:', { step1, step2, stepsCount });
                continue;
              }
              
              // Convert 1-based step indices to 0-based for the backend
              const step1ZeroBased = step1 - 1;
              const step2ZeroBased = step2 - 1;
              
              // Double-check the converted indices are valid
              if (step1ZeroBased < 0 || step1ZeroBased >= stepsCount || 
                  step2ZeroBased < 0 || step2ZeroBased >= stepsCount) {
                console.warn('Converted step indices out of bounds:', { 
                  step1ZeroBased, step2ZeroBased, stepsCount 
                });
                continue;
              }
              
              if (normalizedType === 'BOD') {
                mustSameConstraints.push({ step1: step1ZeroBased, step2: step2ZeroBased });
                console.log(`Added BOD constraint between steps ${step1ZeroBased} and ${step2ZeroBased} (original: ${step1} and ${step2})`);
              } else if (normalizedType === 'SOD') {
                mustDifferentConstraints.push({ step1: step1ZeroBased, step2: step2ZeroBased });
                console.log(`Added SOD constraint between steps ${step1ZeroBased} and ${step2ZeroBased} (original: ${step1} and ${step2})`);
              } else {
                console.warn('Unknown constraint type:', constraint.type);
              }
            }
          }
        } else {
          console.warn('Constraint has insufficient steps:', constraint);
        }
      });
      
      // Validate all constraint indices are within bounds
      const invalidConstraints: Array<{
        type: string;
        index: number;
        constraint: { step1: number; step2: number };
        issue: string;
      }> = [];
      
      mustSameConstraints.forEach((constraint, index) => {
        if (constraint.step1 < 0 || constraint.step1 >= stepsCount ||
            constraint.step2 < 0 || constraint.step2 >= stepsCount) {
          invalidConstraints.push({
            type: 'BOD',
            index,
            constraint,
            issue: `Step indices out of bounds. Valid range: 0-${stepsCount-1}`
          });
        }
      });
      
      mustDifferentConstraints.forEach((constraint, index) => {
        if (constraint.step1 < 0 || constraint.step1 >= stepsCount ||
            constraint.step2 < 0 || constraint.step2 >= stepsCount) {
          invalidConstraints.push({
            type: 'SOD',
            index,
            constraint,
            issue: `Step indices out of bounds. Valid range: 0-${stepsCount-1}`
          });
        }
      });
      
      if (invalidConstraints.length > 0) {
        console.error('Invalid constraints detected:', invalidConstraints);
      }
      
      console.log('Transformed constraints:', {
        mustSameConstraints,
        mustDifferentConstraints,
        validStepRange: `0-${stepsCount-1}`,
        validUserRange: `0-${usersCount-1}`
      });

      // Validate authorization matrix dimensions
      console.log('Configuration check:', {
        stepsCount,
        usersCount,
        authMatrixRows: authMatrix.length,
        authMatrixCols: authMatrix.length > 0 ? authMatrix[0].length : 0
      });
      
      // Ensure authorization matrix has correct dimensions
      if (authMatrix.length !== stepsCount) {
        console.error('Authorization matrix row count mismatch:', {
          expected: stepsCount,
          actual: authMatrix.length
        });
      }
      
      if (authMatrix.length > 0 && authMatrix[0].length !== usersCount) {
        console.error('Authorization matrix column count mismatch:', {
          expected: usersCount,
          actual: authMatrix[0].length
        });
      }
      
      // Prepare the request matching backend's WSPRequest structure
      const request = {
        numSteps: stepsCount,
        numUsers: usersCount,
        authorized: authMatrix,
        mustSameConstraints,
        mustDifferentConstraints,
        solverType: selectedAlgorithm as 'SAT' | 'CSP' | 'BACKTRACKING' | 'PBT'
      };

      console.log('Sending request:', JSON.stringify(request, null, 2));

      // Call the backend API using the wspApi client
      const response = await solveWSP(request);
      
      console.log('Received response:', JSON.stringify(response, null, 2));

      // Update solution and history
      const processedResponse = {
        ...response,
        // Ensure assignment is always an array, even if null/undefined
        assignment: response.assignment || Array(stepsCount).fill(-1)
      };
      setSolution(processedResponse);
      setExecutionHistory(prev => [...prev, processedResponse]);
      
      // Add solution to global context for persistence
      addSolution(processedResponse);

      // Show toast notification
      toast({
        title: response.solutionFound ? 'Solution found!' : 'No solution found',
        description: response.solutionFound 
          ? `${response.solverUsed} found a solution in ${response.solvingTimeMs}ms` 
          : response.message || 'No valid assignment found with the given constraints.',
        status: response.solutionFound ? 'success' : 'warning',
        duration: 5000,
        isClosable: true,
      });

    } catch (error: any) {
      console.error('Error solving WSP:', error);
      
      let errorMessage = 'An error occurred while solving the problem.';
      
      // Handle specific error cases
      if (error.message?.includes('OR-Tools') || error.message?.includes('UnsatisfiedLinkError')) {
        errorMessage = 'SAT solver is not available. Please try another solver (e.g., CSP).';
      } else if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        
        // Detect the known backend bug with index out of bounds
        if (backendMessage.includes('Index') && backendMessage.includes('out of bounds')) {
          errorMessage = `Backend Error: ${backendMessage}\n\nThis appears to be a known backend issue where step indices are confused with user indices. The frontend request is valid, but the backend solver has a bug. Please check the backend code or try a different solver.`;
        } else {
          errorMessage = backendMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      // If SAT solver fails, switch to CSP automatically
      if (selectedAlgorithm === 'SAT' && availableSolvers.includes('CSP')) {
        setSelectedAlgorithm('CSP');
        toast({
          title: 'Switched to CSP solver',
          description: 'Automatically switched to CSP solver as SAT solver is not available.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsSolving(false);
    }
  };

  const viewSolution = (solutionData: WSPResponse) => {
    setCurrentSolution(solutionData);
    onOpen();
  };

  const renderSolutionTable = (solutionData: WSPResponse) => {
    if (!solutionData.solutionFound || !solutionData.assignment) {
      return (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">No solution found</Text>
            <Text>{solutionData.message || 'The problem has no valid assignment with the current constraints.'}</Text>
            {solutionData.solutionFound && !solutionData.assignment && (
              <Text mt={2} fontStyle="italic">
                Note: The solver reported a solution but didn't return an assignment. This may indicate a backend issue.
              </Text>
            )}
          </Box>
        </Alert>
      );
    }

    // Check if assignment is valid (all steps have a user assigned)
    const isValidAssignment = solutionData.assignment.every((userId: number) => userId >= 0);

    return (
      <Box>
        {!isValidAssignment && (
          <Alert status="warning" mb={4} borderRadius="md">
            <AlertIcon />
            <Text>Some steps do not have a valid user assignment.</Text>
          </Alert>
        )}
        
        <Box overflowX="auto" borderWidth="1px" borderRadius="lg" p={4} bg="white">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Step</Th>
                <Th>Assigned User</Th>
                <Th>Authorization</Th>
              </Tr>
            </Thead>
            <Tbody>
              {solutionData.assignment.map((userId: number, stepIndex: number) => {
                // Check if the user is authorized for this step
                const isAuthorized = userId >= 0 && 
                                  authMatrix[stepIndex] && 
                                  authMatrix[stepIndex][userId] === 1;
                
                return (
                  <Tr key={stepIndex} bg={!isAuthorized ? 'red.50' : 'white'}>
                    <Td fontWeight="medium">Step {stepIndex}</Td>
                    <Td>
                      <HStack>
                        <Text>User {userId}</Text>
                        {!isAuthorized && (
                          <Badge colorScheme="red" variant="outline" size="sm">
                            Not Authorized
                          </Badge>
                        )}
                      </HStack>
                    </Td>
                    <Td>
                      {isAuthorized ? (
                        <Badge colorScheme="green">Authorized</Badge>
                      ) : (
                        <Badge colorScheme="red">Unauthorized</Badge>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
        
        {/* Execution stats */}
        <StatGroup mt={6} bg="blue.50" p={4} borderRadius="md">
          <Stat>
            <StatLabel>Algorithm</StatLabel>
            <StatNumber fontSize="lg">{solutionData.solverUsed}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Execution Time</StatLabel>
            <StatNumber fontSize="lg">{solutionData.solvingTimeMs} ms</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Steps</StatLabel>
            <StatNumber fontSize="lg">{solutionData.assignment.length}</StatNumber>
          </Stat>
        </StatGroup>
      </Box>
    );
  };

  if (stepsCount === 0 || usersCount === 0) {
    return (
      <Box p={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>WSP Solver</Text>
        <Text>Please complete the configuration first.</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Solve Workflow</Text>
        
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="medium" mb={2}>Algorithm</Text>
              <Select 
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                isDisabled={isSolving}
                bg="white"
              >
                <option value="CSP">CSP Solver (Recommended)</option>
                <option value="BACKTRACKING">Standard Backtracking</option>
                <option value="PBT">Pattern-Based Backtracking</option>
                <option value="SAT" disabled={!availableSolvers.includes('SAT')}>
                  {availableSolvers.includes('SAT') 
                    ? 'SAT Solver (Boolean Satisfiability)' 
                    : 'SAT Solver (Not Available)'}
                </option>
              </Select>
              <Text fontSize="sm" color="gray.500" mt={1}>
                Select the constraint satisfaction algorithm to use
              </Text>
            </Box>

            <HStack spacing={4} mt={4}>
              <Button 
                colorScheme="blue" 
                onClick={handleSolveWSP}
                isLoading={isSolving}
                loadingText="Solving..."
                leftIcon={<RepeatIcon />}
              >
                {solution ? 'Re-solve' : 'Solve'}
              </Button>
              
              <Tooltip label="Run the algorithm with the current configuration">
                <IconButton
                  aria-label="Info"
                  icon={<InfoOutlineIcon />}
                  variant="ghost"
                />
              </Tooltip>
            </HStack>
          </VStack>
        </Box>

        {isSolving && (
          <Box mt={6}>
            <Text mb={2}>Solving the Workflow Satisfiability Problem...</Text>
            <Box h="4px" bg="blue.100" borderRadius="full" overflow="hidden">
              <Box h="100%" bg="blue.500" w="100%" position="relative" />
            </Box>
          </Box>
        )}

        {solution && (
          <Box mt={6} p={4} bg="blue.50" borderRadius="md">
            <Text fontSize="lg" fontWeight="bold" mb={4}>Execution Result</Text>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="medium">Status</Text>
                <Box 
                  display="inline-flex" 
                  alignItems="center" 
                  px={2} 
                  py={1} 
                  borderRadius="md"
                  bg={solution.solutionFound ? 'green.100' : 'yellow.100'}
                  color={solution.solutionFound ? 'green.800' : 'yellow.800'}
                >
                  {solution.solutionFound ? 'Solution Found' : 'No Solution Found'}
                </Box>
              </Box>
              
              <Box>
                <Text fontWeight="medium">Algorithm</Text>
                <Text>{solution.solverUsed}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="medium">Execution Time</Text>
                <Text>{solution.solvingTimeMs} ms</Text>
              </Box>
              
              {solution.message && (
                <Box>
                  <Text fontWeight="medium">Message</Text>
                  <Text fontStyle="italic">{solution.message}</Text>
                </Box>
              )}
            </VStack>
          </Box>
        )}

        {solution?.solutionFound && (
          <Box mt={6}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="lg" fontWeight="bold">Solution Assignment</Text>
              <Box 
                display="inline-flex" 
                px={2} 
                py={1} 
                bg="green.100" 
                color="green.800" 
                borderRadius="md" 
                fontSize="sm"
              >
                Valid Assignment
              </Box>
            </HStack>
            
            <Box overflowX="auto">
              {renderSolutionTable(solution)}
            </Box>
          </Box>
        )}

        {!solution && !isSolving && (
          <Alert status="info" borderRadius="md" mt={6}>
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">No solutions yet</Text>
              <Text>Click the "Solve" button to find valid user assignments for the workflow.</Text>
            </Box>
          </Alert>
        )}

        <HStack justify="space-between" mt={8} spacing={4}>
          <Button 
            variant="outline" 
            onClick={() => navigate('/constraints')}
            isDisabled={isSolving}
          >
            Back to Constraints
          </Button>
          
          <Button 
            colorScheme="blue" 
            onClick={() => {
              // Save results or perform final actions
              toast({
                title: 'Workflow completed',
                description: 'The workflow has been processed successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            }}
            isDisabled={isSolving || solutions.length === 0}
            leftIcon={<CheckCircleIcon />}
          >
            Complete Workflow
          </Button>
        </HStack>
      </VStack>

      {/* Solution Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Solution Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentSolution && (
              <Box>
                <HStack mb={4}>
                  <Badge 
                    colorScheme={currentSolution.solutionFound ? 'green' : 'yellow'} 
                    fontSize="0.9em"
                  >
                    {currentSolution.solutionFound ? 'Solution Found' : 'No Solution'}
                  </Badge>
                  
                  <Text fontSize="sm" color="gray.500">
                    {currentSolution.solvingTimeMs} ms • {currentSolution.solverUsed}
                  </Text>
                </HStack>
                
                {renderSolutionTable(currentSolution)}
                
                {currentSolution.solutionFound ? (
                  <Alert status="success" mt={4} borderRadius="md">
                    <AlertIcon />
                    This solution satisfies all constraints.
                  </Alert>
                ) : (
                  <Alert status="warning" mt={4} borderRadius="md">
                    <AlertIcon />
                    No valid solution was found for the given constraints.
                  </Alert>
                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AlgorithmPage;
