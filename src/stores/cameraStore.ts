import { create } from "zustand";

interface CameraState {
  // 拍照相关状态
  capturedImage: string | null;
  facingMode: "user" | "environment";
  isCameraReady: boolean;

  // 角色相关状态
  selectedCharacter: string;
  characterScale: number;
  showCharacter: boolean;

  // 框架相关状态
  selectedFrame: string;
  frameScale: number;
  showFrame: boolean;

  // 操作方法
  setCapturedImage: (image: string | null) => void;
  setFacingMode: (mode: "user" | "environment") => void;
  setIsCameraReady: (ready: boolean) => void;
  setSelectedCharacter: (character: string) => void;
  setCharacterScale: (scale: number) => void;
  setShowCharacter: (show: boolean) => void;
  setSelectedFrame: (frame: string) => void;
  setFrameScale: (scale: number) => void;
  setShowFrame: (show: boolean) => void;
  switchCamera: () => void;
  resetCamera: () => void;
}

// 预设角色列表
export const PRESET_CHARACTERS = [
  { id: "character1", name: "角色1", src: "/tomori.png" },
  // { id: "character2", name: "角色2", src: "/anon.png" },
  // { id: "character3", name: "角色3", src: "/rana.png" },
  // { id: "character4", name: "角色4", src: "/soyo.png" },
  // { id: "character5", name: "角色5", src: "/taki.png" },
] as const;

// 预设框架列表
export const PRESET_FRAMES = [
  { id: "frame1", name: "推し旅", src: "/frame.png" },
  { id: "frame12", name: "mygo夏天", src: "/frame-anon.png" },
  { id: "frame13", name: "mygo夏天", src: "/frame-tomori.png" },
  { id: "frame14", name: "mygo夏天", src: "/frame-taki.png" },
  { id: "frame15", name: "mygo夏天", src: "/frame-soyo.png" },
  { id: "frame16", name: "mygo夏天", src: "/frame-rana.png" },
] as const;

export const useCameraStore = create<CameraState>((set) => ({
  // 初始状态
  capturedImage: null,
  facingMode: "environment",
  isCameraReady: false,
  selectedCharacter: PRESET_CHARACTERS[0].src,
  characterScale: 1,
  showCharacter: true,
  selectedFrame: PRESET_FRAMES[0].src,
  frameScale: 1,
  showFrame: true,

  // 操作方法
  setCapturedImage: (image) => set({ capturedImage: image }),
  setFacingMode: (mode) => set({ facingMode: mode }),
  setIsCameraReady: (ready) => set({ isCameraReady: ready }),
  setSelectedCharacter: (character) => set({ selectedCharacter: character }),
  setCharacterScale: (scale) => set({ characterScale: scale }),
  setShowCharacter: (show) => set({ showCharacter: show }),
  setSelectedFrame: (frame) => set({ selectedFrame: frame }),
  setFrameScale: (scale) => set({ frameScale: scale }),
  setShowFrame: (show) => set({ showFrame: show }),

  switchCamera: () =>
    set((state) => ({
      facingMode: state.facingMode === "user" ? "environment" : "user",
    })),

  resetCamera: () =>
    set({
      capturedImage: null,
      characterScale: 1,
      frameScale: 1,
      isCameraReady: false,
    }),
}));
