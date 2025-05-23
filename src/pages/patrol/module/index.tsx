import { createModule, deleteModule, modifyModule, queryModules } from '@/api/patrol/module';
import { IModule } from '@/services/patrol/interface';
import { Button, Form, Input, InputNumber, message, Modal, Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import UrlUpload from "@/components/urlUpload";

const ModuleManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IModule | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await queryModules({});
      if (response.Code === 0) {
        setData(response.Data);
        setPagination(prev => ({ ...prev, total: response.Data.Total }));
      } else {
        message.error(response.Message || '获取数据失败');
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: IModule) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteModule(id);
      if (response.Code === 0) {
        message.success('删除成功');
        fetchData();
      } else {
        message.error(response.Message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        const response = await modifyModule({ ...values, ID: editingRecord.ID });
        if (response.Code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(response.Message || '更新失败');
        }
      } else {
        const response = await createModule(values);
        if (response.Code === 0) {
          message.success('添加成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(response.Message || '添加失败');
        }
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
      total: pagination.total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条`
    });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '图片',
      dataIndex: 'Image',
      key: 'Image',
      render: (image: string) => (
        <img src={image} alt="模块图片" style={{ maxWidth: 100, maxHeight: 100 }} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number) => (
        status === 1 ? <Tag color="success">启用</Tag> : <Tag color="error">禁用</Tag>
      ),
    },
    {
      title: '排序',
width: 80,
      dataIndex: 'Sort',
      key: 'Sort',
      sorter: true,
    },
    {
      title: '链接',
      dataIndex: 'Href',
      key: 'Href',
      render: (href: string) => (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {href}
        </a>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IModule) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.ID)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={handleAdd}>
          新增模块
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="ID"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingRecord ? '编辑模块' : '新增模块'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Image"
            label="图标"
            rules={[{ required: true, message: '请上传图标' }]}
          >
            <UrlUpload text="上传图标" />
          </Form.Item>
          <Form.Item
            name="Status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="Sort"
            label="排序"
            initialValue={1}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="Href"
            label="链接"
            rules={[{ required: true, message: '请输入链接' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModuleManagement;
