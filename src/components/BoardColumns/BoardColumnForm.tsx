import {
  HStack,
  IconButton,
  Button,
  FormControl,
  VisuallyHidden,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";
import { FormEvent, LegacyRef } from "react";
import { HiX } from "react-icons/hi";

type Props = {
  isLoading: boolean;
  onCancel: () => any;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputRef?: LegacyRef<HTMLInputElement>;
  inputPlaceholder: string;
  label: string;
  addButtonText: string;
};

const BoardColumnForm = ({
  handleSubmit,
  isLoading,
  onCancel,
  inputRef,
  inputPlaceholder,
  label,
  addButtonText,
}: Props) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(e);
    }}
  >
    <Box border="1px" shadow="md" rounded="md" p="2">
      <FormControl>
        <VisuallyHidden>
          <FormLabel>{label}</FormLabel>
        </VisuallyHidden>
        <Input ref={inputRef} placeholder={inputPlaceholder} />
      </FormControl>
      <HStack mt="2">
        <Button colorScheme="blue" type="submit" isLoading={isLoading}>
          {addButtonText}
        </Button>
        <IconButton
          aria-label="Cancel"
          disabled={isLoading}
          onClick={onCancel}
          icon={<HiX />}
        />
      </HStack>
    </Box>
  </form>
);

export default BoardColumnForm;
