import { createPatrolBanner, deletePatrolBanner, modifyPatrolBanner, queryPatrolBanner } from '@/api/patrol/banner';
import UrlUpload from '@/components/urlUpload';
import { PatrolBanner } from '@/interface/patrol/banner';
import { Button, Form, Input, InputNumber, message, Modal, Space, Switch, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';

const BannerManagement = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PatrolBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PatrolBanner | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryPatrolBanner();
      if (res.Code === 0) {
        setData(res.Data || []);
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: PatrolBanner) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      Status: record.Status === 1,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deletePatrolBanner(id);
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
      const params = {
        ...values,
        Status: values.Status ? 1 : 0,
      };

      if (editingRecord) {
        const response = await modifyPatrolBanner({
          ...params,
          ID: editingRecord.ID,
        });
        if (response.Code === 0) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(response.Message || '修改失败');
        }
      } else {
        const response = await createPatrolBanner(params);
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

  const columns = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '轮播图名称',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '图片',
      dataIndex: 'Image',
      key: 'Image',
      render: (image: string) => (
        <img src={image} alt="轮播图" style={{ maxWidth: 100, maxHeight: 100 }} />
      ),
    },
    {
      title: '跳转链接',
      dataIndex: 'Href',
      key: 'Href',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'Sort',
      key: 'Sort',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: PatrolBanner) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.ID)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button type="primary" onClick={handleAdd}>
          新增轮播图
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        rowKey="ID"
      />

      <Modal
        title={editingRecord ? '编辑轮播图' : '新增轮播图'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Title"
            label="轮播图名称"
            rules={[{ required: true, message: '请输入轮播图名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Image"
            label="图片"
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <UrlUpload text="上传图片" />
          </Form.Item>
          <Form.Item
            name="Href"
            label="跳转链接"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Status"
            label="状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="Sort"
            label="排序"
            initialValue={1}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement;
