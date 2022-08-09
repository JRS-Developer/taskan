import { inferQueryOutput } from "@/utils/trpc";
import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import BoardCard from "./BoardCard";

interface Props extends SimpleGridProps {
  boards: inferQueryOutput<"boards.getAll">;
}

const BoardList = ({ boards, ...rest }: Props) => {
  return (
    <SimpleGrid columns={[1, 2, 3, 4]} spacing="8" {...rest}>
      {boards.map((board) => (
        <BoardCard board={board} key={board.id} />
      ))}
    </SimpleGrid>
  );
};

export default BoardList;
