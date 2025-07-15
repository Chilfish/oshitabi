import { Check, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PRESET_FRAMES, useCameraStore } from "@/stores/cameraStore";

export default function FrameSelector() {
  const {
    selectedFrame,
    setSelectedFrame,
    showFrame,
    setShowFrame,
    frameScale,
    setFrameScale,
  } = useCameraStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFrameSelect = (frameSrc: string) => {
    setSelectedFrame(frameSrc);
    setShowFrame(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }

    // 创建文件预览URL
    const fileUrl = URL.createObjectURL(file);
    setSelectedFrame(fileUrl);
    setShowFrame(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">相框设置</h3>
        <div className="flex items-center gap-2">
          <Label htmlFor="frame-toggle">显示相框</Label>
          <Switch
            id="frame-toggle"
            checked={showFrame}
            onCheckedChange={setShowFrame}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* 相框缩放控制 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">相框大小</Label>
          <div className="flex items-center gap-2">
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
          <p className="text-xs text-gray-500">拖拽相框图片可以移动位置</p>
        </div>

        {/* 预设相框网格 */}
        <div className="grid grid-cols-3 gap-3">
          {PRESET_FRAMES.map((frame) => (
            <button
              type="button"
              key={frame.id}
              onClick={() => handleFrameSelect(frame.src)}
              className={`relative aspect-square rounded-lg border-2 overflow-hidden p-2 transition-all ${
                selectedFrame === frame.src
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={frame.src}
                alt={frame.name}
                className="w-full h-full object-cover"
              />
              {selectedFrame === frame.src && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 自定义上传按钮 */}
        <Button
          onClick={handleUploadClick}
          variant="outline"
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          上传自定义相框
        </Button>

        <p className="text-xs text-gray-500">
          💡 提示：请上传 3:4 比例的透明底 PNG 图片以获得最佳效果
        </p>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
