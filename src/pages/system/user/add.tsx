import React from "react";
import ActionModal from "@/components/actionModal";
import { Button, Form, FormInstance, Input, message, Radio, Select } from "antd";
import MyButton from "@/components/basic/button";
import { SystemGroupRecord } from "@/interface/system";
import MyForm from "@/components/core/form";
import MyRadio from "@/components/basic/radio";
import { createSystemGroup, createSystemUser } from "@/api/system";
import { getMd5Hash } from "@/utils/crypto";

interface AddSystemGroupProps {
  afterOK: VoidFunction;
  systemGroupOptions: any[]
}


function CreateSystemGroup(props: AddSystemGroupProps) {
  const formRef = React.useRef<any>(null);
  const hanleOk = async () => {
    const form = formRef.current.getFieldsValue();
    form.Password = getMd5Hash(form.Password)
    const {Code} = await createSystemUser(form);
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
        <Form.Item label="真实姓名" name="Nick" rules={[{ required: true, message: '请输入真实姓名' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="用户名" name="Username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="Password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input type="password" />
        </Form.Item>
        <Form.Item label="分组名称" name="GroupName" rules={[{ required: true, message: '请选择分组' }]}>
          <Select options={props.systemGroupOptions} />
        </Form.Item>
      </Form>
    </ActionModal>
  );
}

export default CreateSystemGroup;
