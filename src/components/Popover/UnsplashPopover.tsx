import { trpc } from "@/utils/trpc";
import {
  Button,
  ButtonProps,
  Input,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverProps,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useState, type SyntheticEvent } from "react";

interface Props {
  triggerProps?: ButtonProps;
  popoverProps?: PopoverProps;
}

const UnsplashPopover = ({ triggerProps, popoverProps }: Props) => {
  const [query, setQuery] = useState("");

  const getPhotos = trpc.useQuery(["unsplash.getPhotos"], {
    refetchOnWindowFocus: false,
  });

  const searchPhotos = trpc.useQuery(
    [
      "unsplash.searchPhotos",
      {
        query: query,
      },
    ],
    {
      enabled: query !== "",
      refetchOnWindowFocus: false,
    }
  );

  const handleQuery = (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };
    const newQuery = target.search.value;
    console.log(newQuery);

    if (!newQuery) return;

    // set query and that will execute the searchPhotos query
    setQuery(newQuery);
  };

  console.log("getPhotos: ", getPhotos.data);
  console.log("searchPhotos: ", searchPhotos.data);

  return (
    <Popover {...popoverProps}>
      <PopoverTrigger>
        <Button {...triggerProps} />
      </PopoverTrigger>

      <PopoverContent rounded="xl">
        <PopoverHeader border="0">
          <Text as="span" display="block" fontWeight="semibold" fontSize="xs">
            Photo Search
          </Text>
          <Text
            as="span"
            display="block"
            fontWeight="normal"
            fontSize="xs"
            color="gray.500"
          >
            Search Unsplash for photos
          </Text>
        </PopoverHeader>

        <form onSubmit={handleQuery}>
          <Input name="search" placeholder="eg: food, cars" />
        </form>

        {/* Show unsplash images */}
      </PopoverContent>
    </Popover>
  );
};

export default UnsplashPopover;
