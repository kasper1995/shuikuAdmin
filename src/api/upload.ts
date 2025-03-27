import { message } from 'antd';
import { FileURL, request } from "./request";

// 文件上传接口
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('auth_token', localStorage.getItem('t') || '');
  return request('post', FileURL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const uploadProps = {
    name: 'file',
    multiple: false,
    action: FileURL,
    headers: {
      Authorization: `${localStorage.getItem('t')}`,
    },

    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };
