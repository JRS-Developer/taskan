import { type BoardColumnByIdT } from "@/types/trpc-queries";
import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  Text,
  useBoolean,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCloseButton,
  MenuDivider,
  Editable,
  EditablePreview,
  Input,
  EditableInput,
  useEditableControls,
} from "@chakra-ui/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { type MutableRefObject, useRef } from "react";

type Props = {
  name: BoardColumnByIdT["name"];
  handleDelete: () => void;
  isLoading: boolean;
};

type DeleteColumnAlertDialogProps = {
  isOpen: boolean;
  handleDelete: () => void;
  onClose: () => void;
  cancelRef: MutableRefObject<any>;
  isLoading: boolean;
};

const DeleteColumnAlertDialog = ({
  isOpen,
  handleDelete,
  cancelRef,
  onClose,
  isLoading,
}: DeleteColumnAlertDialogProps) => {
  const handleClickDelete = () => {
    handleDelete();
    onClose();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Column
            <AlertDialogCloseButton />
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can&apos;t undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleClickDelete}
              ml={3}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const BoardColumnHeader = ({ name, handleDelete, isLoading }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const cancelRef = useRef(null);

  const handleSubmit = (newName: string) => {
    // if the name didn't change. then don't do anything
    if (newName === name) return;

    // save changes
    // TODO: SAVE DATA

    console.log("save");
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <Editable defaultValue={name} onSubmit={handleSubmit}>
          <EditablePreview />
          <EditableInput />
        </Editable>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Open column options"
            icon={<HiDotsHorizontal />}
          />
          <MenuList>
            <MenuItem onClick={onOpen}>Delete this list</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <DeleteColumnAlertDialog
        cancelRef={cancelRef}
        handleDelete={handleDelete}
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default BoardColumnHeader;
