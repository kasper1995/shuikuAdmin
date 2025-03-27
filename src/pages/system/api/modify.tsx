import { modifySystemApi } from "@/api/system";
import ActionModal from "@/components/actionModal";
import { SystemApiRecord } from "@/interface/api";
import { Button, Form, Input, message } from "antd";
import React from "react";

interface ModifySystemApiProps {
  record: SystemApiRecord;
  afterOK: VoidFunction;
}

function ModifySystemApi(props: ModifySystemApiProps) {
  const formRef = React.useRef<any>(null);
  
  const handleOk = async () => {
    const values = formRef.current.getFieldsValue();
    const { Code } = await modifySystemApi({
      ...values,
      ID: props.record.ID
    });
    
    if (Code === 0) {
      formRef.current.resetFields();
      message.success('修改成功');
      props.afterOK();
    } else {
      message.error('修改失败');
    }
  };

  return (
    <ActionModal 
      actionButton={<Button size="small">修改</Button>} 
      title="修改API" 
      handleOk={handleOk}
    >
      <Form 
        initialValues={props.record}
        labelCol={{ span: 6 }} 
        labelAlign="left" 
        ref={formRef}
      >
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

export default ModifySystemApi; 