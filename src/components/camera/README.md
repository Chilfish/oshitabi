# 相机组件使用说明

## 概述

这是一个模块化的相机应用组件，支持拍照、角色选择、图片合成等功能。代码按照单一职责原则进行了拆分，使用 Zustand 进行状态管理。

## 组件结构

### 主组件
- `Cam.tsx` - 主相机组件，负责协调各个子组件

### 子组件
- `CameraView.tsx` - 相机视图组件，负责显示摄像头画面和角色
- `CameraControls.tsx` - 相机控制组件，包含拍照和切换摄像头按钮
- `ZoomControls.tsx` - 缩放控制组件，提供角色缩放功能
- `PreviewControls.tsx` - 预览控制组件，提供重拍和下载功能
- `CharacterSelector.tsx` - 角色选择组件，支持预设角色和自定义上传

### 状态管理
- `stores/cameraStore.ts` - Zustand 状态管理，包含所有相机相关状态

## 功能特性

### 角色选择
- 支持预设角色列表（通过 `PRESET_CHARACTERS` 数组配置）
- 支持用户上传自定义角色图片
- 角色可拖拽和缩放

### 拍照功能
- 支持前后摄像头切换
- 高画质图片合成（使用摄像头原始分辨率）
- 多层图片合成：背景（摄像头）+ 角色 + 框架

### 图片处理
- Canvas 合成技术确保高画质输出
- JPEG 格式压缩（90% 质量）
- 自动计算角色在画面中的相对位置

## 配置说明

### 预设角色配置
在 `CharacterSelector.tsx` 中修改 `PRESET_CHARACTERS` 数组：

```typescript
const PRESET_CHARACTERS = [
  { id: 'character1', name: '角色1', src: '/character.png' },
  { id: 'character2', name: '角色2', src: '/character2.png' },
  // 添加更多角色...
];
```

### 所需静态资源
确保 `public` 文件夹中包含以下文件：
- `frame.png` - 框架图片
- `character.png` - 默认角色图片
- `character2.png`, `character3.png` 等 - 其他预设角色图片

## 使用方法

```tsx
import Cam from '@/components/Cam';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Cam />
    </div>
  );
}
```

## 状态管理

所有相机相关状态都通过 Zustand 管理，包括：
- 拍照状态（已拍摄图片、摄像头状态等）
- 角色状态（选中的角色、缩放比例等）
- 摄像头设置（前后摄像头切换）

## 注意事项

1. 确保用户授权摄像头权限
2. 角色图片建议使用 PNG 格式以支持透明背景
3. 框架图片应与摄像头画面尺寸匹配
4. 自定义上传的图片会创建临时 URL，需要在适当时候清理

## 技术依赖

- React 18+
- Framer Motion（拖拽和动画）
- react-webcam（摄像头访问）
- Zustand（状态管理）
- Tailwind CSS + shadcn/ui（样式）
- Lucide React（图标）