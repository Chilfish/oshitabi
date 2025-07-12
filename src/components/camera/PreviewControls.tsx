import { Download, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewControlsProps {
  onRetake: () => void;
  onDownload: () => void;
}

export default function PreviewControls({
  onRetake,
  onDownload,
}: PreviewControlsProps) {
  return (
    <div className="flex justify-around items-center">
      <Button
        onClick={onRetake}
        variant="outline"
        size="lg"
        className="rounded-full p-4"
      >
        <Undo2 className="w-6 h-6 mr-2" />
        重拍
      </Button>
      <Button onClick={onDownload} size="lg" className="rounded-full p-4">
        <Download className="w-6 h-6 mr-2" />
        下载图片
      </Button>
    </div>
  );
}
