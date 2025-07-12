import { motion } from "framer-motion";
import {
  Camera,
  Download,
  RefreshCw,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// App 组件
export default function App() {
  // 状态管理
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [characterScale, setCharacterScale] = useState(1);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Refs
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLImageElement>(null);

  // 当用户允许摄像头时，设置摄像头为就绪状态
  const handleUserMedia = () => {
    console.log("Camera is ready.");
    setIsCameraReady(true);
  };

  // 切换前后摄像头
  const handleSwitchCamera = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  }, []);

  // 拍照逻辑
  const handleTakePhoto = useCallback(async () => {
    // 确保所有需要的元素都已加载
    if (
      !webcamRef.current ||
      !containerRef.current ||
      !characterRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    // 获取摄像头截图 (base64)
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

    // 设置 Canvas 的尺寸为摄像头的实际分辨率，以保证最高画质
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 异步加载所有图片
    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });

    try {
      // 等待所有图片加载完成
      const [webcamImage, characterImage, frameImage] = await Promise.all([
        loadImage(screenshot),
        loadImage("/character.png"), // 从 public 文件夹加载
        loadImage("/frame.png"), // 从 public 文件夹加载
      ]);

      // 1. 绘制摄像头画面
      ctx.drawImage(webcamImage, 0, 0, canvas.width, canvas.height);

      // 2. 计算人物图片在 Canvas 上的位置和尺寸
      const containerRect = containerRef.current.getBoundingClientRect();
      const characterRect = characterRef.current.getBoundingClientRect();

      // 计算人物图片相对于容器的比例位置和尺寸
      const relativeX = characterRect.left - containerRect.left;
      const relativeY = characterRect.top - containerRect.top;
      const ratioX = relativeX / containerRect.width;
      const ratioY = relativeY / containerRect.height;
      const ratioW = characterRect.width / containerRect.width;
      const ratioH = characterRect.height / containerRect.height;

      // 将比例应用到 Canvas 尺寸上，得到最终绘制的坐标和大小
      const canvasCharacterX = ratioX * canvas.width;
      const canvasCharacterY = ratioY * canvas.height;
      const canvasCharacterW = ratioW * canvas.width;
      const canvasCharacterH = ratioH * canvas.height;

      // 绘制人物图片
      ctx.drawImage(
        characterImage,
        canvasCharacterX,
        canvasCharacterY,
        canvasCharacterW,
        canvasCharacterH,
      );

      // 3. 绘制最上层的框架
      ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

      // 4. 从 Canvas 获取最终的合成图片 (JPEG 格式以减小文件大小)
      const finalImage = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(finalImage);
    } catch (error) {
      console.error("合成图片时出错:", error);
      alert("图片加载失败，请检查图片文件是否存在于 public 文件夹下。");
    }
  }, []);

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

  // 视频约束
  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: facingMode,
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto flex flex-col">
        {/* 主内容区域 */}
        <main
          ref={containerRef}
          className="relative w-full aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-700"
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
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                onUserMediaError={(err) => console.error(err)}
                className="w-full h-full object-cover"
              />
              {/* 摄像头未就绪时的提示 */}
              {!isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <p>正在等待相机权限...</p>
                </div>
              )}
              {/* 固定的框架图 */}
              <img
                src="/frame.png"
                alt="Frame"
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
              />
              {/* 可拖动和缩放的人物 */}
              <motion.div
                drag
                dragConstraints={containerRef}
                className="absolute top-1/4 left-1/4 w-1/2 h-auto z-10 cursor-move"
                style={{ scale: characterScale }}
              >
                <img
                  ref={characterRef}
                  src="/character.png"
                  alt="Character"
                  className="w-full h-full pointer-events-none"
                />
              </motion.div>
            </>
          )}
        </main>

        {/* 控制区域 */}
        <footer className="w-full mt-4">
          {capturedImage ? (
            // 预览模式下的按钮
            <div className="flex justify-around items-center">
              <Button
                onClick={handleRetake}
                variant="outline"
                size="lg"
                className="rounded-full p-4"
              >
                <Undo2 className="w-6 h-6 mr-2" />
                重拍
              </Button>
              <Button
                onClick={handleDownload}
                size="lg"
                className="rounded-full p-4"
              >
                <Download className="w-6 h-6 mr-2" />
                下载图片
              </Button>
            </div>
          ) : (
            // 拍照模式下的控件
            <>
              {/* 缩放滑块 */}
              <div className="flex items-center gap-2 px-4 mb-4">
                <ZoomOut className="w-5 h-5 text-gray-400" />
                <Slider
                  value={[characterScale]}
                  onValueChange={(value) => setCharacterScale(value[0])}
                  min={0.2}
                  max={2.5}
                  step={0.05}
                />
                <ZoomIn className="w-5 h-5 text-gray-400" />
              </div>
              {/* 操作按钮 */}
              <div className="flex justify-around items-center">
                <Button
                  onClick={handleSwitchCamera}
                  variant="ghost"
                  size="icon"
                  className="w-16 h-16 rounded-full"
                >
                  <RefreshCw className="w-8 h-8" />
                </Button>
                <Button
                  onClick={handleTakePhoto}
                  disabled={!isCameraReady}
                  size="icon"
                  className="w-20 h-20 rounded-full bg-white text-black hover:bg-gray-200"
                >
                  <Camera className="w-10 h-10" />
                </Button>
                {/* 占位符，保持拍照按钮居中 */}
                <div className="w-16 h-16" />
              </div>
            </>
          )}
        </footer>
      </div>

      {/* 隐藏的 Canvas，用于合成图片 */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}
