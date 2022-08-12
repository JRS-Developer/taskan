import { BoardByIdT } from "@/types/trpc-queries";
import { trpc } from "@/utils/trpc";

type Props = {
  boardId: BoardByIdT["id"] | null;
};

/** This hook invalidate the boards.getOneById query
 *  @return Returns a invalidate function that invalidates the query
 */
const useInvalidateBoardQuery = ({ boardId }: Props) => {
  const utils = trpc.useContext();

  const invalidate = () => {
    if (!boardId) return;
    utils.invalidateQueries(["boards.getOneById", { id: boardId }]);
  };

  return {
    invalidate,
  };
};

export default useInvalidateBoardQuery;
