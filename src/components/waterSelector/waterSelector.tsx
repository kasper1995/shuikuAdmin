import { queryWaterLab } from "@/api/operation/water";
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import type { BaseSelectRef } from 'rc-select';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface WaterSelectProps extends SelectProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  allowClear?: boolean;
}

interface WaterSelectRef extends BaseSelectRef {
  getWaterName: (id: number) => string;
}

export const useWaterLabList = () => {
  const [options, setOptions] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await queryWaterLab({Limit: 999, Offset: 1});
      if (response.Code === 0) {
        setOptions(response.Data.List.map((item: any) => ({
          label: item.Name,
          value: item.ID,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch water options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return { options, loading };
}
const WaterSelector = forwardRef<WaterSelectRef, WaterSelectProps>(({ value, onChange, placeholder = '请选择水库', allowClear = true, ...rest }, ref) => {
    const {options, loading} = useWaterLabList()
    useImperativeHandle(ref, () => ({
      ...(ref as any),
      getWaterName: (id: number) => {
        console.log(options);
        const option = options.find(opt => opt.value === id);
        return option ? option.label : '';
      }
    }), [options]);
    return (
      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        loading={loading}
        style={{ width: '100%' }}
        allowClear={allowClear}
        {...rest}
      />
    );
});

export default WaterSelector;
