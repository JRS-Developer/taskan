type Props = {
  position: number;
};

/**
 * A function that returns the bigger position of a array of items
 * @param items one array that contains position property
 * @returns if the array is empty, returns 0, else returns the max position of the array items
 */
const getLastPosition = <T extends Props>(items: T[]) => {
  if (items.length === 0) return 0;

  return Math.max(...items.map((item) => item.position));
};

export default getLastPosition;
