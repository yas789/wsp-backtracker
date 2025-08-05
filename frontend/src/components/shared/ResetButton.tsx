import React from 'react';
import { 
  Button, 
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useAppContext } from '../../context/AppContext';

interface ResetButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  colorScheme?: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({ 
  size = 'md', 
  variant = 'outline', 
  colorScheme = 'red' 
}) => {
  const { clearAll } = useAppContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const handleReset = () => {
    clearAll();
    onClose();
    toast({
      title: 'Data Reset',
      description: 'All workflow data has been cleared successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        onClick={onOpen}
      >
        Reset All Data
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset All Data
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to reset all workflow data? This will clear:
              <br />
              • Configuration (steps and users)
              <br />
              • Authorization matrix
              <br />
              • All constraints
              <br />
              • Solution history
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleReset} ml={3}>
                Reset All Data
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ResetButton;
