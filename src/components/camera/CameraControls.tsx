import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCameraStore } from "@/stores/cameraStore";

interface CameraControlsProps {
  onTakePhoto: () => void;
}

export default function CameraControls({ onTakePhoto }: CameraControlsProps) {
  const { isCameraReady, switchCamera } = useCameraStore();

  return (
    <div className="flex justify-around items-center">
      {/* 占位符，保持拍照按钮居中 */}
      <div className="w-12 h-12 bg-amber-50 rounded-2xl" />
      <Button
        onClick={onTakePhoto}
        disabled={!isCameraReady}
        size="icon"
        className="w-12 h-12 rounded-full"
      >
        <Camera className="w-10 h-10" />
      </Button>
      <Button
        onClick={switchCamera}
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full"
      >
        <RefreshCw className="w-8 h-8" />
      </Button>
    </div>
  );
}
