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
  Select,
} from '@chakra-ui/react';
import {
  getAllUsers,
  blockUser,
  unblockUser,
  makeAdminUser,
  removeAdminUser,
  makeTeacherUser,
  makeStudentUser,
} from '../../services/users.services.ts';
import { AppUser } from '../../common/interfaces.ts';
import Dashboard from '../Dashboard/Dashboard.tsx';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<Array<AppUser>>([]);

  useEffect(() => {
    const getAllUsersData = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    getAllUsersData();
  }, [users]);

  const handleToggleBlock = (username: string, isBlocked: boolean) => {
    const newBlockedStatus = !isBlocked;
    (newBlockedStatus ? blockUser(username) : unblockUser(username)).then(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username ? { ...user, blockedStatus: newBlockedStatus } : user
        )
      );
    });
  };

  const handleRoleChange = (username: string, newRole: string) => {
    switch (newRole) {
      case 'admin':
        makeAdminUser(username).then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.username === username ? { ...user, role: 'admin' } : user))
          );
        });
        break;
      case 'teacher':
        makeTeacherUser(username).then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.username === username ? { ...user, role: 'teacher' } : user))
          );
        });
        break;
      case 'student':
        makeStudentUser(username).then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.username === username ? { ...user, role: 'student' } : user))
          );
        });
        break;
      default:
        // Assuming 'user' is the default role
        removeAdminUser(username).then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.username === username ? { ...user, role: 'user' } : user))
          );
        });
        break;
    }
  };

  return (
    <>
      <Dashboard />
      <Box ml={{ base: 0, md: 60 }}>
        <Flex
          minH={'calc(100vh - 80px)'}
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
                    <Select
                      defaultValue={user.role}
                      onChange={(e) => handleRoleChange(user.username, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                      <option value="user">User</option>
                    </Select>
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
