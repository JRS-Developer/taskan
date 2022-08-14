import useInvalidateBoardQuery from "@/hooks/invalidators/useInvalidateBoardQuery";
import { BoardColumnByIdT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";
import {
  Flex,
  HStack,
  Button,
  Box,
  Collapse,
  useToast,
  useBoolean,
} from "@chakra-ui/react";
import { memo } from "react";
import { HiPlus } from "react-icons/hi";
import BoardColumnForm from "./BoardColumnForm";
import BoardColumnItem from "./BoardColumnItem";

type Props = {
  boardId: string;
  columns: BoardColumnByIdT[];
};

const BoardColumns = ({ boardId, columns }: Props) => {
  const [isCreating, setIsCreating] = useBoolean(false);
  const toast = useToast();

  const { invalidate } = useInvalidateBoardQuery({ boardId });

  // mutation to create a new Board Column
  const { mutate, isLoading } = trpc.useMutation(["columns.createOne"], {
    onSuccess: () => {
      // refetch board
      invalidate();

      // show success message
      toast({
        status: "success",
        title: "Column created successfully!",
      });

      // close input
      setIsCreating.off();
    },
  });

  function handleCreateColumn({ name }: { name: string }) {
    mutate({
      name,
      boardId: boardId,
    });
  }

  return (
    <Flex bg="gray.100" rounded="3xl" mt="7" p="6">
      <HStack spacing="8" align="flex-start">
        {columns.map((column) => (
          <BoardColumnItem key={column.id} column={column} />
        ))}
        <Box w="244px">
          <Collapse in={isCreating} unmountOnExit>
            {isCreating && (
              <BoardColumnForm
                isLoading={isLoading}
                label="Add New Column"
                addButtonText="Add Column"
                onSubmit={handleCreateColumn}
                inputPlaceholder="Insert column name..."
                onCancel={setIsCreating.off}
              />
            )}
          </Collapse>
          {!isCreating && (
            <Button
              leftIcon={<HiPlus />}
              colorScheme="blue"
              variant="outline"
              onClick={setIsCreating.on}
              w="full"
            >
              Add another list
            </Button>
          )}
        </Box>
      </HStack>
    </Flex>
  );
};

export default memo(BoardColumns);
