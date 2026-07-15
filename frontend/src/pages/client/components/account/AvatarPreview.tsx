import React, { useState, useRef } from 'react';
import { Camera, Trash2, Upload, Loader2 } from 'lucide-react';
import { uploadImage } from '../../../../utils/imageUpload';

interface AvatarPreviewProps {
  avatarUrl: string;
  onChange: (url: string) => void;
}

export default function AvatarPreview({ avatarUrl, onChange }: AvatarPreviewProps) {
  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = avatarUrl.trim();
  const showFallback = !displayUrl || imgError;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError('');
      
      const imageUrl = await uploadImage(file, {
        folder: 'ecommerce/avatars',
        maxDimension: 500,
        maxSizeMB: 5
      });
      
      onChange(imageUrl);
      setImgError(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Lỗi tải ảnh');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
        
        {isUploading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        
        {displayUrl && !isUploading && (
          <button
            type="button"
            onClick={() => { onChange(''); setImgError(false); }}
            className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white transition-opacity focus-visible:outline-none focus-visible:flex z-20"
            aria-label="Xóa ảnh đại diện"
            title="Xóa ảnh"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-strong rounded-lg text-sm font-semibold text-text hover:bg-surface-alt transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-3"
      >
        <Upload className="w-4 h-4" />
        Chọn ảnh
      </button>

      {uploadError && (
        <p className="text-xs text-danger font-medium mb-3 text-center max-w-[200px]">{uploadError}</p>
      )}

      <div className="text-sm text-muted text-center px-4 max-w-[200px]">
        <p className="text-xs text-muted">
          Định dạng JPEG, PNG, WEBP.
          <br />Tối đa 5MB.
        </p>
      </div>
    </div>
  );
}
