import { useCallback, useRef } from "react";
import type Webcam from "react-webcam";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/radix/tabs";
import { useCameraStore } from "@/stores/cameraStore";
import CameraControls from "./camera/CameraControls";
import CameraView from "./camera/CameraView";
import CharacterSelector from "./camera/CharacterSelector";
import FrameSelector from "./camera/FrameSelector";
import PreviewControls from "./camera/PreviewControls";

export default function Cam() {
  const {
    capturedImage,
    selectedCharacter,
    selectedFrame,
    showCharacter,
    showFrame,
    activeTab,
    setCapturedImage,
    setIsCameraReady,
    setActiveTab,
  } = useCameraStore();

  // 当 tab 切换时，更新拖拽模式
  const handleTabChange = (value: string) => {
    setActiveTab(value as "character" | "frame");
  };

  // Refs
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewContainerRef = useRef<HTMLDivElement>(null); // New ref for the inner container
  const characterRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLImageElement>(null);

  // 当用户允许摄像头时，设置摄像头为就绪状态
  const handleUserMedia = () => {
    console.log("Camera is ready.");
    setIsCameraReady(true);
  };

  // 拍照逻辑
  const handleTakePhoto = useCallback(async () => {
    if (!webcamRef.current || !viewContainerRef.current || !canvasRef.current) {
      return;
    }

    const video = webcamRef.current.video;
    if (!video) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. 设置画布为高清 3:4 分辨率
    const canvasWidth = 1080;
    const canvasHeight = 1440;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const targetAspectRatio = canvasWidth / canvasHeight;

    // 2. 计算视频源的裁剪区域
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoAspectRatio = videoWidth / videoHeight;

    let sx = 0;
    let sy = 0;
    let sWidth = videoWidth;
    let sHeight = videoHeight;

    if (videoAspectRatio > targetAspectRatio) {
      // 视频更宽，裁剪宽度
      sHeight = videoHeight;
      sWidth = videoHeight * targetAspectRatio;
      sx = (videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      // 视频更高，裁剪高度
      sWidth = videoWidth;
      sHeight = videoWidth / targetAspectRatio;
      sx = 0;
      sy = (videoHeight - sHeight) / 2;
    }

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });

    try {
      // 3. 绘制高清视频帧到画布
      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        canvasWidth,
        canvasHeight,
      );

      // 4. 加载并绘制叠加图层（相框和角色）
      const loadPromises: Promise<HTMLImageElement>[] = [];
      if (showCharacter) {
        loadPromises.push(loadImage(selectedCharacter));
      }
      if (showFrame) {
        loadPromises.push(loadImage(selectedFrame));
      }

      const images = await Promise.all(loadPromises);
      const characterImage = showCharacter ? images.shift() : null;
      const frameImage = showFrame ? images.shift() : null;

      const containerRect = viewContainerRef.current.getBoundingClientRect();
      const canvasScaleRatio = canvasWidth / containerRect.width;

      const drawOverlay = (
        image: HTMLImageElement | null | undefined,
        ref: React.RefObject<HTMLImageElement | null>,
      ) => {
        if (!image || !ref.current) return;

        const elementRect = ref.current.getBoundingClientRect();
        const canvasX =
          (elementRect.left - containerRect.left) * canvasScaleRatio;
        const canvasY =
          (elementRect.top - containerRect.top) * canvasScaleRatio;
        const canvasW = elementRect.width * canvasScaleRatio;
        const canvasH = elementRect.height * canvasScaleRatio;

        ctx.drawImage(image, canvasX, canvasY, canvasW, canvasH);
      };

      // 绘制相框 (背景)
      drawOverlay(frameImage, frameRef);
      // 绘制角色 (前景)
      drawOverlay(characterImage, characterRef);

      // 4. 从 Canvas 获取最终的合成图片
      const finalImage = canvas.toDataURL("image/png");
      setCapturedImage(finalImage);
    } catch (error) {
      console.error("合成图片时出错:", error);
      alert("合成图片时出错:" + error);
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
    link.download = `oshitabi-photo-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 重拍
  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <main className="w-full mx-auto flex flex-col md:flex-row gap-4 md:px-12">
      {/* 主内容区域 */}
      <section className="relative w-full aspect-[3/4] bg-black rounded-md overflow-hidden shadow-2xl border-4 border-gray-700">
        <div ref={viewContainerRef} className="absolute inset-0 w-full h-full">
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
              containerRef={viewContainerRef}
              characterRef={characterRef}
              frameRef={frameRef}
              onUserMedia={handleUserMedia}
            />
          )}
        </div>
      </section>

      <section className="md:w-3/4 md:ml-6">
        {capturedImage ? (
          // 预览模式下的按钮
          <PreviewControls
            onRetake={handleRetake}
            onDownload={handleDownload}
          />
        ) : (
          // 拍照模式下的控件
          <CameraControls onTakePhoto={handleTakePhoto} />
        )}

        {/* 设置面板 */}
        {!capturedImage && (
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full mt-8"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="character">角色设置</TabsTrigger>
              <TabsTrigger value="frame">相框设置</TabsTrigger>
            </TabsList>
            <TabsContent value="character" className="mt-3">
              <CharacterSelector />
            </TabsContent>
            <TabsContent value="frame" className="mt-3">
              <FrameSelector />
            </TabsContent>
          </Tabs>
        )}
      </section>

      {/* 隐藏的 Canvas，用于合成图片 */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </main>
  );
}
