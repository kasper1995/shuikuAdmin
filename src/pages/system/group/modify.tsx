import React from "react";
import ActionModal from "@/components/actionModal";
import { Button, Form, FormInstance, Input, message, Radio } from "antd";
import MyButton from "@/components/basic/button";
import { SystemGroupRecord } from "@/interface/system";
import MyForm from "@/components/core/form";
import MyRadio from "@/components/basic/radio";
import { createSystemGroup, modifySystemGroup } from "@/api/system";

interface ModifySystemGroupProps {
  record: SystemGroupRecord;
  afterOK: VoidFunction;
}


function ModifySystemGroup(props: ModifySystemGroupProps) {
  const formRef = React.useRef<any>(null);
  const hanleOk = async () => {
    const {Code} = await modifySystemGroup(formRef.current.getFieldsValue());
    if(Code === 0) {
      formRef.current.resetFields();
      message.success('修改成功');
      props.afterOK();
    } else {
      message.error('修改失败');
    }
  }
  return (
    <ActionModal actionButton={<Button size="small">修改</Button>} title="修改分组" handleOk={hanleOk}>
      <Form initialValues={props.record} labelCol={{ span: 6 }} labelAlign="left" ref={formRef}>
        <Form.Item label="分组名称" name="GroupName" rules={[{ required: true, message: '请输入分组名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="状态" name="Status" rules={[{ required: true, message: '请选择状态' }]}>
          <MyRadio.Group>
            <MyRadio value="active">激活</MyRadio>
            <MyRadio value="banned">禁用</MyRadio>
          </MyRadio.Group>
        </Form.Item>
      </Form>
    </ActionModal>
  );
}

export default ModifySystemGroup;
