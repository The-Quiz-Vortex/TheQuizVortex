import { Divider, HStack, IconButton, Image, LinkProps, Stack } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
const accounts = [
    {
        url: 'https://github.com/The-Quiz-Vortex/TheQuizVortex',
        label: 'Github Account',
        type: 'gray',
        icon: <FaGithub size={40}/>
    }
];
export default function Footer() {
    return (
        <>
            <Stack
                marginInline="auto"
                p={8}

                justifyContent="space-between"
                alignItems="center"
                direction={{ base: 'column', md: 'row' }}
                backgroundColor={'gray.100'}
                w={'100%'}
            >
                <Link to="/home">
                    <Image w="100px" src="/public/quiz-logo.png" alt="TemplatesKart" />
                </Link>

                {/* Desktop Screen */}
                <HStack spacing={4} alignItems="center" d={{ base: 'none', md: 'flex' }}>
                    <Link to={"/sign-up"} fontSize="sm" _hover={{ textDecoration: 'underline' }}>
                        Sign up
                    </Link>
                    <Link to={"/browse-quizzes"} fontSize="sm" _hover={{ textDecoration: 'underline' }}>
                        Browse quizzes
                    </Link>
                    <Link to={"/scoreboard"} fontSize="sm" _hover={{ textDecoration: 'underline' }}>
                        Scoreboard
                    </Link>
                    <Link to={"/contact"} fontSize="sm" _hover={{ textDecoration: 'underline' }}>
                        Contact us
                    </Link>
                </HStack>

                <Stack direction="row" spacing={5} pt={{ base: 4, md: 0 }} alignItems="center">
                    {accounts.map((sc, index) => (
                        <Link to={sc.url}>
                        <IconButton
                            key={index}
                            aria-label={sc.label}
                            colorScheme={sc.type}
                            icon={sc.icon}
                            rounded="md"
                        />
                        </Link>
                    ))}
                </Stack>
            </Stack>
        </>
    );
}


