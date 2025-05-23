import { createSystemDict, querySystemDict } from '@/api/system/dict';
import { SystemDict } from '@/interface/system/dict';
import { Button, Form, Input, Modal, Table, message } from 'antd';
import { useEffect, useState } from 'react';

const SystemDictManagement = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState<SystemDict[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  })
  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const res = await querySystemDict(values);
      if (res.Code === 0) {
        setData(Object.values(res.Data).flat() || []);
        setPagination(prev => ({...prev, total: res.Data.length}));
      }
    } catch (error) {
      message.error('获取数据失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (values: any) => {
    fetchData(values);
  };

  const handleReset = () => {
    form.resetFields();
    searchForm.resetFields();
    fetchData();
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res = await createSystemDict(values);
      if (res.Code === 0) {
        message.success('创建成功');
        setModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.error(res.Message || '创建失败');
      }
    } catch (error) {
      message.error('创建失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '字典主题',
      dataIndex: 'Item',
      key: 'Item',
    },
    {
      title: '字典值',
      dataIndex: 'Value',
      key: 'Value',
    },
    {
      title: '描述',
      dataIndex: 'Desc',
      key: 'Desc',
    },
  ];

  return (
    <div className="p-6">
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 8 }}
      >
        <Form.Item name="Item" label="字典主题">
          <Input placeholder="请输入字典主题" allowClear />
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

      <div className="mb-4" style={{marginBottom: 8}}>
        <Button type="primary" onClick={handleAdd}>
          新增字典
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ID"
        pagination={pagination}
        onChange={(page) => setPagination({ ...pagination, ...page })}
      />

      <Modal
        title="新增字典"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Item"
            label="字典主题"
            rules={[{ required: true, message: '请输入字典主题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Value"
            label="字典值"
            rules={[{ required: true, message: '请输入字典值' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Desc"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemDictManagement;
