import { inferQueryOutput } from "@/utils/trpc";
import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  Box,
  Text,
  useBoolean,
  Collapse,
} from "@chakra-ui/react";
import { FormEvent } from "react";
import { HiDotsHorizontal, HiPlus, HiTrash } from "react-icons/hi";
import BoardColumnForm from "./BoardColumnForm";

type Props = {
  column: inferQueryOutput<"boards.getOneById">["lists"][0];
};

const BoardColumnItem = ({ column: { id, name, cards } }: Props) => {
  const [isCreating, setIsCreating] = useBoolean(false);

  const handleCreateCard = (e: FormEvent<HTMLFormElement>) => {};

  return (
    <Flex direction="column" w="244px" gap="6">
      <Flex align="center" justify="space-between">
        <Text>{name}</Text>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Open column options"
            icon={<HiDotsHorizontal />}
          />
          <MenuList>
            <MenuItem icon={<HiTrash />}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {cards.map((card) => (
        <Box key={card.id}>{card.name}</Box>
      ))}
      <Collapse in={isCreating} animateOpacity unmountOnExit>
        {isCreating && (
          <BoardColumnForm
            addButtonText="Add card"
            isLoading={false}
            handleSubmit={handleCreateCard}
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
