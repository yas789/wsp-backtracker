import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, Heading, Table, Thead, Tbody, Tr, Th, Td, useToast, Text } from '@chakra-ui/react';
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

  const toggleAuth = (stepIndex: number, userIndex: number) => {
    const newMatrix = [...matrix];
    newMatrix[stepIndex][userIndex] = !newMatrix[stepIndex][userIndex];
    setMatrix(newMatrix);
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
      
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Step \ User</Th>
              {Array(users).fill(0).map((_, i) => (
                <Th key={`user-${i}`} textAlign="center">U{i + 1}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {matrix.map((row, stepIndex) => (
              <Tr key={`step-${stepIndex}`}>
                <Td fontWeight="bold">Step {stepIndex + 1}</Td>
                {row.map((isChecked, userIndex) => (
                  <Td key={`cell-${stepIndex}-${userIndex}`} textAlign="center">
                    <Checkbox
                      isChecked={isChecked}
                      onChange={() => toggleAuth(stepIndex, userIndex)}
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
