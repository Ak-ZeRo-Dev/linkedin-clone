import { PreviewItem } from "@/types/post";
import { create } from "zustand";

export interface PreviewState {
  preview: {
    items: PreviewItem[];
    text?: string;
    isPending: boolean;
  };
  setPreview: (update: Partial<PreviewState["preview"]>) => void;
  addItem: (item: PreviewItem) => void;
  setIsPending: (isPending: boolean) => void;
  resetPreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  preview: {
    items: [],
    text: "",
    isPending: false,
  },
  setPreview: (update) =>
    set((state) => ({
      preview: {
        ...state.preview,
        ...update,
      },
    })),

  addItem: (item) =>
    set((state) => ({
      preview: {
        ...state.preview,
        items: [
          ...state.preview.items,
          { ...item, order: state.preview.items.length + 1 },
        ],
      },
    })),

  setIsPending: (isPending: boolean) =>
    set((state) => ({
      preview: {
        ...state.preview,
        isPending,
      },
    })),

  resetPreview: () =>
    set({ preview: { items: [], text: "", isPending: false } }),
}));
