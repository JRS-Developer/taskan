import create from "zustand";

interface CardModalState {
  cardId?: string;
  isOpen: boolean;
  open: (cardId: string) => void;
  close: () => void;
}

export const useCardModalStore = create<CardModalState>()((set) => ({
  isOpen: false,
  open: (cardId) => set((state) => ({ ...state, isOpen: true, cardId })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));
