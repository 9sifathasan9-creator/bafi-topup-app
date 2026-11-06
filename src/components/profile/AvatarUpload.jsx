import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { getFileError } from '../../utils/validators';
import Button from '../ui/Button';

const AvatarUpload = ({ currentAvatar, onUpload, onRemove, loading = false }) => {
  const { t } = useLanguage();
  const { notifyError } = useNotifications();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentAvatar || '');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = getFileError(file);
    if (error) {
      notifyError(error);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setPreview(result);
      onUpload?.(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    onRemove?.();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-12 h-12 text-white" />
          )}
        </div>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-0 right-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-lg"
            aria-label="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        variant="primary"
        size="sm"
        leftIcon={Upload}
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {t('uploadAvatar') || 'Upload Avatar'}
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {t('avatarHint') || 'JPG, PNG, WEBP (max 2MB)'}
      </p>
    </div>
  );
};

export default AvatarUpload;
