import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  VStack, 
  Heading, 
  Text, 
  Select, 
  HStack, 
  IconButton, 
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

type ConstraintType = 'separation' | 'binding' | 'cardinality';

interface Constraint {
  id: string;
  type: ConstraintType;
  steps: number[];
  users?: number[];
  k?: number;
}

const ConstraintsPage = () => {
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [selectedType, setSelectedType] = useState<ConstraintType>('separation');
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [kValue, setKValue] = useState<number>(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  // Load saved constraints from session storage
  useEffect(() => {
    const savedConstraints = sessionStorage.getItem('wspConstraints');
    if (savedConstraints) {
      setConstraints(JSON.parse(savedConstraints));
    }
  }, []);

  // Save constraints to session storage when they change
  useEffect(() => {
    sessionStorage.setItem('wspConstraints', JSON.stringify(constraints));
  }, [constraints]);

  const handleAddConstraint = () => {
    if (selectedSteps.length < 2) {
      toast({
        title: 'Error',
        description: 'Please select at least 2 steps for the constraint.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // For cardinality constraint, validate k value
    if (selectedType === 'cardinality' && (kValue < 1 || kValue > selectedSteps.length)) {
      toast({
        title: 'Error',
        description: `K must be between 1 and ${selectedSteps.length} for the selected steps.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newConstraint: Constraint = {
      id: Date.now().toString(),
      type: selectedType,
      steps: [...selectedSteps],
      ...(selectedUsers.length > 0 && { users: [...selectedUsers] }),
      ...(selectedType === 'cardinality' && { k: kValue }),
    };

    setConstraints([...constraints, newConstraint]);
    
    // Reset form
    setSelectedSteps([]);
    setSelectedUsers([]);
    setKValue(1);
    onClose();
    
    toast({
      title: 'Constraint added',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleRemoveConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id));
  };

  const handleNext = () => {
    // Navigate to the algorithm page
    navigate('/solver');
  };

  const getConstraintLabel = (constraint: Constraint) => {
    switch (constraint.type) {
      case 'separation':
        return `Separation of Duty (Steps: ${constraint.steps.join(', ')})`;
      case 'binding':
        return `Binding of Duty (Steps: ${constraint.steps.join(', ')})`;
      case 'cardinality':
        return `Cardinality (Steps: ${constraint.steps.join(', ')}, k=${constraint.k})`;
      default:
        return 'Unknown Constraint';
    }
  };

  const getConstraintColor = (type: ConstraintType) => {
    switch (type) {
      case 'separation':
        return 'red';
      case 'binding':
        return 'blue';
      case 'cardinality':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Get steps and users count from session storage
  const wspConfig = JSON.parse(sessionStorage.getItem('wspConfig') || '{}');
  const stepsCount = wspConfig.steps || 0;
  const usersCount = wspConfig.users || 0;

  if (stepsCount === 0 || usersCount === 0) {
    return (
      <Box p={6}>
        <Heading size="lg" mb={4}>Constraints</Heading>
        <Text>Please complete the configuration first.</Text>
        <Button mt={4} colorScheme="blue" onClick={() => navigate('/config')}>
          Go to Configuration
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Define Constraints</Heading>
        
        <Box>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
            Add Constraint
          </Button>
        </Box>

        {constraints.length > 0 ? (
          <Box borderWidth="1px" borderRadius="lg" p={4}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Type</Th>
                  <Th>Description</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {constraints.map((constraint) => (
                  <Tr key={constraint.id}>
                    <Td>
                      <Badge colorScheme={getConstraintColor(constraint.type)}>
                        {constraint.type.charAt(0).toUpperCase() + constraint.type.slice(1)}
                      </Badge>
                    </Td>
                    <Td>{getConstraintLabel(constraint)}</Td>
                    <Td>
                      <IconButton
                        aria-label="Remove constraint"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveConstraint(constraint.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box textAlign="center" py={10} borderWidth="1px" borderRadius="lg">
            <Text color="gray.500">No constraints defined yet. Add a constraint to get started.</Text>
          </Box>
        )}

        <HStack justify="flex-end" mt={8} spacing={4}>
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Back
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleNext}
            isDisabled={constraints.length === 0}
          >
            Next: Run Solver
          </Button>
        </HStack>
      </VStack>

      {/* Add Constraint Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Constraint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Constraint Type</FormLabel>
                <Select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ConstraintType)}
                >
                  <option value="separation">Separation of Duty</option>
                  <option value="binding">Binding of Duty</option>
                  <option value="cardinality">Cardinality</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>
                  Select Steps {selectedSteps.length > 0 && `(${selectedSteps.length} selected)`}
                </FormLabel>
                <HStack spacing={2} flexWrap="wrap">
                  {Array.from({ length: stepsCount }, (_, i) => i + 1).map((step) => (
                    <Button
                      key={step}
                      size="sm"
                      variant={selectedSteps.includes(step) ? 'solid' : 'outline'}
                      colorScheme={selectedSteps.includes(step) ? 'blue' : 'gray'}
                      onClick={() => {
                        if (selectedSteps.includes(step)) {
                          setSelectedSteps(selectedSteps.filter(s => s !== step));
                        } else {
                          setSelectedSteps([...selectedSteps, step]);
                        }
                      }}
                    >
                      Step {step}
                    </Button>
                  ))}
                </HStack>
              </FormControl>

              {selectedType === 'cardinality' && (
                <FormControl>
                  <FormLabel>Maximum number of users (k)</FormLabel>
                  <NumberInput 
                    min={1} 
                    max={selectedSteps.length} 
                    value={kValue}
                    onChange={(_, value) => setKValue(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Maximum number of users that can be assigned to the selected steps
                  </Text>
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Apply to Specific Users (Optional)</FormLabel>
                <HStack spacing={2} flexWrap="wrap">
                  {Array.from({ length: usersCount }, (_, i) => i + 1).map((user) => (
                    <Button
                      key={user}
                      size="sm"
                      variant={selectedUsers.includes(user) ? 'solid' : 'outline'}
                      colorScheme={selectedUsers.includes(user) ? 'blue' : 'gray'}
                      onClick={() => {
                        if (selectedUsers.includes(user)) {
                          setSelectedUsers(selectedUsers.filter(u => u !== user));
                        } else {
                          setSelectedUsers([...selectedUsers, user]);
                        }
                      }}
                    >
                      User {user}
                    </Button>
                  ))}
                </HStack>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Leave unselected to apply to all users
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddConstraint}>
              Add Constraint
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ConstraintsPage;
