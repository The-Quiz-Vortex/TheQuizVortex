import { Button, Container, HStack, Icon, Stack, Text, chakra, useColorModeValue } from '@chakra-ui/react';
import { BsFillCheckCircleFill } from 'react-icons/bs';

const list = [
    'Manage students grading',
    'Access to classrooms',
    'Review students quizzes',
    'Create quizzes'
];

const SingleTierPricing = () => {
    return (
        <Container maxW="5xl" p="6">
            <chakra.h1 fontSize="5xl" fontWeight="bold" textAlign="center" mb={5}>
                Pricing
            </chakra.h1>
            <PricingCard />
        </Container>
    );
};

const PricingCard = () => {
    return (
        <Stack
            w="max-content"
            spacing={5}
            p={10}
            border="1px solid"
            borderColor={useColorModeValue('gray.400', 'gray.600')}
            rounded="md"
            bg={useColorModeValue('pink.50', 'pink.800')}
            margin="0 auto"
            textAlign="center"
            mb={50}
        >
            <chakra.h1 fontSize="7xl" fontWeight="400">
                $150{' '}
                <Text as="sub" fontSize="md" left="-10px">
                    /mon
                </Text>
            </chakra.h1>

            {list.map((text, index) => (
                <HStack key={index} spacing={3}>
                    <Icon as={BsFillCheckCircleFill} h={6} w={6} color="green.400" />
                    <Text fontSize="lg" color="gray.500">
                        {text}
                    </Text>
                </HStack>
            ))}
            <Button h={12}
                w={'fit-content'}
                px={6}
                bgGradient="linear(to-br, #EA83A3, #E495BC)"
                color="white"
                _hover={{ bgGradient: 'linear(to-br, #EC849B, #EE8C64)' }}
                variant="solid"
                size="lg"
                rounded="md"
                fontWeight="bold"
                mx={'auto'}
                mb={{ base: 2, sm: 0 }}>
                Buy now
            </Button>
        </Stack>
    );
};

export default SingleTierPricing;