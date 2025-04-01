
import { Select } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { querySailViews } from "@/api/operation/banner";
import { queryWaterLab } from "@/api/operation/water";

interface WaterSelectProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
}

const WaterSelect: React.FC<WaterSelectProps> = forwardRef(({ value, onChange, placeholder = '请选择水库' }, ref) => {
    const [options, setOptions] = useState<{ label: string; value: number }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchReservoirs = async () => {
        setLoading(true);
        try {
          const response = await queryWaterLab({
            Limit: 99,
            Offset: 1
          });
          if(response.Code === 0) {
            const formattedOptions = response.Data.List.map(item => ({
              label: item.Name,
              value: item.ID,
            }));
            setOptions(formattedOptions);
          }
        } catch (error) {
          console.error('Failed to fetch reservoirs:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchReservoirs();
    }, []);
    useImperativeHandle(ref, () => ({
      getWaterName: (id: number) => {
        console.log(options);
        return options.find(option => option.value === id)?.label;
      }
    }))
    return (
      <Select
        ref={ref}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        loading={loading}
        style={{ width: '100%' }}
      />
    );
});

export default WaterSelect;
