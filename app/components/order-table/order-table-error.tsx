import { Flex, Text } from "@chakra-ui/react";

export function OrderTableError() {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Text color="white.500">Erro ao buscar ordens</Text>
    </Flex>
  );
}
