import React, { useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';

interface AvatarPreviewProps {
  avatarUrl: string;
  onChange: (url: string) => void;
}

export default function AvatarPreview({ avatarUrl, onChange }: AvatarPreviewProps) {
  const [imgError, setImgError] = useState(false);

  const displayUrl = avatarUrl.trim();
  const showFallback = !displayUrl || imgError;

  return (
    <div className="flex flex-col items-center justify-start lg:pl-10 mt-6 lg:mt-0 lg:w-1/3 shrink-0">
      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-surface mb-5 border-[3px] border-border flex items-center justify-center shrink-0 shadow-sm relative group transition-all hover:border-primary/30">
        {!showFallback ? (
          <img 
            src={displayUrl} 
            alt="Ảnh đại diện" 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            onLoad={() => setImgError(false)}
          />
        ) : (
          <Camera className="w-10 h-10 text-subtle" />
        )}
        
        {displayUrl && (
          <button
            type="button"
            onClick={() => { onChange(''); setImgError(false); }}
            className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white transition-opacity focus-visible:outline-none focus-visible:flex"
            aria-label="Xóa ảnh đại diện"
            title="Xóa URL ảnh"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="text-sm text-muted text-center px-4 max-w-[200px]">
        <p className="font-medium text-text mb-1.5">Ảnh đại diện từ URL</p>
        <p className="text-xs text-muted">
          Sử dụng link ảnh http/https hợp lệ.
        </p>
      </div>
    </div>
  );
}
