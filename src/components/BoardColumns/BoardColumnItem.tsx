import { type BoardColumnByIdT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";
import { Flex, Button, useBoolean, Collapse, useToast } from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi";
import ColumnCards from "../ColumnCards";
import BoardColumnForm from "./BoardColumnForm";
import BoardColumnHeader from "./BoardColumnHeader";

type Props = {
  column: BoardColumnByIdT;
};

const BoardColumnItem = ({ column: { id, name, cards, boardId } }: Props) => {
  const [isCreating, setIsCreating] = useBoolean(false);

  const toast = useToast();
  const utils = trpc.useContext();

  // this is to invalidate board data and refetch again
  const invalidateQuery = () => {
    if (boardId) {
      utils.invalidateQueries(["boards.getOneById", { id: boardId }]);
    }
  };

  const createCard = trpc.useMutation(["cards.createOne"], {
    onSuccess: () => {
      // refetch board
      invalidateQuery();
      // show success message
      toast({
        status: "success",
        title: "Card created successfully",
      });
    },
  });

  const deleteColumn = trpc.useMutation(["columns.deleteById"], {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Column deleted successfully",
      });
    },
    onSettled: () => invalidateQuery(),
  });

  const handleCreateCard = ({ name }: { name: string }) => {
    createCard.mutate({
      name,
      columnId: id,
    });

    setIsCreating.off();
  };

  const handleDeleteColumn = () =>
    deleteColumn.mutate({
      id,
    });

  return (
    <Flex direction="column" w="244px" gap="6">
      <BoardColumnHeader
        name={name}
        handleDelete={handleDeleteColumn}
        isLoading={deleteColumn.isLoading}
      />

      <ColumnCards cards={cards} />

      <Collapse in={isCreating} animateOpacity unmountOnExit>
        {isCreating && (
          <BoardColumnForm
            addButtonText="Add card"
            isLoading={createCard.isLoading}
            onSubmit={handleCreateCard}
            label="Add New Card"
            onCancel={setIsCreating.off}
            inputPlaceholder="Insert card name..."
          />
        )}
      </Collapse>
      {!isCreating && (
        <Button
          rightIcon={<HiPlus />}
          colorScheme="blue"
          variant="outline"
          onClick={setIsCreating.on}
        >
          Add another card
        </Button>
      )}
    </Flex>
  );
};

export default BoardColumnItem;
