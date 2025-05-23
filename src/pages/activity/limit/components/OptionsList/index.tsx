import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Switch } from 'antd';
import { useState } from 'react';

interface Option {
  option_name: string;
  is_mobile: string;
  is_require: string;
}

interface OptionsListProps {
  value?: Option[];
  onChange?: (value: Option[]) => void;
}

const OptionsList: React.FC<OptionsListProps> = ({ value, onChange }) => {
  const getJsonParse = (value: string | any[]): any[] => {
    try {
      // 如果已经是数组，直接返回
      if (Array.isArray(value)) {
        return value;
      }
      
      // 如果是字符串，尝试解析
      if (typeof value === 'string') {
        const parsed = JSON.parse(value);
        // 如果解析后还是字符串，继续解析
        if (typeof parsed === 'string') {
          return getJsonParse(parsed);
        }
        // 如果解析后是数组，返回数组
        if (Array.isArray(parsed)) {
          return parsed;
        }
        // 其他情况返回空数组
        return [];
      }
      
      // 其他情况返回空数组
      return [];
    } catch (error) {
      console.error('JSON parse error:', error);
      return [];
    }
  }
  console.log(getJsonParse(value || '[]'));
  const [options, setOptions] = useState<Option[]>(getJsonParse(value || '[]'));
  const handleAdd = () => {
    const newOptions = [...options, { option_name: '', is_mobile: '0', is_require: '0' }];
    setOptions(newOptions);
    onChange?.(newOptions);
  };

  const handleRemove = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onChange?.(newOptions);
  };

  const handleChange = (index: number, field: keyof Option, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
    onChange?.(newOptions);
  };

  return (
    <div>
      {options.map((option, index) => (
        <Space key={index} style={{ marginBottom: 8 }}>
          <Form.Item
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: '请输入选项名称' }]}
          >
            <Input
              placeholder="选项名称"
              value={option.option_name}
              onChange={(e) => handleChange(index, 'option_name', e.target.value)}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Switch
              checked={option.is_mobile === '1'}
              onChange={(checked) => handleChange(index, 'is_mobile', checked ? '1' : '0')}
            />
            <span style={{ marginLeft: 8 }}>手机号</span>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Switch
              checked={option.is_require === '1'}
              onChange={(checked) => handleChange(index, 'is_require', checked ? '1' : '0')}
            />
            <span style={{ marginLeft: 8 }}>必填</span>
          </Form.Item>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemove(index)}
          />
        </Space>
      ))}
      <Button type="dashed" onClick={handleAdd} block icon={<PlusOutlined />}>
        添加选项
      </Button>
    </div>
  );
};

export default OptionsList;
