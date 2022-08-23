import { type UnsplashPhotoT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Grid,
  GridItem,
  Icon,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverProps,
  PopoverTrigger,
  Skeleton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useMemo, useState, type SyntheticEvent } from "react";
import { HiPlus } from "react-icons/hi";

type OnClickImage = (photo: UnsplashPhotoT) => void;

interface Props {
  triggerProps?: ButtonProps;
  popoverProps?: PopoverProps;
  onClickImage: OnClickImage;
  isLoading: boolean;
}

interface UnsplashImageProps {
  photo: UnsplashPhotoT;
  onClickImage: OnClickImage;
}

const UnsplashImage = ({ photo, onClickImage }: UnsplashImageProps) => {
  return (
    <Box
      position="relative"
      w="50px"
      h="50px"
      overflow="hidden"
      rounded="base"
      onClick={() => onClickImage(photo)}
      _active={{
        opacity: "90%",
      }}
      _hover={{
        cursor: "pointer",
        "&>div": {
          opacity: "100%",
        },
      }}
    >
      <Image
        src={photo.urls.thumb}
        alt={photo.description || photo.alt_description || ""}
        layout="fill"
        objectFit="cover"
      />
      <Flex
        justify="center"
        align="center"
        opacity="0"
        position="absolute"
        w="full"
        h="full"
        left={0}
        top={0}
        backgroundColor="blackAlpha.800"
        transition="opacity 0.2s"
        color="white"
      >
        <Icon as={HiPlus} color="white" />
      </Flex>
    </Box>
  );
};

const LoadingOverlay = () => (
  <Box
    bg="blackAlpha.700"
    h="100%"
    w="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
    position="absolute"
    top="0"
    left="0"
    color="white"
  >
    <Spinner size="xl" />
  </Box>
);

const UnsplashPopover = ({
  triggerProps,
  popoverProps,
  onClickImage,
  isLoading,
}: Props) => {
  const [query, setQuery] = useState("");
  const perPage = 12;
  const emptyArray = useMemo(
    () => new Array(perPage).fill(undefined),
    [perPage]
  );

  const getPhotos = trpc.useQuery(
    [
      "unsplash.getPhotos",
      {
        perPage,
      },
    ],
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    }
  );

  const searchPhotos = trpc.useQuery(
    [
      "unsplash.searchPhotos",
      {
        query,
        perPage,
      },
    ],
    {
      enabled: query !== "",
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    }
  );

  const isLoadingImages = searchPhotos.isLoading || getPhotos.isLoading;

  const handleQuery = (e: SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };
    const newQuery = target.search.value;

    // set query and that will execute the searchPhotos query
    setQuery(newQuery);
  };

  return (
    <Popover {...popoverProps}>
      <PopoverTrigger>
        <Button {...triggerProps} />
      </PopoverTrigger>

      <PopoverContent rounded="xl" w="min-content">
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
        <PopoverBody>
          <form onSubmit={handleQuery}>
            <Input
              name="search"
              placeholder="eg: food, cars"
              autoComplete="off"
            />
          </form>

          <Grid
            templateColumns="repeat(4,min-content)"
            rowGap="2"
            columnGap="3"
            mt="5"
            position="relative"
            overflow="hidden"
            rounded="base"
          >
            {isLoadingImages &&
              emptyArray.map((_, i) => (
                <GridItem key={`${i}-unsplash-skeleton`}>
                  <Skeleton h="50px" w="50px"></Skeleton>
                </GridItem>
              ))}

            {query &&
              searchPhotos.isSuccess &&
              searchPhotos.data.map((photo) => (
                <GridItem key={photo.id}>
                  <UnsplashImage photo={photo} onClickImage={onClickImage} />
                </GridItem>
              ))}

            {!query &&
              getPhotos.isSuccess &&
              getPhotos.data.map((photo) => (
                <GridItem key={photo.id}>
                  <UnsplashImage photo={photo} onClickImage={onClickImage} />
                </GridItem>
              ))}

            {isLoading && <LoadingOverlay />}
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default UnsplashPopover;
