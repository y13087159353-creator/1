import React, { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { PhotoPost } from '../types';
import { subscribeToPhotos, addPhotoPost, deletePhotoPost } from '../lib/dataService';

export default function PhotoWall() {
  const [photos, setPhotos] = useState<PhotoPost[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [senderName, setSenderName] = useState(() => localStorage.getItem('tibet_app_user_name') || '');
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPhotos((data) => {
      setPhotos(data);
    });
    return () => unsubscribe();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSenderName(val);
    localStorage.setItem('tibet_app_user_name', val);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!senderName.trim()) {
      alert("请先输入您的名字！");
      return;
    }

    setIsUploading(true);
    try {
      const base64Data = await compressImage(file);
      await addPhotoPost({
        sender: senderName.trim(),
        base64Data,
        caption: caption.trim()
      });
      setCaption('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error("Failed to compress and upload image", err);
      alert("图片处理失败，请重试或选择更小的图片。");
    } finally {
      setIsUploading(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Scale down to max 600px width/height to save MQTT bandwidth
          const MAX_DIMENSION = 600;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress heavily (quality 0.5) to keep Base64 strings small
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("确定要删除这张照片吗？")) {
      deletePhotoPost(id);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">旅途照片墙</h2>
              <p className="text-sm text-slate-500">上传压缩照片，与车队成员实时共享沿途风景（最多保留最新30张）</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="您的名字（如：张三）"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={senderName}
              onChange={handleNameChange}
            />
            <input
              type="text"
              placeholder="说点什么...（选填）"
              className="flex-2 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {isUploading ? '处理中...' : '选择照片上传'}
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map(photo => (
          <div key={photo.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
              <img src={photo.base64Data} alt="Shared moment" className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-slate-900">{photo.sender}</span>
                <span className="text-xs text-slate-500">{formatTime(photo.timestamp)}</span>
              </div>
              {photo.caption && (
                <p className="text-slate-600 text-sm mt-2 line-clamp-3">{photo.caption}</p>
              )}
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
            <Camera className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>还没有人分享照片哦，快来上传第一张吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
