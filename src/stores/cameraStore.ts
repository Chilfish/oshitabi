import { create } from "zustand";

type DragMode = "character" | "frame" | "none";
type TabType = "character" | "frame";

interface CameraState {
  // 拍照相关状态
  capturedImage: string | null;
  facingMode: "user" | "environment";
  isCameraReady: boolean;

  // 角色相关状态
  selectedCharacter: string;
  characterScale: number;
  showCharacter: boolean;

  // 相框相关状态
  selectedFrame: string;
  frameScale: number;
  showFrame: boolean;

  // 拖拽模式状态
  activeDragMode: DragMode;

  // 当前激活的标签页
  activeTab: TabType;

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
  setActiveDragMode: (mode: DragMode) => void;
  setActiveTab: (tab: TabType) => void;
  switchCamera: () => void;
  resetCamera: () => void;
}

// 预设角色列表
export const PRESET_CHARACTERS = [
  { id: "character1", name: "高松灯", src: "/tomori.png" },
  { id: "character2", name: "真白", src: "/mashiro.jpg" },
  { id: "character3", name: "若叶睦", src: "/mutsumi.png" },
  { id: "character4", name: "喵梦", src: "/nyamu.png" },
  { id: "character5", name: "初华", src: "/uika.png" },
  { id: "character6", name: "海铃", src: "/umiri.png" },
  { id: "character7", name: "祥子", src: "/sakiko.png" },
] as const;

// 预设相框列表
export const PRESET_FRAMES = [
  { id: "frame1", name: "推し旅", src: "/frame.png" },
  { id: "frame2", name: "mygo", src: "/mygo.png" },
  { id: "frame3", name: "mygo夏天", src: "/frame-anon.png" },
  { id: "frame4", name: "mygo夏天", src: "/frame-tomori.png" },
  { id: "frame5", name: "mygo夏天", src: "/frame-taki.png" },
  { id: "frame6", name: "mygo夏天", src: "/frame-soyo.png" },
  { id: "frame7", name: "mygo夏天", src: "/frame-rana.png" },
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
  activeDragMode: "character",
  activeTab: "character",

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
  setActiveDragMode: (mode) => set({ activeDragMode: mode }),
  setActiveTab: (tab) =>
    set({
      activeTab: tab,
      activeDragMode: tab,
    }),

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
      activeDragMode: "none",
    }),
}));
