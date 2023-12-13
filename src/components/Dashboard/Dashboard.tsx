import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBarChart2,
  FiTrello,
  FiLock,
  FiCheckCircle,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useUserContext } from '../../helpers/useUserContext.ts';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.tsx';


interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard-stats' },
  { name: 'My classrooms', icon: FiTrello, path: '/my-classrooms' },
  { name: 'Explore', icon: FiCompass, path: '/browse-quizzes' },
  { name: 'Scoreboard', icon: FiBarChart2, path: '/scoreboard' },
  { name: 'Sample quiz', icon: FiCheckCircle, path: '/quiz/-NlYeBjFsgGD1ri34R0u' },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { appState } = useUserContext();
  const { user } = useContext(AuthContext);

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Image align='center' src="/quiz-logo.png" alt='quiztime' h="80px" m="5" />
      {appState.userData?.username && <Flex h="20" mt="5" mb="5" alignItems="center" mx="8" justifyContent="space-between" textAlign="left">
         <p>
          Welcome,
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" textAlign="left">
            @{appState.userData?.username}
          </Text>
        </p>
      </Flex>}
      {(!user ? LinkItems : LinkItems.slice(0, -1)).map((link) => (
        <NavItem as={Link} key={link.name} icon={link.icon} to={!user && link.name !== 'Explore' && link.name !== 'Sample quiz' && link.name !== 'Scoreboard' ? '#' : link.path}>
          {link.name}
          {!user && link.name !== 'Explore' && link.name !== 'Scoreboard' && link.name !== 'Sample quiz' && <FiLock style={{ marginLeft: '10px', fontSize: '12px' }} />}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  const { user } = useContext(AuthContext);

  return (
    <Box as={Link} to={href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height={{ base: 20, md: 0 }}
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth={{ base: 1, md: 0 }}
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Box as={Link} to="/" style={{ textDecoration: 'none' }}>
        <Text
          display={{ base: 'flex', md: 'none' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        ></Text>
      </Box>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
    </Box>
  );
};

export default SidebarWithHeader;
