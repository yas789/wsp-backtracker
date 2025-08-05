import React, { useState } from 'react';
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
  useDisclosure,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Tooltip,
  IconButton,
  Badge,
  Code
} from '@chakra-ui/react';
import { TimeIcon, RepeatIcon, InfoOutlineIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { WSPRequest, WSPResponse } from '@/types/wsp';
import { solveWSP } from '@/api/wspApi';
import { useAppState } from '@/context/AppContext';

const AlgorithmPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  
  const {
    numSteps,
    numUsers,
    authMatrix,
    constraints,
    solutions,
    currentSolution,
    executionHistory,
    setSolutions,
    setCurrentSolution,
    addToHistory,
  } = useAppState();

  const [solver, setSolver] = useState<'SAT' | 'CSP' | 'BACKTRACKING' | 'PBT'>('SAT');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSolveWSP = async () => {
    if (numSteps <= 0 || numUsers <= 0) {
      toast({
        title: 'Error',
        description: 'Number of steps and users must be greater than 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check if authorization matrix is properly initialized
    if (authMatrix.length === 0 || authMatrix.some(row => row.length !== numSteps)) {
      toast({
        title: 'Error',
        description: 'Please set up the authorization matrix first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Navigate to authorization page
      navigate('/authorization');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare the request payload
      const request: WSPRequest = {
        numSteps,
        numUsers,
        authorized: authMatrix,
        mustSameConstraints: [],
        mustDifferentConstraints: [],
        solverType: solver
      };

      // Process constraints
      constraints.forEach(constraint => {
        const validSteps = constraint.steps.filter(step => 
          typeof step === 'number' && !isNaN(step) && step >= 1 && step <= numSteps
        );

        if (validSteps.length >= 2) {
          // For each pair of steps in the constraint
          for (let i = 0; i < validSteps.length - 1; i++) {
            const step1 = validSteps[i];
            const step2 = validSteps[i + 1];
            
            // Double-check step validity (should be redundant after filtering)
            if (typeof step1 !== 'number' || typeof step2 !== 'number' || 
                isNaN(step1) || isNaN(step2) || step1 < 0 || step2 < 0) {
              console.warn('Skipping invalid step pair:', { step1, step2, constraint });
              continue;
            }
            
            // Map frontend constraint types to backend format
            // Backend expects 'BOD' for binding and 'SOD' for separation
            const normalizedType = constraint.type === 'binding' ? 'BOD' : 
                                 constraint.type === 'separation' ? 'SOD' :
                                 constraint.type;
            
            // Convert 1-based step indices to 0-based for the backend
            const step1ZeroBased = step1 - 1;
            const step2ZeroBased = step2 - 1;
            
            if (normalizedType === 'BOD') {
              request.mustSameConstraints.push({ step1: step1ZeroBased, step2: step2ZeroBased });
              console.log('Added BOD constraint between steps', step1ZeroBased, 'and', step2ZeroBased);
            } else if (normalizedType === 'SOD') {
              request.mustDifferentConstraints.push({ step1: step1ZeroBased, step2: step2ZeroBased });
              console.log('Added SOD constraint between steps', step1ZeroBased, 'and', step2ZeroBased);
            } else {
              console.warn('Unknown constraint type:', constraint.type);
            }
          }
        } else {
          console.warn('Constraint has insufficient steps:', constraint);
        }
      });

      console.log('Sending request:', JSON.stringify(request, null, 2));
      const response = await solveWSP(request);
      console.log('Received response:', response);

      // Update state with the new solution using context
      const newSolution: WSPResponse = {
        ...response,
        timestamp: new Date().toISOString()
      };
      setSolutions([...solutions, newSolution]);
      setCurrentSolution(newSolution);
      addToHistory(newSolution);

      toast({
        title: newSolution.solutionFound ? 'Solution Found!' : 'No Solution Found',
        status: newSolution.solutionFound ? 'success' : 'warning',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error solving WSP:', error);
      toast({
        title: 'Error',
        description: 'Failed to solve WSP. Please check the console for details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset the solution state
    setSolutions([]);
    setCurrentSolution(null);
  };

  const formatTime = (ms: number) => {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justifyContent="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">WSP Solver</Text>
          <HStack>
            <Select 
              value={solver} 
              onChange={(e) => setSolver(e.target.value as 'SAT' | 'CSP' | 'BACKTRACKING' | 'PBT')}
              width="200px"
            >
              <option value="SAT">SAT Solver</option>
              <option value="CSP">CSP Solver</option>
              <option value="BACKTRACKING">Backtracking</option>
              <option value="PBT">PBT Solver</option>
            </Select>
            <Button 
              colorScheme="blue" 
              onClick={handleSolveWSP}
              isLoading={isLoading}
              loadingText="Solving..."
              leftIcon={<RepeatIcon />}
            >
              Solve
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              isDisabled={isLoading}
            >
              Reset
            </Button>
          </HStack>
        </HStack>

        {isLoading && (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" />
            <Text mt={4}>Solving the WSP problem. This may take a moment...</Text>
          </Box>
        )}

        {!isLoading && currentSolution && (
          <Box>
            <Alert status={currentSolution.solutionFound ? 'success' : 'warning'} mb={4}>
              <AlertIcon />
              {currentSolution.solutionFound 
                ? 'Solution found successfully!'
                : 'No solution found for the given constraints.'}
            </Alert>

            <StatGroup mb={6}>
              <Stat>
                <StatLabel>Solver Used</StatLabel>
                <StatNumber>{currentSolution.solverUsed}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Solving Time</StatLabel>
                <StatNumber>{formatTime(currentSolution.solvingTimeMs)}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Status</StatLabel>
                <StatNumber>
                  <Badge colorScheme={currentSolution.solutionFound ? 'green' : 'red'} fontSize="md">
                    {currentSolution.solutionFound ? 'Solved' : 'No Solution'}
                  </Badge>
                </StatNumber>
              </Stat>
            </StatGroup>

            {currentSolution.solutionFound && currentSolution.assignment && (
              <Box mb={6}>
                <Text fontSize="lg" fontWeight="bold" mb={2}>Assignment:</Text>
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Step</Th>
                        {Array.from({ length: numSteps }, (_, i) => (
                          <Th key={i} textAlign="center">{i + 1}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td fontWeight="bold">User</Td>
                        {currentSolution.assignment.map((user, idx) => (
                          <Td key={idx} textAlign="center">
                            {user >= 0 ? user + 1 : '-'}
                          </Td>
                        ))}
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {!isLoading && !currentSolution && solutions.length === 0 && (
          <Alert status="info" variant="left-accent">
            <AlertIcon />
            No solution has been calculated yet. Click the "Solve" button to find a solution.
          </Alert>
        )}

        {executionHistory.length > 0 && (
          <Box mt={8}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              <TimeIcon mr={2} /> Execution History
            </Text>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Solver</Th>
                    <Th>Status</Th>
                    <Th>Time</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {executionHistory.map((sol, idx) => (
                    <Tr key={idx}>
                      <Td>{executionHistory.length - idx}</Td>
                      <Td>{sol.solverUsed}</Td>
                      <Td>
                        <Badge colorScheme={sol.solutionFound ? 'green' : 'red'}>
                          {sol.solutionFound ? 'Solved' : 'Failed'}
                        </Badge>
                      </Td>
                      <Td>{formatTime(sol.solvingTimeMs)}</Td>
                      <Td>
                        <Tooltip label="View details">
                          <IconButton
                            aria-label="View solution details"
                            icon={<InfoOutlineIcon />}
                            size="sm"
                            variant="ghost"
                            onClick={() => setCurrentSolution(sol)}
                          />
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}
      </VStack>

      {/* Constraints Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Constraints</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {constraints.length === 0 ? (
              <Text>No constraints defined yet.</Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                {constraints.map((constraint, idx) => (
                  <Box key={idx} p={3} borderWidth="1px" borderRadius="md">
                    <HStack justify="space-between">
                      <Text>
                        <Badge colorScheme={constraint.type === 'binding' ? 'blue' : 'pink'} mr={2}>
                          {constraint.type.toUpperCase()}
                        </Badge>
                        Steps: {constraint.steps.join(', ')}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AlgorithmPage;
