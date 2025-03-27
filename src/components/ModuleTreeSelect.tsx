import { useTreeDict } from '@/hooks/useTreeDict';
import { fetchDictList } from '@/stores/dict';
import { TreeSelect } from 'antd';
import { useEffect, useMemo } from "react";
import { useDispatch } from 'react-redux';
import { SystemApiRecord } from "@/interface/system";

interface ModuleTreeSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  permissionData: SystemApiRecord[];
}

export const ModuleTreeSelect: React.FC<ModuleTreeSelectProps> = ({ value, onChange, permissionData }) => {
  const dispatch = useDispatch();
  const { treeSelectProps } = useTreeDict('api_module', permissionData);

  useEffect(() => {
    dispatch(fetchDictList('api_module'));
  }, [dispatch]);

  return (
    <TreeSelect
      {...treeSelectProps}
      value={value}
      onChange={onChange}
    />
  );
};
