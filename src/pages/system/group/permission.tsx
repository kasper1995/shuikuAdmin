import { modifySystemGroupApiMap } from "@/api/system";
import ActionModal from "@/components/actionModal";
import { ModuleTreeSelect } from "@/components/ModuleTreeSelect";
import { SystemGroupRecord } from "@/interface/system";
import { Button, message, TreeSelect } from "antd";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { SHOW_PARENT } = TreeSelect;

interface IProps {
  record: SystemGroupRecord;
  permissionData: any[];
  afterOK?: VoidFunction;
}

const SystemGroupPermission = (props: IProps) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const currentPermissionList = useMemo(() => {
    if (!props?.permissionData || !Array.isArray(props?.permissionData)) return [];
    return props?.permissionData?.find((item: any) => item.GroupName === props.record.GroupName)?.List.map(i => i.Action) || [];
  }, [props.record, props.permissionData]);

  // 初始化选中的模块
  useMemo(() => {
    console.log('currentPermissionList', currentPermissionList);
    setSelectedModules(currentPermissionList);
  }, [currentPermissionList]);

  const handleOk = async () => {
    const { Code } = await modifySystemGroupApiMap({
      GroupName: props.record.GroupName,
      Actions: selectedModules
    });

    if (Code === 0) {
      message.success('保存成功');
      props.afterOK?.();
    } else {
      message.error('保存失败');
    }
  };

  return (
    <ActionModal
      actionButton={<Button type="primary" size="small">权限</Button>}
      title="权限"
      handleOk={handleOk}
    >
      <ModuleTreeSelect
        permissionData={currentPermissionList}
        value={selectedModules}
        onChange={setSelectedModules}
      />
    </ActionModal>
  );
};

export default SystemGroupPermission;
