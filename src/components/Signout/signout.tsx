import React from 'react';
import { Button } from '@chakra-ui/react';
import { useUserContext } from '../../helpers/useUserContext';
import { logoutUser } from '../../services/auth.services';

const Signout = () => {
  const { user } = useUserContext();

  const handleSignOut = async () => {
    await logoutUser();
  };

  return (
    <React.Fragment>{user && <Button onClick={handleSignOut}>Sign Out</Button>}</React.Fragment>
  );
};

export default Signout;
