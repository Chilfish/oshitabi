import { ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useCameraStore } from "@/stores/cameraStore";

export default function ZoomControls() {
  const { characterScale, setCharacterScale } = useCameraStore();

  return (
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
  );
}
