import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, List, Radio } from 'antd';
import { useEffect, useState } from 'react';

interface OptionsListProps {
  value?: string;
  onChange?: (value: string) => void;
  answer?: string;
  onAnswerChange?: (value: string) => void;
  type?: number; // 1: 单选, 2: 多选
}

// 检测字符串中使用的分隔符
const detectSeparator = (str: string): string => {
  const separators = [',','，'];
  const counts = separators.map(sep => ({
    separator: sep,
    count: (str.match(new RegExp(sep, 'g')) || []).length
  }));

  // 找出使用次数最多的分隔符
  const maxCount = Math.max(...counts.map(c => c.count));
  if (maxCount === 0) return ','; // 如果没有检测到分隔符，默认使用逗号

  return counts.find(c => c.count === maxCount)?.separator || ',';
};

const OptionsList: React.FC<OptionsListProps> = ({
  value = '',
  onChange,
  answer = '',
  onAnswerChange,
  type = 1, // 默认为单选
}) => {
  // 检测分隔符
  const [separator, setSeparator] = useState<string>('、');

  // 将选项字符串转换为数组
  const [options, setOptions] = useState<string[]>([]);
  // 将答案字符串转换为数组
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // 初始化分隔符和选项
  useEffect(() => {
    if (value) {
      const detectedSeparator = detectSeparator(value);
      setSeparator(detectedSeparator);
      setOptions(value.split(detectedSeparator));
    }
  }, [value]);

  // 初始化答案
  useEffect(() => {
    if (answer) {
      setSelectedAnswers(answer.split(separator));
    }
  }, [answer, separator]);

  // 监听type变化，如果是单选且当前选中多个答案，只保留第一个
  useEffect(() => {
    if (type === 1 && selectedAnswers.length > 1) {
      const newAnswers = [selectedAnswers[0]];
      setSelectedAnswers(newAnswers);
      onAnswerChange?.(newAnswers.join(separator));
    }
  }, [type]);

  const handleAdd = () => {
    setOptions([...options, '']);
  };

  const handleRemove = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onChange?.(newOptions.join(separator));

    // 如果删除的选项是答案，同时更新答案
    const removedOption = options[index];
    const newAnswers = selectedAnswers.filter(a => a !== removedOption);
    setSelectedAnswers(newAnswers);
    onAnswerChange?.(newAnswers.join(separator));
  };

  const handleChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onChange?.(newOptions.join(separator));
  };

  const handleAnswerChange = (option: string, checked: boolean) => {
    let newAnswers: string[];
    if (type === 1) {
      // 单选模式
      newAnswers = checked ? [option] : [];
    } else {
      // 多选模式
      if (checked) {
        newAnswers = [...selectedAnswers, option];
      } else {
        newAnswers = selectedAnswers.filter(a => a !== option);
      }
    }
    setSelectedAnswers(newAnswers);
    onAnswerChange?.(newAnswers.join(separator));
  };

  return (
    <div>
      <List
        dataSource={options}
        renderItem={(option, index) => (
          <List.Item
            actions={[
              <MinusCircleOutlined key="remove" onClick={() => handleRemove(index)} />
            ]}
          >
            <div style={{width: '100%', display: 'flex'}}>
              {type === 1 ? (
                <Radio
                  className={"flex-center"}
                  checked={selectedAnswers.includes(option)}
                  onChange={(e) => handleAnswerChange(option, e.target.checked)}
                >
                  正确答案
                </Radio>
              ) : (
                <Checkbox
                  className={"flex-center"}
                  checked={selectedAnswers.includes(option)}
                  onChange={(e) => handleAnswerChange(option, e.target.checked)}
                >
                  正确答案
                </Checkbox>
              )}
              <Input
                value={option}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={`选项 ${index + 1}`}
                style={{ flex: 1, marginLeft: 15 }}
              />
            </div>
          </List.Item>
        )}
      />
      <Button
        type="dashed"
        onClick={handleAdd}
        style={{ width: '100%', marginTop: 8 }}
      >
        <PlusOutlined /> 添加选项
      </Button>
    </div>
  );
};

export default OptionsList;
