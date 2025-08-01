import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Heading, Input, VStack, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, useToast } from '@chakra-ui/react';

const ConfigurationPage = () => {
  const [steps, setSteps] = useState<number>(4);
  const [users, setUsers] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Store configuration in session storage
    sessionStorage.setItem('wspConfig', JSON.stringify({ steps, users }));
    
    // Show success message
    toast({
      title: 'Configuration saved',
      description: 'Proceed to define authorizations',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Navigate to authorization page
    navigate('/auth');
  };

  // Load saved configuration if exists
  useEffect(() => {
    const savedConfig = sessionStorage.getItem('wspConfig');
    if (savedConfig) {
      const { steps: savedSteps, users: savedUsers } = JSON.parse(savedConfig);
      setSteps(savedSteps);
      setUsers(savedUsers);
    }
  }, []);

  return (
    <Box maxW="md" mx="auto" p={6} bg="white" borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Workflow Configuration
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Number of Steps</FormLabel>
            <NumberInput 
              min={1} 
              max={20} 
              value={steps} 
              onChange={(_, value) => setSteps(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Number of Users</FormLabel>
            <NumberInput 
              min={1} 
              max={20} 
              value={users} 
              onChange={(_, value) => setUsers(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full"
            isLoading={isSubmitting}
            loadingText="Saving..."
          >
            Save & Continue
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ConfigurationPage;
