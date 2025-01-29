import { create } from "zustand";

export interface PreviewItem {
  type: "image" | "video";
  url: string;
  id: string;
  file?: File;
  order: number;
}

interface PreviewState {
  preview: {
    items: PreviewItem[];
    text?: string;
  };
  setPreview: (update: Partial<PreviewState["preview"]>) => void;
  addItem: (item: PreviewItem) => void; // Add images/videos while maintaining order
  resetPreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  preview: {
    items: [],
    text: "",
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
          { ...item, order: state.preview.items.length + 1 }, // Assign sequential order
        ],
      },
    })),

  resetPreview: () => set({ preview: { items: [], text: "" } }),
}));
