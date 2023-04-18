import { Box, Button, Flex, HStack } from '@chakra-ui/react';

import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      alignSelf="flex-start"
      justifyContent="center"
      gridGap={2}
    >
      <HStack justifyContent="space-between" w="100%">
        <Button colorScheme="blue">Menu</Button>
        <ThemeToggle />
      </HStack>
    </Flex>
  );
};

export default Header;
