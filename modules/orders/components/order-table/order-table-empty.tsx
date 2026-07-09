import { Flex, Text } from "@chakra-ui/react";

export function OrderTableEmpty() {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Text color="white.500">Nenhuma ordem encontrada</Text>
    </Flex>
  );
}
