import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { useCameraStore } from "@/stores/cameraStore";

interface CameraViewProps {
  webcamRef: React.RefObject<Webcam | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  characterRef: React.RefObject<HTMLImageElement | null>;
  frameRef: React.RefObject<HTMLImageElement | null>;
  onUserMedia: () => void;
}

export default function CameraView({
  webcamRef,
  containerRef,
  characterRef,
  frameRef,
  onUserMedia,
}: CameraViewProps) {
  const {
    facingMode,
    isCameraReady,
    selectedCharacter,
    characterScale,
    showCharacter,
    selectedFrame,
    frameScale,
    showFrame,
  } = useCameraStore();

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: facingMode,
  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
        onUserMediaError={(err) => console.error(err)}
        className="w-full h-full object-cover"
      />

      {/* 摄像头未就绪时的提示 */}
      {!isCameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p className="text-white">正在等待相机权限...</p>
        </div>
      )}

      {/* 可拖动和缩放的人物 */}
      {showCharacter && (
        <motion.div
          drag
          dragConstraints={containerRef}
          className="absolute top-1/4 left-1/4 w-1/2 h-auto z-10 cursor-move"
          style={{ scale: characterScale }}
        >
          <img
            ref={characterRef}
            src={selectedCharacter}
            alt="Character"
            className="w-full h-full pointer-events-none"
          />
        </motion.div>
      )}

      {/* 可拖动和缩放的框架图 */}
      {showFrame && (
        <motion.div
          drag
          dragConstraints={containerRef}
          className="absolute inset-0 w-full h-full z-20 cursor-move"
          style={{ scale: frameScale }}
        >
          <img
            ref={frameRef}
            src={selectedFrame}
            alt="Frame"
            className="w-full h-full pointer-events-none"
          />
        </motion.div>
      )}
    </>
  );
}
