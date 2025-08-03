import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Button, 
  Select, 
  useToast, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Code, 
  Badge, 
  Progress, 
  Alert, 
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  IconButton,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  SimpleGrid
} from '@chakra-ui/react';
import { RepeatIcon, InfoOutlineIcon, CheckCircleIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';
import apiClient from '../services/api';
import { Constraint } from './ConstraintsPage';

interface Solution {
  assignment: Record<number, number>; // step -> user
  isComplete: boolean;
  stats?: {
    executionTime: number;
    nodesVisited: number;
    backtracks: number;
  };
}

const AlgorithmPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('backtracking');
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
  const [executionStats, setExecutionStats] = useState<{
    totalTime: number;
    totalSolutions: number;
    averageTime: number;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  // Load configuration and constraints from session storage
  const wspConfig = JSON.parse(sessionStorage.getItem('wspConfig') || '{}');
  const constraints = JSON.parse(sessionStorage.getItem('wspConstraints') || '[]');
  const authMatrix = JSON.parse(sessionStorage.getItem('authMatrix') || '[]');

  const stepsCount = wspConfig.steps || 0;
  const usersCount = wspConfig.users || 0;

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
    } else if (constraints.length === 0) {
      toast({
        title: 'Constraints required',
        description: 'Please define at least one constraint.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/constraints');
    }
  }, [stepsCount, usersCount, authMatrix.length, constraints.length, navigate, toast]);

  const solveWSP = async () => {
    setIsSolving(true);
    setSolutions([]);
    setCurrentSolution(null);
    setExecutionStats(null);

    try {
      // Transform constraints to backend format
      const mustSameConstraints: Array<{step1: number, step2: number}> = [];
      const mustDifferentConstraints: Array<{step1: number, step2: number}> = [];

      // Convert frontend constraints to backend format
      constraints.forEach((constraint: Constraint) => {
        if (constraint.steps.length >= 2) {
          // For each pair of steps in the constraint
          for (let i = 0; i < constraint.steps.length - 1; i++) {
            const step1 = constraint.steps[i];
            const step2 = constraint.steps[i + 1];
            
            if (constraint.type === 'binding') {
              mustSameConstraints.push({ step1, step2 });
            } else if (constraint.type === 'separation') {
              mustDifferentConstraints.push({ step1, step2 });
            }
          }
        }
      });

      // Prepare the request according to backend's WSPRequest
      const request = {
        numSteps: stepsCount,
        numUsers: usersCount,
        authorized: authMatrix,
        mustSameConstraints,
        mustDifferentConstraints,
        solverType: selectedAlgorithm === 'backtracking' ? 'CSP' : 'SAT' // Map frontend algorithm to backend solver
      };

      const response = await apiClient.post('/wsp/solve', request);

      // Transform backend response to frontend format if needed
      if (response.data) {
        // Assuming the backend returns assignments in the format we expect
        // You might need to adjust this based on actual backend response
        const solutions = [{
          assignment: response.data.assignments || {},
          isComplete: response.data.isComplete || false,
          stats: response.data.stats || {}
        }];
        
        setSolutions(solutions);
        
        // Set execution stats if available
        if (response.data.stats) {
          const { executionTime } = response.data.stats;
          setExecutionStats({
            totalTime: executionTime || 0,
            totalSolutions: solutions.length,
            averageTime: executionTime || 0
          });
        }

        toast({
          title: 'Solution found',
          description: `Found solution`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Error solving WSP:', error);
      
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to solve the WSP instance',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSolving(false);
    }
  };

  const viewSolution = (solution: Solution) => {
    setCurrentSolution(solution);
    onOpen();
  };

  const renderSolutionTable = (solution: Solution) => {
    if (!solution) return null;

    return (
      <Table variant="simple" size="sm" mt={4}>
        <Thead>
          <Tr>
            <Th>Step</Th>
            <Th>Assigned User</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(solution.assignment).map(([step, user]) => (
            <Tr key={`${step}-${user}`}>
              <Td>Step {step}</Td>
              <Td>User {user}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  if (stepsCount === 0 || usersCount === 0) {
    return (
      <Box p={6}>
        <Heading size="lg" mb={4}>WSP Solver</Heading>
        <Text>Please complete the configuration first.</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Solve Workflow</Heading>
        
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="medium" mb={2}>Algorithm</Text>
              <Select 
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                isDisabled={isSolving}
              >
                <option value="backtracking">Backtracking</option>
                <option value="backjumping">Backjumping</option>
                <option value="forwardChecking">Forward Checking</option>
                <option value="arcConsistency">Arc Consistency</option>
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
                {solutions.length > 0 ? 'Re-solve' : 'Solve'}
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
            <Progress size="xs" isIndeterminate />
          </Box>
        )}

        {executionStats && (
          <Box mt={6} p={4} bg="blue.50" borderRadius="md">
            <Heading size="md" mb={4}>Execution Statistics</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Stat>
                <StatLabel>Total Solutions</StatLabel>
                <StatNumber>{executionStats.totalSolutions}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {executionStats.totalSolutions} found
                </StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel>Total Execution Time</StatLabel>
                <StatNumber>{executionStats.totalTime.toFixed(2)} ms</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  {executionStats.averageTime.toFixed(2)} ms avg per solution
                </StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel>Algorithm</StatLabel>
                <StatNumber textTransform="capitalize">{selectedAlgorithm}</StatNumber>
                <StatHelpText>
                  <TimeIcon mr={1} />
                  {new Date().toLocaleString()}
                </StatHelpText>
              </Stat>
            </SimpleGrid>
          </Box>
        )}

        {solutions.length > 0 && (
          <Box mt={6}>
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Solutions</Heading>
              <Badge colorScheme="green" fontSize="0.9em">
                {solutions.length} solution(s) found
              </Badge>
            </HStack>
            
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Status</Th>
                    <Th>Assignment</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {solutions.map((solution, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <Badge 
                          colorScheme={solution.isComplete ? 'green' : 'yellow'} 
                          variant="subtle"
                        >
                          {solution.isComplete ? 'Complete' : 'Partial'}
                        </Badge>
                      </Td>
                      <Td>
                        <Code>
                          {Object.entries(solution.assignment)
                            .map(([step, user]) => `S${step}:U${user}`)
                            .join(', ')}
                        </Code>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          onClick={() => viewSolution(solution)}
                          leftIcon={<InfoOutlineIcon />}
                        >
                          Details
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}

        {solutions.length === 0 && !isSolving && (
          <Alert status="info" borderRadius="md" mt={6}>
            <AlertIcon />
            <Box>
              <AlertTitle>No solutions yet</AlertTitle>
              <AlertDescription>
                Click the "Solve" button to find valid user assignments for the workflow.
              </AlertDescription>
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
