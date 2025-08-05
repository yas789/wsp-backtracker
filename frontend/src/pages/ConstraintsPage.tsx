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
import { useAppContext } from '../context/AppContext';
import { Constraint as BaseConstraint, ConstraintType as BaseConstraintType } from '../types/wsp';

type ConstraintType = 'separation' | 'binding';

// Extend the base constraint with UI-specific properties
export interface UIConstraint extends BaseConstraint {
  id: string;
  type: ConstraintType; // Override to use local constraint types
  users?: number[];
  k?: number;
}

const ConstraintsPage = () => {
  const { constraints: globalConstraints, setConstraints: setGlobalConstraints, config } = useAppContext();
  const [constraints, setConstraints] = useState<UIConstraint[]>([]);
  const [selectedType, setSelectedType] = useState<ConstraintType>('separation');
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  // Removed kValue state as it's not used in the Java backend
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  // Load constraints from global state and convert to UIConstraints
  useEffect(() => {
    const uiConstraints: UIConstraint[] = globalConstraints.map((constraint, index) => ({
      ...constraint,
      id: `constraint-${index}`,
      type: constraint.type === 'SOD' ? 'separation' : 
            constraint.type === 'BOD' ? 'binding' :
            constraint.type as ConstraintType
    }));
    setConstraints(uiConstraints);
  }, [globalConstraints]);

  // Sync local constraints to global state
  useEffect(() => {
    const globalConstraints: BaseConstraint[] = constraints.map(constraint => ({
      type: constraint.type === 'separation' ? 'SOD' : 
            constraint.type === 'binding' ? 'BOD' :
            constraint.type as BaseConstraintType,
      steps: constraint.steps
    }));
    setGlobalConstraints(globalConstraints);
  }, [constraints, setGlobalConstraints]);

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

  const handleAddConstraint = () => {
    if (selectedSteps.length !== 2) {
      toast({
        title: 'Error',
        description: 'Please select exactly 2 steps for the constraint.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Only separation and binding constraints are supported

    const newConstraint: UIConstraint = {
      id: Date.now().toString(),
      type: selectedType,
      steps: [...selectedSteps],
      ...(selectedUsers.length > 0 && { users: [...selectedUsers] }),
      // No additional properties needed for separation/binding constraints
    };

    setConstraints([...constraints, newConstraint]);
    
    // Reset form
    setSelectedSteps([]);
    setSelectedUsers([]);
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

  const getConstraintLabel = (constraint: UIConstraint) => {
    const stepText = `Step ${constraint.steps[0]} and Step ${constraint.steps[1]}`;
    return constraint.type === 'separation' 
      ? `Separation of Duty: ${stepText} must be assigned to different users`
      : `Binding of Duty: ${stepText} must be assigned to the same user`;
  };

  const getConstraintColor = (type: ConstraintType) => {
    return type === 'separation' ? 'red' : 'blue';
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
                  <option value="separation">Separation of Duty (SoD)</option>
                  <option value="binding">Binding of Duty (BoD)</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Select 2 Steps</FormLabel>
                <HStack spacing={4}>
                  <Select 
                    placeholder="First step"
                    value={selectedSteps[0] || ''}
                    onChange={(e) => {
                      const newSteps = [...selectedSteps];
                      newSteps[0] = parseInt(e.target.value);
                      setSelectedSteps(newSteps);
                    }}
                  >
                    {Array.from({ length: stepsCount }, (_, i) => i + 1).map((step) => (
                      <option key={`first-${step}`} value={step} disabled={selectedSteps[1] === step}>
                        Step {step}
                      </option>
                    ))}
                  </Select>
                  
                  <Select
                    placeholder="Second step"
                    value={selectedSteps[1] || ''}
                    onChange={(e) => {
                      const newSteps = [...selectedSteps];
                      newSteps[1] = parseInt(e.target.value);
                      setSelectedSteps(newSteps);
                    }}
                  >
                    {Array.from({ length: stepsCount }, (_, i) => i + 1).map((step) => (
                      <option key={`second-${step}`} value={step} disabled={selectedSteps[0] === step}>
                        Step {step}
                      </option>
                    ))}
                  </Select>
                </HStack>
                {selectedSteps.length === 2 && (
                  <Text mt={2} fontSize="sm" color="gray.500">
                    {selectedType === 'separation' 
                      ? 'These steps must be assigned to different users'
                      : 'These steps must be assigned to the same user'}
                  </Text>
                )}
              </FormControl>

              {/* Removed cardinality constraint UI as it's not supported in the backend */}

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
