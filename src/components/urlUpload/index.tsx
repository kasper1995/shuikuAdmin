import { uploadFile } from '@/api/upload';
import { Button, Input, message } from 'antd';
import { useState } from 'react';
import './index.less';

interface UrlInputProps {
  value?: string;
  onChange?: (value: string) => void;
  text?: string;
  type?: 'image' | 'video';
}

const UrlUpload: React.FC<UrlInputProps> = ({ value, onChange, text, type = 'image' }) => {
  const [showPreview, setShowPreview] = useState(false);

  const getAcceptType = () => {
    switch (type) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      default:
        return 'image/*';
    }
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue && !validateUrl(newValue)) {
      message.error('请输入有效的网址链接');
      // return;
    }
    onChange?.(newValue);
  };

  const handleUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', getAcceptType());
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const res = await uploadFile(file);
          if (res) {
            onChange?.(res);
          }
        } catch (error) {
          console.error('上传失败:', error);
        }
      }
    };
  };

  return (
    <div className="url-upload-wrapper">
      <div className="flex gap-2" style={{display: 'flex'}}>
        <Input
          value={value}
          onChange={handleInputChange}
          onBlur={() => {
            if (value && !validateUrl(value)) {
              message.error('请输入有效的网址链接');
              return;
            }
          }}
          placeholder="请输入网址链接"
          style={{ flex: 1 }}
          onMouseEnter={() => value && isImageUrl(value) && setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        />
        <Button style={{marginLeft: 8}} type="primary" onClick={handleUpload}>{text || '上传'}</Button>
      </div>
      {value && isImageUrl(value) && (
        <div className={`preview-container ${showPreview ? 'visible' : ''}`}>
          <img src={value} alt="预览" className="preview-image" />
        </div>
      )}
    </div>
  );
};

export default UrlUpload;
