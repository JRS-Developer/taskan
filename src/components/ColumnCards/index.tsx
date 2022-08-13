import { BoardCardByIdT } from "@/types/trpc-queries";
import ColumnCardItem from "./ColumnCardItem";

type Props = {
  cards: BoardCardByIdT[];
};

const ColumnCards = ({ cards }: Props) => {
  return (
    <>
      {cards.map((card) => (
        <ColumnCardItem key={card.id} card={card} />
      ))}
    </>
  );
};

export default ColumnCards;
