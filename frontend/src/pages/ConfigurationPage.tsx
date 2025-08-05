import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Heading, Input, VStack, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, useToast } from '@chakra-ui/react';
import { useAppContext } from '../context/AppContext';

const ConfigurationPage = () => {
  const { config, setConfig } = useAppContext();
  const [steps, setSteps] = useState<number>(config.steps || 4);
  const [users, setUsers] = useState<number>(config.users || 4);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Update local state when context changes
  useEffect(() => {
    if (config.steps > 0) setSteps(config.steps);
    if (config.users > 0) setUsers(config.users);
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Store configuration in app context
    setConfig({ steps, users });
    
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
    setIsSubmitting(false);
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
