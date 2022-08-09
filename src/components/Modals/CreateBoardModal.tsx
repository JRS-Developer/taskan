import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { HiGlobe, HiLockClosed, HiPhotograph, HiPlus } from "react-icons/hi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { trpc } from "@/utils/trpc";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const schema = z.object({
  title: z.string().min(1, { message: "The title can't be empty" }),
});

type FormData = z.infer<typeof schema>;

const CreateBoardModal = ({ isOpen, onClose }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation(["boards.createOne"], {
    onSuccess(newBoard) {
      // Update queries
      utils.invalidateQueries(["boards.getAll"]);
      // Show success message
      toast({
        title: "Board created successfully!",
        status: "success",
      });
      onClose();
    },
  });
  const toast = useToast();

  const [isPrivate, setIsPrivate] = useState(true);

  const onSubmit = (data: FormData) =>
    mutate({
      title: data.title,
      isPrivate,
    });

  const handleChangePrivate = (value: boolean) => setIsPrivate(value);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <ModalHeader>Create New Board</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={Boolean(errors?.title)}>
            <FormLabel>Title</FormLabel>
            <Input placeholder="Add board title" {...register("title")} />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>

          <Flex justify="space-between" gap="12" mt="4">
            <Button leftIcon={<HiPhotograph />} w="full">
              Cover
            </Button>
            <Menu isLazy>
              <MenuButton
                as={Button}
                leftIcon={isPrivate ? <HiLockClosed /> : <HiGlobe />}
                w="full"
              >
                {isPrivate ? "Private" : "Public"}
              </MenuButton>

              <MenuList>
                <MenuItem
                  icon={<HiLockClosed />}
                  onClick={() => handleChangePrivate(true)}
                >
                  Private
                </MenuItem>
                <MenuItem
                  icon={<HiGlobe />}
                  onClick={() => handleChangePrivate(false)}
                >
                  Public
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            leftIcon={<HiPlus />}
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting"
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateBoardModal;
