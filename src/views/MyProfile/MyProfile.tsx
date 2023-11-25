import { Box } from '@chakra-ui/react';

import Dashboard from '../../components/Dashboard/Dashboard.tsx';

export default function MyProfile() {
  return (
    <Box>
      <Dashboard />
      <Box minH="calc(100vh - 140px)" ml={{ base: 0, md: 60 }} p="4">
        <h1>asdasdasd</h1>
      </Box>
    </Box>
  );
}
