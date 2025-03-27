import React from "react";
import ActionModal from "@/components/actionModal";
import { Button, Form, FormInstance, Input, message, Radio, Select } from "antd";
import MyButton from "@/components/basic/button";
import { SystemGroupRecord } from "@/interface/system";
import MyForm from "@/components/core/form";
import MyRadio from "@/components/basic/radio";
import { modifySystemUser } from "@/api/system";

interface ModifySystemGroupProps {
  record: SystemGroupRecord;
  afterOK: VoidFunction;
}


function ModifySystemUserPassword(props: ModifySystemGroupProps) {
  const formRef = React.useRef<any>(null);
  const hanleOk = async () => {
    const {Code} = await modifySystemUser(formRef.current.getFieldsValue());
    if(Code === 0) {
      formRef.current.resetFields();
      message.success('修改成功');
      props.afterOK();
    } else {
      message.error('修改失败');
    }
  }
  return (
    <ActionModal actionButton={<Button size="small">修改密码</Button>} title="修改用户密码" handleOk={hanleOk}>
      <Form initialValues={props.record} labelCol={{ span: 6 }} labelAlign="left" ref={formRef}>
        <Form.Item label="用户名" name="Username" rules={[{ required: true, message: '请输入分组名称' }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="密码" name="Password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input type="password" />
        </Form.Item>
      </Form>
    </ActionModal>
  );
}

export default ModifySystemUserPassword;
