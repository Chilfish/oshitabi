import { ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useCameraStore } from "@/stores/cameraStore";

export default function FrameControls() {
  const { frameScale, setFrameScale } = useCameraStore();

  return (
    <div className="flex items-center gap-2 px-4 mb-2">
      <span className="text-sm text-gray-600 min-w-[60px]">框架缩放</span>
      <ZoomOut className="w-4 h-4 text-gray-400" />
      <Slider
        value={[frameScale]}
        onValueChange={(value) => setFrameScale(value[0])}
        min={0.5}
        max={2.0}
        step={0.05}
        className="flex-1"
      />
      <ZoomIn className="w-4 h-4 text-gray-400" />
    </div>
  );
}
