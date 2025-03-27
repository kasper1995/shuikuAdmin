import { createSystemApi } from "@/api/system";
import ActionModal from "@/components/actionModal";
import MyButton from "@/components/basic/button";
import { Form, Input, message } from "antd";
import React from "react";

interface AddSystemApiProps {
  afterOK: VoidFunction;
}

function CreateSystemApi(props: AddSystemApiProps) {
  const formRef = React.useRef<any>(null);
  
  const handleOk = async () => {
    const { Code } = await createSystemApi(formRef.current.getFieldsValue());
    if (Code === 0) {
      formRef.current.resetFields();
      message.success('新增成功');
      props.afterOK();
    } else {
      message.error('新增失败');
    }
  };

  return (
    <ActionModal 
      actionButton={<MyButton type="primary">新增</MyButton>} 
      title="新增API" 
      handleOk={handleOk}
    >
      <Form labelCol={{ span: 6 }} labelAlign="left" ref={formRef}>
        <Form.Item 
          label="模块" 
          name="Module" 
          rules={[{ required: true, message: '请输入模块名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          label="操作名" 
          name="Action" 
          rules={[{ required: true, message: '请输入操作名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          label="操作中文名" 
          name="ActionCname" 
          rules={[{ required: true, message: '请输入操作中文名' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </ActionModal>
  );
}

export default CreateSystemApi; 