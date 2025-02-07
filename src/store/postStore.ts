import { create } from "zustand";

export interface IEditMedia {
  type: "image" | "video";
  url: string;
  public_id?: string;
  order: number;
  _id?: string;
  file?: File;
}

interface EditState {
  data: {
    text?: string;
    items?: IEditMedia[];
    isOrdered: boolean;
  };

  setData: (update: Partial<EditState["data"]>) => void;
  addItem: (item: IEditMedia) => void;
  removeMedia: (_id: string) => void;
}

export const useEditStore = create<EditState>((set) => ({
  data: {
    items: [],
    text: "",
    isOrdered: true,
  },

  setData: (update) =>
    set((state) => ({
      data: {
        ...state.data,
        ...update,
      },
    })),

  addItem: (item) =>
    set((state) => ({
      data: {
        ...state.data,
        items: [
          ...(state.data.items ?? []),
          { ...item, order: (state.data.items ?? []).length + 1 },
        ],
      },
    })),

  removeMedia: (_id) =>
    set((state) => ({
      data: {
        ...state.data,
        isOrdered: false,
        items: state.data.items
          ?.filter((item) => item._id !== _id)
          .map((item, index) => ({
            ...item,
            order: item.order - 1,
          })),
      },
    })),
}));
