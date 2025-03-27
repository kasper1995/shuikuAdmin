import React from "react";
import ActionModal from "@/components/actionModal";
import { Button, Form, FormInstance, Input, message, Radio } from "antd";
import MyButton from "@/components/basic/button";
import { SystemGroupRecord } from "@/interface/system";
import MyForm from "@/components/core/form";
import MyRadio from "@/components/basic/radio";
import { createSystemGroup } from "@/api/system";

interface AddSystemGroupProps {
  afterOK: VoidFunction;
}


function CreateSystemGroup(props: AddSystemGroupProps) {
  const formRef = React.useRef<any>(null);
  const hanleOk = async () => {
    const {Code} = await createSystemGroup(formRef.current.getFieldsValue());
    if(Code === 0) {
      formRef.current.resetFields();
      message.success('新增成功');
      props.afterOK();
    } else {
      message.error('新增失败');
    }
  }
  return (
    <ActionModal actionButton={<MyButton type="primary">新增</MyButton>} title="新增分组" handleOk={hanleOk}>
      <Form labelCol={{ span: 6 }} labelAlign="left" ref={formRef}>
        <Form.Item label="分组名称" name="GroupName" rules={[{ required: true, message: '请输入分组名称' }]}>
          <Input />
        </Form.Item>
      </Form>
    </ActionModal>
  );
}

export default CreateSystemGroup;
