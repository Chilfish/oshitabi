import { create } from "zustand";

interface CameraState {
  // 拍照相关状态
  capturedImage: string | null;
  facingMode: "user" | "environment";
  isCameraReady: boolean;

  // 角色相关状态
  selectedCharacter: string;
  characterScale: number;

  // 操作方法
  setCapturedImage: (image: string | null) => void;
  setFacingMode: (mode: "user" | "environment") => void;
  setIsCameraReady: (ready: boolean) => void;
  setSelectedCharacter: (character: string) => void;
  setCharacterScale: (scale: number) => void;
  switchCamera: () => void;
  resetCamera: () => void;
}

export // 预设角色列表
const PRESET_CHARACTERS = [
  { id: "character1", name: "角色1", src: "/tomori.png" },
  { id: "character2", name: "角色2", src: "/anon.png" },
  { id: "character3", name: "角色3", src: "/rana.png" },
  { id: "character4", name: "角色4", src: "/soyo.png" },
  { id: "character5", name: "角色4", src: "/taki.png" },
] as const;

export const useCameraStore = create<CameraState>((set) => ({
  // 初始状态
  capturedImage: null,
  facingMode: "environment",
  isCameraReady: false,
  selectedCharacter: PRESET_CHARACTERS[0].src,
  characterScale: 1,

  // 操作方法
  setCapturedImage: (image) => set({ capturedImage: image }),
  setFacingMode: (mode) => set({ facingMode: mode }),
  setIsCameraReady: (ready) => set({ isCameraReady: ready }),
  setSelectedCharacter: (character) => set({ selectedCharacter: character }),
  setCharacterScale: (scale) => set({ characterScale: scale }),

  switchCamera: () =>
    set((state) => ({
      facingMode: state.facingMode === "user" ? "environment" : "user",
    })),

  resetCamera: () =>
    set({
      capturedImage: null,
      characterScale: 1,
      isCameraReady: false,
    }),
}));
