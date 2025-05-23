import UrlUpload from '@/components/urlUpload';
import { Button, Checkbox, Form, Input, Space } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface OptionsListProps {
  value?: string;
  answer?: string;
  onChange?: (options: string, answer: string) => void;
  type?: number; // 1: 文本, 2: 图片
}

export interface OptionsListRef {
  getOptions: () => string[];
  getAnswers: () => string[];
}

const OptionsList = forwardRef<OptionsListRef, OptionsListProps>(({ value = '', answer = '', onChange, type = 1 }, ref) => {
  const [options, setOptions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      setOptions(value.split(','));
    }
    if (answer) {
      setAnswers(answer.split(','));
    }
  }, [value, answer]);

  const handleAdd = () => {
    const newOptions = [...options, ''];
    setOptions(newOptions);
    handleChange(newOptions, answers);
  };

  const handleRemove = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    const newAnswers = answers.filter(a => !options[index].includes(a));
    setAnswers(newAnswers);
    handleChange(newOptions, newAnswers);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    handleChange(newOptions, answers);
  };

  const handleAnswerChange = (index: number, checked: boolean) => {
    const option = options[index];
    let newAnswers: string[];
    if (checked) {
      newAnswers = [...answers,option];
    } else {
      newAnswers = answers.filter(a => a !== option);
    }
    setAnswers(newAnswers);
    handleChange(options, newAnswers);
  };

  const handleChange = (newOptions: string[], newAnswers: string[]) => {
    if (onChange) {
      onChange(newOptions.join(','), newAnswers.join(','));
    }
  };

  useImperativeHandle(ref, () => ({
    getOptions: () => options,
    getAnswers: () => answers,
  }));
  console.log('type', type);
  return (
    <Form.List name="options">
      {() => (
        <Space direction="vertical" style={{ width: '100%', flex: 1 }}>
          {options.map((option, index) => (
            <Space key={index} style={{ width: '100%', flex: 1 }}>
              <Checkbox
                checked={answers.includes(option)}
                onChange={e => handleAnswerChange(index, e.target.checked)}
              />
              {type == 1 ? (
                <Input
                  value={option}
                  onChange={e => handleOptionChange(index, e.target.value)}
                  placeholder={`选项 ${index + 1}`}
                  style={{ width: '80%' }}
                />
              ) : (
                <UrlUpload
                  value={option}
                  onChange={(value) => handleOptionChange(index, value)}
                  text={`上传选项 ${index + 1} 图片`}
                  type="image"
                />
              )}
              <Button type="link" danger onClick={() => handleRemove(index)}>
                删除
              </Button>
            </Space>
          ))}
          <Button type="dashed" onClick={handleAdd} block>
            添加选项
          </Button>
        </Space>
      )}
    </Form.List>
  );
});

export default OptionsList;
