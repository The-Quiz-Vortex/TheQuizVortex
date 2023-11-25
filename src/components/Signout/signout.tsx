import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useUserContext } from '../../helpers/useUserContext';
import { logoutUser } from '../../services/auth.services';
import { useNavigate } from 'react-router-dom';

const Signout = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      await logoutUser();

      toast({
        title: 'You logged out successfully',
        status: 'success',
        isClosable: true,
        position: 'top',
      });

      setTimeout(() => {
        navigate('/home');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <React.Fragment>{user && <Button onClick={handleSignOut}>Sign Out</Button>}</React.Fragment>
  );
};

export default Signout;
