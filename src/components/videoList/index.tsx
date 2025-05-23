import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { FormListFieldData } from 'antd/es/form/FormList';
import UrlUpload from '../urlUpload';

interface VideoListProps {
  name: string | number | (string | number)[];
  label?: string;
}

const VideoList: React.FC<VideoListProps> = ({ name, label }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields.map((field: FormListFieldData) => (
            <Space key={field.key} align="baseline" style={{ width: '100%' }}>
              <Form.Item
                {...field}
                label="视频标题"
                name={[field.name, 'Title']}
              >
                <Input placeholder="请输入视频标题" />
              </Form.Item>
              <Form.Item
                {...field}
                label="视频地址"
                name={[field.name, 'URL']}
              >
                <UrlUpload text="上传视频" type="video" />
              </Form.Item>
              <Form.Item
                {...field}
                label="视频封面"
                name={[field.name, 'Img']}
              >
                <UrlUpload text="上传封面" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              添加视频
            </Button>
          </Form.Item>
        </div>
      )}
    </Form.List>
  );
};

export default VideoList;
