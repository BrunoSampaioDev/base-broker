import { Box, Button } from "@chakra-ui/react";

export type SortField =
  | "id"
  | "instrument"
  | "side"
  | "price"
  | "quantity"
  | "remaining"
  | "status"
  | "createdAt";

export type SortDirection = "asc" | "desc";

interface HeaderColumn {
  label: string;
  field?: SortField;
}

const headerColumns: HeaderColumn[] = [
  { label: "ID", field: "id" },
  { label: "Instrumento", field: "instrument" },
  { label: "Lado", field: "side" },
  { label: "Preço", field: "price" },
  { label: "Quantidade", field: "quantity" },
  { label: "Restante", field: "remaining" },
  { label: "Status", field: "status" },
  { label: "Criada em", field: "createdAt" },
  { label: "Ação" },
];

export function OrderTableHead({
  sortedBy,
  sortDirection,
  onSort,
}: {
  sortedBy?: SortField | null;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
}) {
  return (
    <Box as="thead" bg="#222222">
      <Box as="tr">
        {headerColumns.map((column) => (
          <Box
            as="th"
            p="1"
            textAlign="left"
            color="white.500"
            key={column.label}
          >
            {column.field ? (
              <Button
                variant="ghost"
                size="xs"
                color="white.500"
                onClick={() => onSort?.(column.field as SortField)}
              >
                {column.label}
                {sortedBy === column.field
                  ? sortDirection === "asc"
                    ? " ▲"
                    : " ▼"
                  : " ▼"}
              </Button>
            ) : (
              column.label
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
