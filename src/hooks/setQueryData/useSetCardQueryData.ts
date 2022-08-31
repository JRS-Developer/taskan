import { CardByIdT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";

const useSetCardQueryData = (cardId: CardByIdT["id"]) => {
  const utils = trpc.useContext();

  return {
    setQueryData: (data: CardByIdT) => {
      // update card data
      utils.setQueryData(["cards.getOneById", { id: cardId }], data);
      // update board data
      const boardId = data?.boardList?.boardId;
      if (!boardId) return;

      utils.invalidateQueries(["boards.getOneById", { id: boardId }]);
    },
  };
};


export default useSetCardQueryData;
