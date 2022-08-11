import { inferQueryOutput, trpc } from "@/utils/trpc";
import {
  Flex,
  HStack,
  Button,
  Box,
  Collapse,
  useToast,
  useBoolean,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useRef } from "react";
import { HiPlus } from "react-icons/hi";
import BoardColumnForm from "./BoardColumnForm";
import BoardColumnItem from "./BoardColumnItem";

type Props = {
  boardId: string;
  columns: inferQueryOutput<"boards.getOneById">["lists"];
};

const BoardColumns = ({ boardId, columns }: Props) => {
  const [isCreating, setIsCreating] = useBoolean(false);
  const toast = useToast();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // this callback makes possible that the input gets focus when it's rendered
  const callbackRef = useCallback((inputElement: HTMLInputElement | null) => {
    if (inputElement) {
      inputElement.focus();
      inputRef.current = inputElement;
    }
  }, []);

  // mutation to create a new Board Column
  const { mutate, isLoading } = trpc.useMutation(["columns.createOne"], {
    onSuccess: () => {
      // refetch board
      utils.invalidateQueries(["boards.getOneById", { id: boardId }]);

      // show success message
      toast({
        status: "success",
        title: "Column created successfully!",
      });

      // close input
      setIsCreating.off();
    },
  });

  const utils = trpc.useContext();

  const handleCreateColumn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current) return;

    const name = inputRef.current.value;

    // if the name is empty, then, don't create anything
    if (name === "") return;

    mutate({
      name,
      boardId: boardId,
    });
  };

  return (
    <Flex bg="gray.100" rounded="3xl" mt="7" pt="7" px="6">
      <HStack spacing="8" align="flex-start">
        {columns.map((column) => (
          <>
            <BoardColumnItem key={column.id} column={column} />
          </>
        ))}
        <Box w="244px">
          <Collapse in={isCreating} unmountOnExit>
            {isCreating && (
              <BoardColumnForm
                isLoading={isLoading}
                label="Add New Column"
                addButtonText="Add Column"
                handleSubmit={handleCreateColumn}
                inputRef={callbackRef}
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

export default BoardColumns;
