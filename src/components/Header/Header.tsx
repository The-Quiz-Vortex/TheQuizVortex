import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Image } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useUserContext } from '../../helpers/useUserContext.ts';
import { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.tsx';
import Signout from '../../components/Signout/signout.tsx';

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const { loading, user, appState } = useUserContext();
  const { userData } = useContext(AuthContext);

  return (
    <Box position="sticky" top={0} zIndex={10}>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'80px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        zIndex={'10'}
        position={'relative'}
      >
        <Flex
          flex={{ base: 0, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Image src="/src/assets/quiz-logo.png" maxW={65} />
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        {!loading && user && (
          <>
            <HStack spacing={{ base: '0', md: '6' }}>
              <Flex alignItems={'center'}>
                <Menu>
                  <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                    <HStack>
                      <Avatar size={'sm'} src={userData?.profilePictureURL} />
                      <VStack
                        display={{ base: 'none', md: 'flex' }}
                        alignItems="flex-start"
                        spacing="1px"
                        ml="2"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                        >{`${userData?.firstName} ${userData?.lastName}`}</Text>
                        <Text fontSize="xs" color="gray.600" textTransform="capitalize">
                          {userData?.role}
                        </Text>
                      </VStack>
                      <Box display={{ base: 'none', md: 'flex' }}>
                        <FiChevronDown />
                      </Box>
                    </HStack>
                  </MenuButton>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.900')}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    textAlign="left"
                    p="2"
                  >
                    <MenuItem as={Link} to="/my-profile">
                      My Profile
                    </MenuItem>

                    {!loading && userData?.role === 'admin' ? (
                      <MenuItem as={Link} to="/admin-settings">
                        Admin Settings
                      </MenuItem>
                    ) : null}
                    <MenuItem>
                      <Signout />
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </HStack>
          </>
        )}

        {!loading && !user ? (
          <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
            <Button as={Link} fontSize={'md'} fontWeight={400} variant={'link'} to={'/sign-in'}>
              Sign In
            </Button>
            <Button
              as={Link}
              display={{ base: 'inline-flex' }}
              fontSize={'md'}
              fontWeight={600}
              color={'white'}
              bg={'pink.400'}
              to={'/sign-up'}
              _hover={{
                bg: 'pink.300',
              }}
            >
              Sign Up
            </Button>
          </Stack>
        ) : null}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.900', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const { user, loading, appState } = useUserContext();
  const { userData } = useContext(AuthContext);

  return (
    <Stack direction={'row'} alignItems={'center'} spacing={2}>
      {NAV_ITEMS.map(
        (navItem) =>
          !navItem.shouldHide?.(user) && (
            <Box key={navItem.label}>
              <Popover trigger={'hover'} placement={'bottom-start'}>
                <PopoverTrigger>
                  <Box
                    as={Link}
                    to={navItem.href ?? '#'}
                    fontSize={'md'}
                    fontWeight={500}
                    color={linkColor}
                    p={2}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}
                  >
                    {navItem.label}
                  </Box>
                </PopoverTrigger>

                {navItem.children && (
                  <PopoverContent
                    border={0}
                    boxShadow={'xl'}
                    bg={popoverContentBgColor}
                    p={4}
                    rounded={'xl'}
                    minW={'sm'}
                  >
                    <Stack>
                      {navItem.children.map((child) => (
                        <DesktopSubNav key={child.label} {...child} />
                      ))}
                    </Stack>
                  </PopoverContent>
                )}
              </Popover>
            </Box>
          )
      )}

      {!loading && (userData?.role === 'teacher' || userData?.role === 'admin') && (
        <Button
          as={Link}
          to={'/create-quiz'}
          fontSize={'md'}
          fontWeight={600}
          color={'white'}
          bg={'pink.300'}
          display={{ base: 'none', md: 'inline-flex' }}
          _hover={{
            bg: 'pink.400',
          }}
        >
          Create quiz
        </Button>
      )}

      {!loading && (userData?.role === 'teacher' || userData?.role === 'admin') && (
        <Button
          as={Link}
          to={'/create-room'}
          fontSize={'md'}
          fontWeight={600}
          color={'white'}
          bg={'blue.300'}
          display={{ base: 'none', md: 'inline-flex' }}
          _hover={{
            bg: 'blue.400',
          }}
        >
          Create room
        </Button>
      )}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as={Link}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text transition={'all .3s ease'} _groupHover={{ color: 'pink.400' }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={10} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Link
        py={10}
        as="a"
        to={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          py={2}
          fontSize={'20px'}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Link>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Box as={Link} key={child.label} py={2} to={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  shouldHide?: (user: User | null | undefined) => boolean;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '/',
    shouldHide: (user) => !!user, // Hide for signed-in users
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    shouldHide: (user) => !user, // Hide for not signed-in users
  },
  {
    label: 'Browse quizzes',
    href: '/browse-quizzes',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];
