import { Dispatch, SetStateAction } from 'react';
import { Input, useColorModeValue } from '@chakra-ui/react';


export default function SearchBar({ setSearchTerm }: { setSearchTerm: Dispatch<SetStateAction<string>> }) {



    return (
        <Input
            type="search"
            placeholder="Search Quizzes"
            onChange={(e) => setSearchTerm(e.target.value)}
            width='60%'
            mt={20}
            mb={4}
            border='none'
            bg={useColorModeValue('gray.100', 'gray.700')}
            _hover={{
                bg: useColorModeValue('gray.200', 'gray.600'),
            }}
            _placeholder={{
                color: useColorModeValue('gray.400', 'gray.400'),
            }}
            h='100%'
            px={4}
            py={4}
            rounded='full'
            _focus={{
                outline: 'none',
                boxShadow: 'outline',
            }}
        />
    )
}
