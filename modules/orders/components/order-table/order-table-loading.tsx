import { Flex, Spinner, Text } from "@chakra-ui/react";

export function OrderTableLoading() {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="0.5rem"
    >
      <Spinner size="sm" color="white.500" mr="2" />
      <Text color="white.500">Carregando ordens...</Text>
    </Flex>
  );
}
