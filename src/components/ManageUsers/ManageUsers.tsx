import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Flex,
  useColorModeValue,
  Avatar,
} from '@chakra-ui/react';
import {
  getAllUsers,
  makeAdminUser,
  removeAdminUser,
  blockUser,
  unblockUser,
} from '../../services/users.services.ts';
import { AppUser } from '../../common/interfaces.ts';
import Dashboard from '../Dashboard/Dashboard.tsx';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<Array<AppUser>>([]);

  useEffect(() => {
    const getAllUsersData = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData || []); // Set usersData or an empty array if it's null
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    getAllUsersData();
  }, [users]);

  const handleToggleAdmin = (username: string, currentRole: string) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    (newRole === 'admin' ? makeAdminUser(username) : removeAdminUser(username)).then(() => {
      // Update the user role in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.username === username ? { ...user, role: newRole } : user))
      );
    });
  };

  const handleToggleBlock = (username: string, isBlocked: boolean) => {
    const newBlockedStatus = !isBlocked;
    (newBlockedStatus ? blockUser(username) : unblockUser(username)).then(() => {
      // Update the user status in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username ? { ...user, blocked: newBlockedStatus } : user
        )
      );
    });
  };

  return (
    <>
      <Dashboard />
      <Box minH="calc(100vh - 140px)" ml={{ base: 0, md: 60 }}>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Table
            variant="simple"
            background={'white'}
            border={'1px'}
            borderColor={'gray.100'}
            maxWidth={'90%'}
            mt={'20'}
            mb={'20'}
          >
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Blocked</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.username}>
                  <Td>
                    <Box display="flex" justifyContent="flex-start" alignItems="center" gap="20px">
                      <Avatar size={'md'} src={user.profilePictureURL} />
                      {user.username}
                    </Box>
                  </Td>
                  <Td>{`${user.firstName} ${user.lastName}`}</Td>
                  <Td>{user.email}</Td>
                  <Td textTransform={'capitalize'}>{user.role}</Td>
                  <Td>{user.blockedStatus ? 'Yes' : 'No'}</Td>
                  <Td>
                    <Button
                      colorScheme={user.role === 'user' ? 'teal' : 'red'}
                      size="sm"
                      m="1"
                      minWidth={'130px'}
                      onClick={() => handleToggleAdmin(user.username, user.role)}
                    >
                      {user.role === 'user' ? 'Make Admin' : 'Remove Admin'}
                    </Button>
                    <Button
                      colorScheme={user.blockedStatus ? 'green' : 'orange'}
                      size="sm"
                      m="1"
                      minWidth={'130px'}
                      onClick={() => handleToggleBlock(user.username, user.blockedStatus)}
                    >
                      {user.blockedStatus ? 'Unblock User' : 'Block User'}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
      </Box>
    </>
  );
};

export default ManageUsers;
