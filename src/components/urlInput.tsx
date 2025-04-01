import { uploadFile } from '@/api/upload';
import { Button, Input } from 'antd';

interface UrlInputProps {
  value?: string;
  onChange?: (value: string) => void;
  text?: string;
}

const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, text }) => {
  const handleUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    // input.setAttribute('accept', '*/*');
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
    <div className="flex gap-2" style={{display: 'flex'}}>
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ flex: 1 }}
      />
      <Button type="primary" style={{marginLeft: 15}} onClick={handleUpload}>{text}</Button>
    </div>
  );
};

export default UrlInput;
