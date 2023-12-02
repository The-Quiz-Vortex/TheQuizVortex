import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Box,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import Dashboard from '../Dashboard/Dashboard.tsx';
import { useUserContext } from '../../helpers/useUserContext.ts';
import {
  updateProfileEmail,
  updateProfileFirstName,
  updateProfileLastName,
  updateProfilePhone,
  updateProfilePic,
  createProfilePic,
  deleteProfilePic,
} from '../../services/users.services.ts';

export default function MyProfile() {
  const { appState } = useUserContext();
  const [profilePicURL, setProfilePicURL] = useState(appState.userData?.profilePictureURL);
  const toast = useToast();

  useEffect(() => {
    setProfileData({
      firstName: appState.userData?.firstName || '',
      lastName: appState.userData?.lastName || '',
      phoneNumber: appState.userData?.phoneNumber || '',
      email: appState.userData?.email || '',
    });
  }, [appState.userData]);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [id]: value }));
  };

  const UpdateProfile = async () => {
    try {
      await Promise.all([
        updateProfileFirstName(profileData.firstName, appState.userData.username),
        updateProfileLastName(profileData.lastName, appState.userData.username),
        updateProfileEmail(profileData.email, appState.userData.username),
        updateProfilePhone(profileData.phoneNumber, appState.userData.username),
      ]);

      setProfileData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        email: profileData.email,
      });

      toast({
        title: 'The profile has been updated successfully.',
        status: 'success',
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    setProfilePicURL(appState.userData?.profilePictureURL || '');
  }, [appState.userData?.profilePictureURL]);

  const handleProfilePicChange = async (file) => {
    if (!file) return;

    try {
      if (appState.userData?.profilePictureURL) {
        await updateProfilePic(file, appState.userData.username);
      } else {
        await createProfilePic(file, appState.userData.username);
      }

      toast({
        title: 'Profile picture updated successfully. Please refresh the page.',
        status: 'success',
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      console.error('Error updating profile picture:', error);

      toast({
        title: 'Error updating profile picture.',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleDeletePicture = async () => {
    try {
      await deleteProfilePic(appState.userData?.username);

      toast({
        title: 'Profile picture removed.',
        status: 'success',
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
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
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={12}
          >
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
              Edit my profile
            </Heading>
            <FormControl id="profilePic">
              <FormLabel>Profile picture</FormLabel>
              <Stack direction={['column', 'row']} spacing={6}>
                <Center>
                  <Avatar
                    size="xl"
                    name={`${appState.userData?.firstName} ${appState.userData?.lastName}`}
                    src={profilePicURL}
                  >
                    <AvatarBadge
                      as={IconButton}
                      size="sm"
                      rounded="full"
                      top="-10px"
                      colorScheme="red"
                      aria-label="remove Image"
                      icon={<SmallCloseIcon />}
                      onClick={handleDeletePicture}
                    />
                  </Avatar>
                </Center>
                <Center w="full">
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleProfilePicChange(e.target.files?.[0])}
                    />
                    <Button w="full" as="span">
                      Change picture
                    </Button>
                  </label>
                </Center>
              </Stack>
            </FormControl>
            <FormControl id="firstName">
              <FormLabel>First name</FormLabel>
              <Input
                placeholder="First name"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={profileData.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="lastName">
              <FormLabel>Last name</FormLabel>
              <Input
                placeholder="Last name"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={profileData.lastName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="phoneNumber">
              <FormLabel>Phone number</FormLabel>
              <Input
                placeholder="0xxxxxxxxx"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <Stack spacing={6} direction={['column', 'row']} mt={3}>
              <Button
                bg={'red.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'red.500',
                }}
              >
                Cancel
              </Button>
              <Button
                bg={'blue.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={UpdateProfile}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}
