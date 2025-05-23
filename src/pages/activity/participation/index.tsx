import { createActivity, deleteActivity, modifyActivity, queryActivities } from '@/api/activity/participation';
import UrlUpload from '@/components/urlUpload';
import { IActivity } from '@/services/patrol/interface';
import { Button, Form, Input, InputNumber, message, Modal, Select, Switch, Table, Tag } from "antd";
import { useEffect, useState } from 'react';

const ActivityManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IActivity | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 99,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const params = {
        Title: values.Title,
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
      };

      const response = await queryActivities(params);
      if (response.Code === 0) {
        setData(response.Data.sort((a, b) => a.Sort - b.Sort));
        setPagination(prev => ({ ...prev, total: response.Data.length }));
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
    fetchData(form.getFieldsValue());
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

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: IActivity) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteActivity(id);
      if (response.Code === 0) {
        message.success('删除成功');
        fetchData(form.getFieldsValue());
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
        const response = await modifyActivity({ ...values, ID: editingRecord.ID });
        if (response.Code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData(form.getFieldsValue());
        } else {
          message.error(response.Message || '更新失败');
        }
      } else {
        const response = await createActivity(values);
        if (response.Code === 0) {
          message.success('添加成功');
          setModalVisible(false);
          fetchData(form.getFieldsValue());
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
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number) => (
        status === 0 ? <Tag color="success">启用</Tag> : <Tag color="error">禁用</Tag>
      ),
    },
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '活动名称',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '活动图片',
      dataIndex: 'Img',
      key: 'Img',
      render: (img: string) => (
        <img src={img} alt="活动图片" style={{ maxWidth: 100, maxHeight: 100 }} />
      ),
    },
    {
      title: '跳转链接',
      dataIndex: 'Href',
      key: 'Href',
      render: (href: string) => (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {href}
        </a>
      ),
    },
    {
      title: '排序',
      width: 80,
      dataIndex: 'Sort',
      key: 'Sort',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IActivity) => (
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
  console.log(form.getFieldsValue());
  return (
    <div>
      {/*<Form*/}
      {/*  form={form}*/}
      {/*  layout="inline"*/}
      {/*  style={{ marginBottom: 8 }}*/}
      {/*>*/}
      {/*  <Form.Item name="Title" label="活动名称">*/}
      {/*    <Input placeholder="请输入活动名称" allowClear />*/}
      {/*  </Form.Item>*/}
      {/*  <Form.Item>*/}
      {/*    <Button type="primary" htmlType="submit" onClick={() => handleSearch(form.getFieldsValue())}>*/}
      {/*      查询*/}
      {/*    </Button>*/}
      {/*    <Button style={{ marginLeft: 8 }} onClick={handleReset}>*/}
      {/*      重置*/}
      {/*    </Button>*/}
      {/*  </Form.Item>*/}
      {/*</Form>*/}

      <div style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={handleAdd}>
          新增活动
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
        destroyOnClose
        title={editingRecord ? '编辑活动' : '新增活动'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Title"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Img"
            label="活动图片"
            rules={[{ required: true, message: '请上传活动图片' }]}
          >
            <UrlUpload text="上传活动图片" />
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
            rules={[{ required: true, message: '请选择状态' }]}
            valuePropName={'checked'}
            getValueFromEvent={(checked) => checked ? 0 : 1}  // true(开启)→0, false(关闭)→1
            getValueProps={(value) => ({ checked: value === 0 })}  // 0→true(开启), 1→false(关闭)
            // initialValue={form.getFieldValue('Status') === 0}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="Sort"
            label="排序"
            initialValue={1}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivityManagement;
