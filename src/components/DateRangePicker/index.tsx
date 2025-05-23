import { Button, DatePicker, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { useState } from 'react';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  value?: [dayjs.Dayjs, dayjs.Dayjs];
  onChange?: (dates: [dayjs.Dayjs, dayjs.Dayjs]) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(value || [dayjs().subtract(6, 'day'), dayjs()]);
  const [selectedDays, setSelectedDays] = useState<number | null>(7);

  const handleQuickSelect = (days: number) => {
    const end = dayjs();
    const start = end.subtract(days - 1, 'day');
    setDates([start, end]);
    setSelectedDays(days);
    onChange?.([start, end]);
  };

  const handleChange = (dates: RangePickerProps['value']) => {
    if (dates) {
      setDates([dates[0]!, dates[1]!]);
      setSelectedDays(null);
      onChange?.([dates[0]!, dates[1]!]);
    }
  };

  const isSelected = (days: number) => selectedDays === days;

  return (
    <Space>
      <Button 
        type={isSelected(7) ? 'primary' : 'default'} 
        onClick={() => handleQuickSelect(7)}
      >
        最近7天
      </Button>
      <Button 
        type={isSelected(30) ? 'primary' : 'default'} 
        onClick={() => handleQuickSelect(30)}
      >
        最近30天
      </Button>
      <Button 
        type={isSelected(60) ? 'primary' : 'default'} 
        onClick={() => handleQuickSelect(60)}
      >
        最近60天
      </Button>
      <Button 
        type={isSelected(90) ? 'primary' : 'default'} 
        onClick={() => handleQuickSelect(90)}
      >
        最近90天
      </Button>
      <RangePicker
        value={dates}
        onChange={handleChange}
        format="YYYY-MM-DD"
      />
    </Space>
  );
};

export default DateRangePicker; 