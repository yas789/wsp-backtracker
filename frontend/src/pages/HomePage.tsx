import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Container,
  SimpleGrid,
  Icon,
  useColorModeValue,
  HStack,
  Badge,
  Flex,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiSettings, FiUsers, FiLock, FiCpu, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
  const context = useAppContext();
  
  // Provide default values in case context is not yet initialized
  const config = context?.config || { steps: 0, users: 0 };
  const constraints = context?.constraints || [];
  const authMatrix = context?.authMatrix || [];
  const solutionHistory = context?.solutionHistory || [];
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );

  const getStepStatus = () => {
    return {
      config: config.steps > 0 && config.users > 0,
      auth: authMatrix.length > 0,
      constraints: constraints.length > 0,
      solved: solutionHistory.length > 0,
    };
  };

  const status = getStepStatus();
  const completedSteps = Object.values(status).filter(Boolean).length;
  const totalSteps = 4;
  const progress = (completedSteps / totalSteps) * 100;

  const steps = [
    {
      title: 'Configuration',
      description: 'Set up your workflow with steps and users',
      icon: FiSettings,
      path: '/config',
      color: 'blue',
      completed: status.config,
      stats: config.steps > 0 ? `${config.steps} steps, ${config.users} users` : 'Not configured',
    },
    {
      title: 'Authorization Matrix',
      description: 'Define who can perform which steps',
      icon: FiUsers,
      path: '/auth',
      color: 'green',
      completed: status.auth,
      stats: authMatrix.length > 0 ? `${authMatrix.length} authorizations` : 'Not defined',
    },
    {
      title: 'Constraints',
      description: 'Add separation and binding constraints',
      icon: FiLock,
      path: '/constraints',
      color: 'purple',
      completed: status.constraints,
      stats: constraints.length > 0 ? `${constraints.length} constraints` : 'No constraints',
    },
    {
      title: 'Solve & Results',
      description: 'Run algorithms to find valid assignments',
      icon: FiCpu,
      path: '/solver',
      color: 'orange',
      completed: status.solved,
      stats: solutionHistory.length > 0 ? `${solutionHistory.length} solutions found` : 'Not solved yet',
    },
  ];

  return (
    <Box bgGradient={gradientBg} minH="calc(100vh - 160px)" borderRadius="2xl" p={1}>
      <Container maxW="7xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <Box textAlign="center">
            <Heading
              size="2xl"
              mb={6}
              bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
              bgClip="text"
              fontWeight="800"
            >
              Workflow Satisfiability Problem Solver
            </Heading>
            <Text
              fontSize="xl"
              color={useColorModeValue('gray.600', 'gray.300')}
              maxW="4xl"
              mx="auto"
              lineHeight="tall"
            >
              Solve complex workflow assignment problems with advanced constraint satisfaction.
              Define workflows, set authorization rules, add constraints, and discover optimal solutions
              using state-of-the-art algorithms.
            </Text>
          </Box>

          {/* Progress Overview */}
          <Card bg={cardBg} shadow="xl" borderRadius="2xl">
            <CardBody p={8}>
              <VStack spacing={6}>
                <HStack justify="space-between" w="full">
                  <Box>
                    <Heading size="lg" mb={2}>
                      Workflow Progress
                    </Heading>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                      Complete all steps to solve your workflow problem
                    </Text>
                  </Box>
                  <Stat textAlign="right">
                    <StatNumber fontSize="3xl" color="brand.500">
                      {completedSteps}/{totalSteps}
                    </StatNumber>
                    <StatLabel>Steps Completed</StatLabel>
                    <StatHelpText>{Math.round(progress)}% Complete</StatHelpText>
                  </Stat>
                </HStack>
                <Progress
                  value={progress}
                  size="lg"
                  colorScheme="brand"
                  borderRadius="full"
                  w="full"
                  bg={useColorModeValue('gray.100', 'gray.700')}
                />
              </VStack>
            </CardBody>
          </Card>

          {/* Workflow Steps */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {steps.map((step, index) => (
              <Card
                key={step.title}
                bg={cardBg}
                shadow="lg"
                borderRadius="2xl"
                border="1px"
                borderColor={step.completed ? `${step.color}.200` : borderColor}
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: '2xl',
                  borderColor: `${step.color}.300`,
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                cursor="pointer"
                as={RouterLink}
                to={step.path}
                position="relative"
                overflow="hidden"
              >
                {step.completed && (
                  <Box
                    position="absolute"
                    top={4}
                    right={4}
                    zIndex={1}
                  >
                    <Badge
                      colorScheme="green"
                      borderRadius="full"
                      px={3}
                      py={1}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={FiCheckCircle} boxSize={3} />
                      Complete
                    </Badge>
                  </Box>
                )}
                <CardBody p={8}>
                  <VStack spacing={6} align="start">
                    <HStack spacing={4}>
                      <Box
                        p={4}
                        borderRadius="2xl"
                        bg={`${step.color}.100`}
                        color={`${step.color}.600`}
                        _dark={{
                          bg: `${step.color}.900`,
                          color: `${step.color}.300`,
                        }}
                      >
                        <Icon as={step.icon} boxSize={8} />
                      </Box>
                      <Box flex={1}>
                        <HStack spacing={2} mb={2}>
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color={`${step.color}.500`}
                            textTransform="uppercase"
                            letterSpacing="wider"
                          >
                            Step {index + 1}
                          </Text>
                        </HStack>
                        <Heading size="md" mb={2}>
                          {step.title}
                        </Heading>
                      </Box>
                    </HStack>
                    
                    <Text
                      color={useColorModeValue('gray.600', 'gray.400')}
                      lineHeight="tall"
                    >
                      {step.description}
                    </Text>
                    
                    <Divider />
                    
                    <Flex justify="space-between" align="center" w="full">
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={useColorModeValue('gray.500', 'gray.400')}
                      >
                        {step.stats}
                      </Text>
                      <Icon
                        as={FiArrowRight}
                        color={`${step.color}.500`}
                        boxSize={5}
                        transition="transform 0.2s"
                        _groupHover={{ transform: 'translateX(4px)' }}
                      />
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Call to Action */}
          <Box textAlign="center" pt={8}>
            <VStack spacing={4}>
              <Button
                as={RouterLink}
                to={status.config ? '/auth' : '/config'}
                size="lg"
                colorScheme="brand"
                rightIcon={<Icon as={FiArrowRight} />}
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="600"
                borderRadius="2xl"
                shadow="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl',
                }}
                transition="all 0.2s"
              >
                {status.config ? 'Continue Workflow' : 'Start Building Your Workflow'}
              </Button>
              <Text
                fontSize="sm"
                color={useColorModeValue('gray.500', 'gray.400')}
              >
                {completedSteps === 0
                  ? 'Begin by configuring your workflow parameters'
                  : `${totalSteps - completedSteps} steps remaining to complete your workflow`}
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;
