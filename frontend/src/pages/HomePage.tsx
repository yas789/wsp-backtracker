import { keyframes } from '@emotion/react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  useColorModeValue, 
  Container, 
  Flex, 
  usePrefersReducedMotion,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaUserLock, FaLink, FaRocket } from 'react-icons/fa';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HomePage = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation = prefersReducedMotion
    ? undefined
    : `${float} 6s ease-in-out infinite`;

  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const gradientBg = useColorModeValue(
    'linear(to-r, blue.500, teal.500)',
    'linear(to-r, blue.300, teal.300)'
  );
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  const features = [
    {
      title: 'Configuration',
      description: 'Set up your workflow steps and user roles.',
      icon: FaCog,
      bg: 'blue.100',
      color: 'blue.500',
    },
    {
      title: 'Authorization',
      description: 'Define which users can perform which steps.',
      icon: FaUserLock,
      bg: 'green.100',
      color: 'green.500',
    },
    {
      title: 'Constraints',
      description: 'Specify separation of duty and binding of duty constraints.',
      icon: FaLink,
      bg: 'purple.100',
      color: 'purple.500',
    },
  ];

  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const headingSize = useBreakpointValue({ base: '2xl', md: '4xl' });
  const subHeadingSize = useBreakpointValue({ base: 'lg', md: 'xl' });

  return (
    <Box as="main" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="7xl" px={4}>
        {/* Hero Section */}
        <Flex
          direction="column"
          textAlign="center"
          align="center"
          py={16}
          px={4}
        >
          <Box
            mb={6}
            px={4}
            py={2}
            borderRadius="full"
            bg={useColorModeValue('blue.50', 'blue.900')}
            color={useColorModeValue('blue.600', 'blue.200')}
            fontSize="sm"
            fontWeight="semibold"
            letterSpacing="wide"
            textTransform="uppercase"
          >
            Workflow Satisfiability Problem Solver
          </Box>
          
          <Heading
            as="h1"
            size={headingSize}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight={1.2}
            mb={6}
            color={headingColor}
          >
            Secure Access Control
            <Box as="span" color={useColorModeValue('blue.500', 'blue.300')}>
              {' '}for Complex Workflows
            </Box>
          </Heading>
          
          <Text
            maxW="2xl"
            fontSize={subHeadingSize}
            color={textColor}
            mb={10}
            lineHeight={1.6}
          >
            Design, validate, and enforce access control policies with our intuitive WSP solver.
          </Text>
          
          <Flex gap={4} flexWrap="wrap" justify="center">
            <Button
              size={buttonSize}
              colorScheme="blue"
              rightIcon={<FaRocket />}
              px={8}
              py={7}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="xl"
              boxShadow="lg"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'xl',
              }}
              transition="all 0.2s"
              onClick={() => navigate('/config')}
            >
              Get Started
            </Button>
            <Button
              size={buttonSize}
              variant="outline"
              borderWidth="2px"
              px={8}
              py={7}
              fontSize="lg"
              fontWeight="semibold"
              borderRadius="xl"
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
            >
              Learn More
            </Button>
          </Flex>
        </Flex>

        {/* Features Grid */}
        <Box py={16}>
          <Box maxW="3xl" mx="auto" textAlign="center" mb={16} px={4}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={useColorModeValue('blue.600', 'blue.300')}
              mb={3}
              letterSpacing="wide"
            >
              WORKFLOW DESIGN MADE SIMPLE
            </Text>
            <Heading
              as="h2"
              size="xl"
              fontWeight="extrabold"
              mb={6}
              color={headingColor}
            >
              Everything You Need in One Place
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
              Our platform guides you through the entire process of creating and validating
              secure workflow authorizations.
            </Text>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={8}
            px={4}
          >
            {features.map((feature, index) => (
              <Box
                key={feature.title}
                bg={cardBg}
                p={8}
                borderRadius="xl"
                boxShadow="lg"
                textAlign="center"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.100', 'gray.700')}
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl',
                  borderColor: useColorModeValue('blue.100', 'blue.900'),
                }}
              >
                <Flex
                  w={16}
                  h={16}
                  bg={feature.bg}
                  color={feature.color}
                  align="center"
                  justify="center"
                  borderRadius="xl"
                  mx="auto"
                  mb={6}
                  fontSize="2xl"
                  animation={animation}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationPlayState: prefersReducedMotion ? 'paused' : 'running',
                  }}
                >
                  <Icon as={feature.icon} boxSize={6} />
                </Flex>
                <Heading as="h3" size="md" mb={3} color={headingColor}>
                  {feature.title}
                </Heading>
                <Text color={textColor} lineHeight="tall">
                  {feature.description}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          bgGradient={gradientBg}
          borderRadius="2xl"
          p={{ base: 8, md: 12 }}
          textAlign="center"
          color="white"
          mb={16}
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.2) 100%)',
            zIndex: 0,
          }}
        >
          <Box position="relative" zIndex={1}>
            <Heading as="h2" size="xl" mb={4}>
              Ready to Secure Your Workflows?
            </Heading>
            <Text fontSize="lg" mb={8} maxW="2xl" mx="auto" opacity={0.95}>
              Start designing secure access control for your workflows today.
              No credit card required.
            </Text>
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              color="white"
              bg="rgba(255, 255, 255, 0.15)"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.25)',
                transform: 'translateY(-2px)',
              }}
              _active={{
                bg: 'rgba(255, 255, 255, 0.1)',
              }}
              onClick={() => navigate('/config')}
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="semibold"
              borderRadius="xl"
              boxShadow="lg"
              transition="all 0.3s"
            >
              Get Started for Free
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
