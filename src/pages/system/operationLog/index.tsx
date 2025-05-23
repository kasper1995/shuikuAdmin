import { querySystemOperationLog } from '@/api/system/operationLog';
import { OperationLog } from '@/interface/system/operationLog';
import { Button, Form, Input, Table, message, Select } from "antd";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const OperationLogPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const res = await querySystemOperationLog({
        Username: values.Username,
        Offset: (pagination.current - 1) * pagination.pageSize + 1,
        Limit: pagination.pageSize,
        Status: values.Status,
      });
      if (res.Code === 0) {
        setData(res.Data.List || []);
        setPagination(prev => ({ ...prev, total: res.Data.Count }));
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = async (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    await fetchData(values);
  };

  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const columns: ColumnsType<OperationLog> = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    // {
    //   title: '用户名',
    //   dataIndex: 'Username',
    //   key: 'Username',
    //   width: 120,
    // },
    {
      title: '昵称',
      dataIndex: 'Nick',
      key: 'Nick',
      width: 120,
    },
    {
      title: '错误',
      dataIndex: 'Error',
      key: 'Error',
      width: 320,
    },
    {
      title: '接口',
      dataIndex: 'Action',
      key: 'Action',
      width: 200,
    },
    {
      title: '操作名',
      dataIndex: 'ActionCname',
      key: 'ActionCname',
      width: 200,
    },
    {
      title: '操作IP',
      dataIndex: 'IP',
      key: 'IP',
      width: 150,
    },
    {
      title: '操作时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      width: 180,
      render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 8 }}
      >
        <Form.Item name="Username" label="用户名">
          <Input placeholder="请输入用户名" allowClear />
        </Form.Item>
        <Form.Item name="Status" label="状态">
          <Select allowClear placeholder="请选择状态" style={{ width: 120 }}>
            <Select.Option value="success">成功</Select.Option>
            <Select.Option value="fail">失败</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ID"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条`,
        }}
        onChange={(page) => {
          setPagination(prev => ({
            ...prev,
            current: page.current || 1,
            pageSize: page.pageSize || 10,
          }));
        }}
      />
    </div>
  );
};

export default OperationLogPage;
