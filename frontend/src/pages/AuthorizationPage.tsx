import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, Heading, Table, Thead, Tbody, Tr, Th, Td, useToast, Text, HStack, VStack } from '@chakra-ui/react';
import { useAppContext } from '../context/AppContext';

interface AuthMatrixProps {
  steps: number;
  users: number;
  onNext: (matrix: number[][]) => void;
}

const AuthMatrix: React.FC<AuthMatrixProps> = ({ steps, users, onNext }) => {
  const { authMatrix: savedAuthMatrix } = useAppContext();
  const [matrix, setMatrix] = useState<boolean[][]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Initialize matrix with default values
  useEffect(() => {
    if (savedAuthMatrix && savedAuthMatrix.length > 0) {
      // Convert number matrix to boolean matrix
      const boolMatrix = savedAuthMatrix.map(row => row.map(cell => cell === 1));
      setMatrix(boolMatrix);
    } else {
      // Initialize with all false
      const initialMatrix = Array(steps).fill(0).map(() => Array(users).fill(false));
      setMatrix(initialMatrix);
    }
  }, [steps, users, savedAuthMatrix]);

  // Check if at least one user is authorized for each step
  useEffect(() => {
    if (matrix.length === 0) return;
    
    const complete = matrix.every(row => 
      row.some(cell => cell === true)
    );
    setIsComplete(complete);
    
    // Save to session storage
    sessionStorage.setItem('authMatrix', JSON.stringify(matrix));
  }, [matrix]);

  // Toggle cell value
  const toggleCell = (step: number, user: number) => {
    const newMatrix = [...matrix];
    newMatrix[step][user] = !newMatrix[step][user];
    setMatrix(newMatrix);
  };

  // Select all steps (all cells)
  const selectAllSteps = () => {
    const newMatrix = Array(steps).fill(0).map(() => Array(users).fill(true));
    setMatrix(newMatrix);
  };

  // Deselect all steps (clear all cells)
  const deselectAllSteps = () => {
    const newMatrix = Array(steps).fill(0).map(() => Array(users).fill(false));
    setMatrix(newMatrix);
  };

  // Select all users for a specific step (select entire row)
  const selectAllUsersForStep = (stepIndex: number) => {
    const newMatrix = [...matrix];
    newMatrix[stepIndex] = Array(users).fill(true);
    setMatrix(newMatrix);
  };

  // Deselect all users for a specific step (deselect entire row)
  const deselectAllUsersForStep = (stepIndex: number) => {
    const newMatrix = [...matrix];
    newMatrix[stepIndex] = Array(users).fill(false);
    setMatrix(newMatrix);
  };

  // Select all steps for a specific user (select entire column)
  const selectAllStepsForUser = (userIndex: number) => {
    const newMatrix = [...matrix];
    for (let i = 0; i < steps; i++) {
      newMatrix[i][userIndex] = true;
    }
    setMatrix(newMatrix);
  };

  // Deselect all steps for a specific user (deselect entire column)
  const deselectAllStepsForUser = (userIndex: number) => {
    const newMatrix = [...matrix];
    for (let i = 0; i < steps; i++) {
      newMatrix[i][userIndex] = false;
    }
    setMatrix(newMatrix);
  };

  // Check if all cells are selected
  const isAllSelected = matrix.length > 0 && matrix.every(row => row.every(cell => cell));

  // Check if all users are selected for a specific step
  const isRowAllSelected = (stepIndex: number) => {
    return matrix[stepIndex] && matrix[stepIndex].every(cell => cell);
  };

  // Check if all steps are selected for a specific user
  const isColumnAllSelected = (userIndex: number) => {
    return matrix.every(row => row[userIndex]);
  };

  const handleSubmit = () => {
    // Convert boolean matrix to number matrix (0s and 1s)
    const numberMatrix = matrix.map(row => 
      row.map(cell => cell ? 1 : 0)
    );
    onNext(numberMatrix);
  };

  if (matrix.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      <Text mb={4}>
        Check the boxes to indicate which users are authorized for each step.
        Each step must have at least one authorized user.
      </Text>
      
      {/* Select All Controls */}
      <Box mb={4} p={4} bg="gray.50" borderRadius="lg">
        <Text fontWeight="medium" mb={3}>Quick Selection</Text>
        <HStack spacing={4} wrap="wrap">
          <Button
            size="sm"
            colorScheme={isAllSelected ? "green" : "blue"}
            onClick={isAllSelected ? deselectAllSteps : selectAllSteps}
            leftIcon={isAllSelected ? <Text>✓</Text> : <Text>□</Text>}
          >
            {isAllSelected ? "Deselect All" : "Select All Steps"}
          </Button>
        </HStack>
      </Box>

      <Box overflowX="auto" borderWidth="1px" borderRadius="lg" p={4} bg="white">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Step \ User</Th>
              {Array.from({ length: users }, (_, i) => (
                <Th key={`user-${i}`} textAlign="center">
                  <VStack spacing={2}>
                    <Text>User {i + 1}</Text>
                    <Button
                      size="xs"
                      colorScheme={isColumnAllSelected(i) ? "green" : "blue"}
                      onClick={isColumnAllSelected(i) ? () => deselectAllStepsForUser(i) : () => selectAllStepsForUser(i)}
                      title={isColumnAllSelected(i) ? "Deselect all steps for this user" : "Select all steps for this user"}
                    >
                      {isColumnAllSelected(i) ? "✓ All" : "Select All"}
                    </Button>
                  </VStack>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {matrix.map((row, stepIndex) => (
              <Tr key={`step-${stepIndex}`}>
                <Td fontWeight="medium">
                  <HStack spacing={3}>
                    <Text>Step {stepIndex + 1}</Text>
                    <Button
                      size="xs"
                      colorScheme={isRowAllSelected(stepIndex) ? "green" : "blue"}
                      onClick={isRowAllSelected(stepIndex) ? () => deselectAllUsersForStep(stepIndex) : () => selectAllUsersForStep(stepIndex)}
                      title={isRowAllSelected(stepIndex) ? "Deselect all users for this step" : "Select all users for this step"}
                    >
                      {isRowAllSelected(stepIndex) ? "✓ All" : "Select All"}
                    </Button>
                  </HStack>
                </Td>
                {row.map((isChecked, userIndex) => (
                  <Td key={`cell-${stepIndex}-${userIndex}`} textAlign="center">
                    <Checkbox
                      isChecked={isChecked}
                      onChange={() => toggleCell(stepIndex, userIndex)}
                      colorScheme="blue"
                    />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      <Button
        mt={6}
        colorScheme="blue"
        onClick={handleSubmit}
        isDisabled={!isComplete}
      >
        Save & Continue to Constraints
      </Button>
      
      {!isComplete && matrix.length > 0 && (
        <Text color="orange.500" mt={2}>
          Please ensure each step has at least one authorized user.
        </Text>
      )}
    </Box>
  );
};

const AuthorizationPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { config, setAuthMatrix } = useAppContext();

  // Check if configuration exists
  useEffect(() => {
    if (!config || config.steps === 0 || config.users === 0) {
      toast({
        title: 'Configuration missing',
        description: 'Please configure the workflow first',
        status: 'warning',
      });
      navigate('/config');
    }
  }, [config, navigate, toast]);

  const handleNext = (authMatrix: number[][]) => {
    setAuthMatrix(authMatrix);
    toast({
      title: 'Authorization matrix saved',
      status: 'success',
      duration: 2000,
    });
    navigate('/constraints');
  };

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  return (
    <Box maxW="4xl" mx="auto" p={6} bg="white" borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={6}>
        Authorization Matrix
      </Heading>
      <Text mb={6} color="gray.600">
        Define which users are authorized to perform each step in the workflow.
      </Text>
      
      <AuthMatrix 
        steps={config.steps} 
        users={config.users} 
        onNext={handleNext} 
      />
    </Box>
  );
};

export default AuthorizationPage;
