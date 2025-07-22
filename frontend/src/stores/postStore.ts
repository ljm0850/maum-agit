import { create } from "zustand";
import { Post } from "../lib/api";

interface TempPostState {
  tempTitle: string;  // 작성중인 post의 title 임시 저장
  tempContent: string; // 작성중인 post의 content 임시 저장
  selectedPost?: Post; // 글 수정에 앞서 수정할 Post
  setTempTitle: (title: string) => void;
  setTempContent: (content: string) => void;
  setSelectedPost: (article:Post|undefined) => void;
  clearTempPost: () => void;
  clearSelectedPost: () => void;
  clearAllPostData: () => void;
}
export const useTempPostStore = create<TempPostState>((set) => ({
  tempTitle: '',
  tempContent: '',
  selectedPost: undefined,
  setTempTitle: (title) => set({ tempTitle: title }),
  setTempContent: (content) => set({ tempContent: content }),
  setSelectedPost: (post) => set({ selectedPost:post}),
  clearTempPost: () => set({ tempTitle: '', tempContent: '' }),
  clearSelectedPost: () => set({selectedPost: undefined}),
  clearAllPostData: () => set({tempTitle:'', tempContent:'' ,selectedPost:undefined})
}));