import { uploadFile } from '@/api/upload';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload, message } from 'antd';
import { useState } from 'react';
import './index.less';
interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  text = '点击上传',
  className = '',
  style = {},
}) => {
  const [hovered, setHovered] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file }) => {
      try {
        const res = await uploadFile(file as File);
        if(res){
          onChange?.(res);
        }
      } catch (error) {
        message.error('上传失败');
      }
    },
  };

  return (
    <div
      className={`image-upload-wrapper ${className}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
        {value ? (
        <>
          <div className="image-preview">
            <img src={value} alt="" className="preview-image" />
            {hovered && (
              <div className="image-mask">
                <Upload {...uploadProps}>
                  <Button type="link" className="upload-button">
                    {text}
                  </Button>
                </Upload>
              </div>
            )}
          </div>
        </>
      ) : (
        <Upload {...uploadProps}>
          <div className="upload-placeholder">
            <InboxOutlined className="upload-icon" />
            <div className="upload-text">{text}</div>
          </div>
        </Upload>
      )}
    </div>
  );
};

export default ImageUpload;
