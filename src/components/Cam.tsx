import { useCallback, useRef, useState } from "react";
import type Webcam from "react-webcam";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/radix/tabs";
import { Button } from "@/components/ui/button";
import { useCameraStore } from "@/stores/cameraStore";
import CameraControls from "./camera/CameraControls";
import CameraView from "./camera/CameraView";
import CharacterSelector from "./camera/CharacterSelector";
import FrameControls from "./camera/FrameControls";
import FrameSelector from "./camera/FrameSelector";
import PreviewControls from "./camera/PreviewControls";
import ZoomControls from "./camera/ZoomControls";

export default function Cam() {
  const {
    capturedImage,
    selectedCharacter,
    selectedFrame,
    showCharacter,
    showFrame,
    setCapturedImage,
    setIsCameraReady,
  } = useCameraStore();

  const [activeTab, setActiveTab] = useState("character");

  // Refs
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);

  // 当用户允许摄像头时，设置摄像头为就绪状态
  const handleUserMedia = () => {
    console.log("Camera is ready.");
    setIsCameraReady(true);
  };

  // 拍照逻辑
  const handleTakePhoto = useCallback(async () => {
    if (!webcamRef.current || !containerRef.current || !canvasRef.current) {
      return;
    }

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      alert("无法获取摄像头画面，请检查摄像头权限。");
      return;
    }

    const video = webcamRef.current.video;
    if (!video) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });

    try {
      const loadPromises = [loadImage(screenshot)];

      // 根据开关状态决定是否加载角色和框架图片
      if (showCharacter) {
        loadPromises.push(loadImage(selectedCharacter));
      }
      if (showFrame) {
        loadPromises.push(loadImage(selectedFrame));
      }

      const images = await Promise.all(loadPromises);
      const webcamImage = images[0];
      const characterImage = showCharacter ? images[1] : null;
      const frameImage = showFrame ? images[showCharacter ? 2 : 1] : null;

      // 1. 绘制摄像头画面
      ctx.drawImage(webcamImage, 0, 0, canvas.width, canvas.height);

      // 2. 绘制角色图片（如果启用）
      if (showCharacter && characterImage && characterRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const characterRect = characterRef.current.getBoundingClientRect();

        const relativeX = characterRect.left - containerRect.left;
        const relativeY = characterRect.top - containerRect.top;
        const ratioX = relativeX / containerRect.width;
        const ratioY = relativeY / containerRect.height;
        const ratioW = characterRect.width / containerRect.width;
        const ratioH = characterRect.height / containerRect.height;

        const canvasCharacterX = ratioX * canvas.width;
        const canvasCharacterY = ratioY * canvas.height;
        const canvasCharacterW = ratioW * canvas.width;
        const canvasCharacterH = ratioH * canvas.height;

        ctx.drawImage(
          characterImage,
          canvasCharacterX,
          canvasCharacterY,
          canvasCharacterW,
          canvasCharacterH,
        );
      }

      // 3. 绘制框架图片（如果启用）
      if (showFrame && frameImage && frameRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const frameRect = frameRef.current.getBoundingClientRect();

        const relativeX = frameRect.left - containerRect.left;
        const relativeY = frameRect.top - containerRect.top;
        const ratioX = relativeX / containerRect.width;
        const ratioY = relativeY / containerRect.height;
        const ratioW = frameRect.width / containerRect.width;
        const ratioH = frameRect.height / containerRect.height;

        const canvasFrameX = ratioX * canvas.width;
        const canvasFrameY = ratioY * canvas.height;
        const canvasFrameW = ratioW * canvas.width;
        const canvasFrameH = ratioH * canvas.height;

        ctx.drawImage(
          frameImage,
          canvasFrameX,
          canvasFrameY,
          canvasFrameW,
          canvasFrameH,
        );
      }

      // 4. 从 Canvas 获取最终的合成图片
      const finalImage = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(finalImage);
    } catch (error) {
      console.error("合成图片时出错:", error);
      alert("图片加载失败，请检查图片文件是否存在。");
    }
  }, [
    selectedCharacter,
    selectedFrame,
    showCharacter,
    showFrame,
    setCapturedImage,
  ]);

  // 下载图片
  const handleDownload = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `oshitabi-photo-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 重拍
  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      {/* 主内容区域 */}
      <main
        ref={containerRef}
        className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-700"
      >
        {capturedImage ? (
          // 预览模式
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          // 拍照模式
          <CameraView
            webcamRef={webcamRef}
            containerRef={containerRef}
            characterRef={characterRef}
            frameRef={frameRef}
            onUserMedia={handleUserMedia}
          />
        )}
      </main>

      {/* 控制区域 */}
      <footer className="w-full">
        {capturedImage ? (
          // 预览模式下的按钮
          <PreviewControls
            onRetake={handleRetake}
            onDownload={handleDownload}
          />
        ) : (
          // 拍照模式下的控件
          <div className="space-y-2 ">
            <ZoomControls />
            <FrameControls />
            <CameraControls onTakePhoto={handleTakePhoto} />
          </div>
        )}
      </footer>

      {/* 设置面板 */}
      {!capturedImage && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="character">角色设置</TabsTrigger>
            <TabsTrigger value="frame">框架设置</TabsTrigger>
          </TabsList>
          <TabsContent value="character" className="mt-3">
            <CharacterSelector />
          </TabsContent>
          <TabsContent value="frame" className="mt-3">
            <FrameSelector />
          </TabsContent>
        </Tabs>
      )}

      {/* 隐藏的 Canvas，用于合成图片 */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
