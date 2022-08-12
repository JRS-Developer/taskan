import {
  HStack,
  IconButton,
  Button,
  FormControl,
  VisuallyHidden,
  FormLabel,
  Input,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { z } from "zod";

type Props = {
  isLoading: boolean;
  onCancel: () => any;
  onSubmit: SubmitHandler<FormData>;
  inputPlaceholder: string;
  label: string;
  addButtonText: string;
};

const schema = z.object({
  name: z.string().min(1, {
    message: "The name is required",
  }),
});

type FormData = z.infer<typeof schema>;

const BoardColumnForm = ({
  onSubmit,
  isLoading,
  onCancel,
  inputPlaceholder,
  label,
  addButtonText,
}: Props) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box shadow="md" rounded="md" p="3" bg="white">
        <FormControl isInvalid={Boolean(errors.name)}>
          <VisuallyHidden>
            <FormLabel htmlFor="name">{label}</FormLabel>
          </VisuallyHidden>
          <Input
            id="name"
            placeholder={inputPlaceholder}
            {...register("name")}
          />
          <FormErrorMessage>
            {Boolean(errors.name) && errors.name?.message}
          </FormErrorMessage>
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
};

export default BoardColumnForm;
