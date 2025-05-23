import { createSailView, deleteSailView, modifySailView, querySailViews } from '@/api/operation/sailview';
import ImageUpload from '@/components/imageUpload';
import { ISailView } from '@/services/operation/interface';
import { Button, Form, Input, Modal, Table, message, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import WaterSelector, { useWaterLabList } from "../../../components/waterSelector/waterSelector";
import UrlUpload from "@/components/urlUpload";

const SailViewManagement: React.FC = () => {
  const {options} = useWaterLabList()
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const waterSelectRef = useRef<any>(null);
  const [data, setData] = useState<ISailView[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ISailView | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  const fetchData = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    try {
      const response = await querySailViews({
        Title: values?.Title,
        WaterID: values?.WaterID,
        Offset: (pagination.current - 1) * pagination.pageSize + 1,
        Limit: pagination.pageSize
      });
      if (response.Code === 0) {
        setData(response.Data.List);
        setPagination(prev => ({ ...prev, total: response.Data.Count }));
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
    modalForm.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ISailView) => {
    setEditingRecord(record);
    modalForm.setFieldsValue({
      Title: record.Title,
      WaterID: record.WaterID,
      Image: record.Img,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteSailView(id);
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
      const values = await modalForm.validateFields();
      if (editingRecord) {
        const response = await modifySailView({ ...values, ID: editingRecord.ID });
        if (response.Code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(response.Message || '更新失败');
        }
      } else {
        const response = await createSailView(values);
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

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(values);
  };

  const handleReset = () => {
    form.resetFields();
    modalForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '水库名称',
      dataIndex: 'Title',
      key: 'WaterName',
      render: (_, record) => {
        return options.find(item => item.value === record.WaterID)?.label || '';
      }
    },
    {
      title: '图片',
      dataIndex: 'Img',
      key: 'Img',
      render: (image: string) => (
        <img src={image} alt="航拍全景图" style={{ maxWidth: 100, maxHeight: 100 }} />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'CreatedTime',
      key: 'CreatedTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ISailView) => (
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
    <div>
      <div style={{ marginBottom: 8 }}>
        <Form
          form={form}
          layout="inline"
        >
          <Form.Item name="Title" label="标题">
            <Input placeholder="请输入标题" allowClear />
          </Form.Item>
          <Form.Item name="WaterID" label="水库">
            <WaterSelector placeholder="请选择水库" allowClear ref={waterSelectRef} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleSearch}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
        <Button type="primary" onClick={handleAdd} style={{ marginTop: 8 }}>
          新增航拍全景图
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
        title={editingRecord ? '编辑航拍全景图' : '新增航拍全景图'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item
            name="Title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="WaterID"
            label="水库"
            rules={[{ required: true, message: '请选择水库' }]}
          >
            <WaterSelector />
          </Form.Item>
          <Form.Item
            name="Image"
            label="图片"
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <UrlUpload text="请上传图片" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SailViewManagement;
