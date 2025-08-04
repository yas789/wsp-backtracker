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
  useDisclosure,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Tooltip,
  IconButton,
  Code
} from '@chakra-ui/react';
import { TimeIcon, RepeatIcon, InfoOutlineIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { WSPRequest, WSPResponse } from '../types/wsp';
import { Constraint } from './ConstraintsPage';
import { wspApi } from '../api/wspApi';

type ConstraintType = 'BOD' | 'SOD';

interface Solution {
  assignment: number[]; // Array where index is step and value is assigned user
  solutionFound: boolean;
  solvingTimeMs: number;
  solverUsed: string;
  message: string;
}

const AlgorithmPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('SAT');
  const [availableSolvers, setAvailableSolvers] = useState<string[]>(['SAT', 'CSP', 'BACKTRACKING', 'PBT']);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solution, setSolution] = useState<WSPResponse | null>(null);
  const [executionHistory, setExecutionHistory] = useState<WSPResponse[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  // Load configuration and constraints from session storage
  const wspConfig = JSON.parse(sessionStorage.getItem('wspConfig') || '{}');
  const constraints = JSON.parse(sessionStorage.getItem('wspConstraints') || '[]');
  const authMatrix = JSON.parse(sessionStorage.getItem('authMatrix') || '[]');

  const stepsCount = wspConfig.steps || 0;
  const usersCount = wspConfig.users || 0;

  // Load available solvers on component mount
  useEffect(() => {
    const loadSolvers = async () => {
      try {
        const solvers = await wspApi.getSupportedSolvers();
        setAvailableSolvers(solvers);
        if (solvers.length > 0 && !solvers.includes(selectedAlgorithm)) {
          setSelectedAlgorithm(solvers[0]);
        }
      } catch (error) {
        console.error('Failed to load solvers:', error);
        // Use default solvers if API call fails
        setAvailableSolvers(['SAT', 'CSP', 'BACKTRACKING', 'PBT']);
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

  const solveWSP = async () => {
    setIsSolving(true);
    setSolution(null);

    try {
      // Transform constraints to backend format
      const mustSameConstraints: Array<{step1: number, step2: number}> = [];
      const mustDifferentConstraints: Array<{step1: number, step2: number}> = [];

      console.log('Original constraints:', JSON.stringify(constraints, null, 2));
      
      // Convert frontend constraints to backend format
      constraints.forEach((constraint: Constraint) => {
        if (constraint.steps && constraint.steps.length >= 2) {
          // For each pair of steps in the constraint
          for (let i = 0; i < constraint.steps.length - 1; i++) {
            const step1 = constraint.steps[i];
            const step2 = constraint.steps[i + 1];
            
            // Ensure steps are valid numbers
            if (typeof step1 !== 'number' || typeof step2 !== 'number') {
              console.error('Invalid step values:', { step1, step2, constraint });
              continue;
            }
            
            if (constraint.type === 'BOD') {
              mustSameConstraints.push({ step1, step2 });
            } else if (constraint.type === 'SOD') {
              mustDifferentConstraints.push({ step1, step2 });
            }
          }
        }
      });
      
      console.log('Transformed constraints:', {
        mustSameConstraints,
        mustDifferentConstraints
      });

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
      const response = await wspApi.solveWSP(request);
      
      console.log('Received response:', JSON.stringify(response, null, 2));

      // Update solution and history
      setSolution(response);
      setExecutionHistory(prev => [...prev, response]);

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
      
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'An error occurred while solving the problem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSolving(false);
    }
  };

  const viewSolution = (solutionData: WSPResponse) => {
    setSolution(solutionData);
    onOpen();
  };

  const renderSolutionTable = (solutionData: WSPResponse) => {
    if (!solutionData.solutionFound || !solutionData.assignment || solutionData.assignment.length === 0) {
      return (
        <Alert status="warning">
          <AlertIcon />
          {solutionData.message || 'No assignment data available'}
        </Alert>
      );
    }

    return (
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Step</Th>
            <Th>Assigned User</Th>
          </Tr>
        </Thead>
        <Tbody>
          {solutionData.assignment.map((userId, stepIndex) => (
            <Tr key={stepIndex}>
              <Td>Step {stepIndex}</Td>
              <Td>User {userId}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
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
              >
                <option value="SAT">SAT Solver (Boolean Satisfiability)</option>
                <option value="CSP">CSP Solver (Constraint Satisfaction)</option>
                <option value="BACKTRACKING">Standard Backtracking</option>
                <option value="PBT">Pattern-Based Backtracking</option>
              </Select>
              <Text fontSize="sm" color="gray.500" mt={1}>
                Select the constraint satisfaction algorithm to use
              </Text>
            </Box>

            <HStack spacing={4} mt={4}>
              <Button 
                colorScheme="blue" 
                onClick={solveWSP}
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
                    colorScheme={currentSolution.isComplete ? 'green' : 'yellow'} 
                    fontSize="0.9em"
                  >
                    {currentSolution.isComplete ? 'Complete Solution' : 'Partial Solution'}
                  </Badge>
                  
                  {currentSolution.stats && (
                    <Text fontSize="sm" color="gray.500">
                      {currentSolution.stats.executionTime.toFixed(2)} ms • 
                      {currentSolution.stats.nodesVisited} nodes • 
                      {currentSolution.stats.backtracks} backtracks
                    </Text>
                  )}
                </HStack>
                
                {renderSolutionTable(currentSolution)}
                
                {currentSolution.isComplete ? (
                  <Alert status="success" mt={4} borderRadius="md">
                    <AlertIcon />
                    This is a complete solution that satisfies all constraints.
                  </Alert>
                ) : (
                  <Alert status="warning" mt={4} borderRadius="md">
                    <AlertIcon />
                    This is a partial solution that may not satisfy all constraints.
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
