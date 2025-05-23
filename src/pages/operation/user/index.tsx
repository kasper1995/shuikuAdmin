import { queryOperationUser } from '@/api/operation/user';
import { OperationUser } from '@/interface/operation/user';
import { Button, Form, Input, Table, message, DatePicker } from "antd";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const UserQuery = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<OperationUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchData = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    try {
      const res = await queryOperationUser({
        City: values.City,
        Address: values.Address,
        Nickname: values.Nickname,
        StartTime: values.timeRange?.[0]?.format('YYYY-MM-DD 00:00:00'),
        EndTime: values.timeRange?.[1]?.format('YYYY-MM-DD 23:59:59'),
        Offset: (pagination.current - 1) * pagination.pageSize + 1,
        Limit: pagination.pageSize,
      });
      if (res.Code === 0) {
        setData(res.Data.List);
        setPagination(prev => ({
          ...prev,
          total: res.Data.Count,
        }));
      } else {
        message.error(res.Message || '查询失败');
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(values);
  };

  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const columns: ColumnsType<OperationUser> = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '头像',
      dataIndex: 'Avatar',
      key: 'Avatar',
      width: 80,
      render: (text) => (
        <img src={text} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      ),
    },
    {
      title: '昵称',
      dataIndex: 'Nickname',
      key: 'Nickname',
      width: 120,
    },
    {
      title: '城市',
      dataIndex: 'City',
      key: 'City',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'Address',
      key: 'Address',
      width: 200,
      ellipsis: true,
    },
    {
      title: '积分',
      dataIndex: 'Point',
      key: 'Point',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'CreatedTime',
      key: 'CreatedTime',
      width: 180,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'UpdatedTime',
      key: 'UpdatedTime',
      width: 180,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
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
        <Form.Item name="Nickname" label="昵称">
          <Input placeholder="请输入昵称" allowClear />
        </Form.Item>
        <Form.Item name="City" label="城市">
          <Input placeholder="请输入城市" allowClear />
        </Form.Item>
        <Form.Item name="Address" label="地址">
          <Input placeholder="请输入地址" allowClear />
        </Form.Item>
        <Form.Item name="timeRange" label="创建时间">
          <DatePicker.RangePicker />
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
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={(page) => {
          setPagination(prev => ({
            ...prev,
            current: page.current || 1,
            pageSize: page.pageSize || 20,
          }));
        }}
      />
    </div>
  );
};

export default UserQuery;
