import { useRef, useEffect } from "react";
import { CardByIdT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Text,
  Icon,
  Button,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Stack,
  useEditableControls,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  VisuallyHidden,
} from "@chakra-ui/react";
import { HiPlus, HiPencil, HiDocumentText } from "react-icons/hi";
import TextareaAutosize from "@/components/TextareaAutosize";
import useSetCardQueryData from "@/hooks/setQueryData/useSetCardQueryData";
import { useSession } from "next-auth/react";

interface Props {
  card: CardByIdT;
}

const CardInfo = ({ card }: Props) => {
  const { setQueryData } = useSetCardQueryData(card.id);
  const { data } = useSession();
  const user = data?.user;

  const prevRef = useRef<HTMLSpanElement | null>(null);
  const areaRef = useRef<HTMLTextAreaElement | null>(null);

  const updateCardInfo = trpc.useMutation(["cards.updateOne"], {
    onSuccess: (data) => {
      setQueryData(data);
    },
  });

  const EditableDescControls = () => {
    const { isEditing, getEditButtonProps } = useEditableControls();

    return isEditing ? null : (
      <Button
        size="sm"
        leftIcon={<HiPencil />}
        variant="outline"
        color="gray.500"
        {...getEditButtonProps()}
      >
        Edit
      </Button>
    );
  };

  const handleChangeName = (name: string) => {
    if (name === card.name) return;

    updateCardInfo.mutate({
      id: card.id,
      name,
    });
  };

  const handleChangeDesc = (desc: string) => {
    if (desc === card.description) return;

    updateCardInfo.mutate({
      id: card.id,
      description: desc.trim(),
    });
  };

  useEffect(() => {
    // this makes possible that on render the textarea gets a bigger size that the text
    if (prevRef?.current && areaRef?.current) {
      areaRef.current.style.height = `${prevRef.current.scrollHeight}px`;
    }
  }, [card.description]);

  return (
    <>
      <Box>
        <Editable
          defaultValue={card.name}
          fontSize="lg"
          onSubmit={handleChangeName}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Text
          as="span"
          display="inline-block"
          mt="6px"
          fontSize="xs"
          color="gray.500"
        >
          In list{" "}
          <Text as="b" color="black" fontWeight="semiBold">
            {card.boardList.name}
          </Text>
        </Text>
      </Box>
      <Box>
        <Editable
          defaultValue={card?.description || ""}
          fontSize="lg"
          onSubmit={handleChangeDesc}
          isPreviewFocusable={false}
        >
          <Stack spacing={2} direction="row" align="center">
            <Text
              as="span"
              color="gray.500"
              fontSize="xs"
              display="flex"
              alignItems="center"
              gap="2"
            >
              <Icon as={HiDocumentText} aria-label="Document icon" />
              Description
            </Text>
            <EditableDescControls />
          </Stack>
          <EditablePreview ref={prevRef} />
          <TextareaAutosize ref={areaRef} as={EditableTextarea} />
        </Editable>
      </Box>
      <Box>
        <Stack spacing={2} direction="row" align="center">
          <Text
            as="span"
            color="gray.500"
            fontSize="xs"
            display="flex"
            alignItems="center"
            gap="2"
          >
            <Icon as={HiDocumentText} aria-label="Document icon" />
            Attachments
          </Text>
          <Button
            size="sm"
            leftIcon={<HiPlus />}
            variant="outline"
            color="gray.500"
          >
            Add
          </Button>
        </Stack>
        {/* TODO: Show Attachments */}
      </Box>

      <Box>
        <Box display="flex" boxShadow="md" p="4">
          <Box>
            {user && <Avatar src={user?.image ?? ""} name={user?.name ?? ""} />}
          </Box>
          <Box flex="1">
            <form>
              <FormControl>
                <VisuallyHidden>
                  <FormLabel>Comment</FormLabel>
                </VisuallyHidden>
                <Input placeholder="Write a comment..." />
              </FormControl>
              <Box display="flex" justifyContent="flex-end">
                <Button colorScheme="blue" type="submit">
                  Confirm
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CardInfo;
