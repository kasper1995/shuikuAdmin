import { createSailView, deleteSailView, modifySailView, querySailViews } from '@/api/operation/sailview';
import ImageUpload from '@/components/ImageUpload';
import { ISailView } from '@/services/operation/interface';
import { Button, Form, Input, Modal, Table, message } from 'antd';
import { useEffect, useRef, useState } from "react";
import WaterSelect from '../reservoir/components/WaterSelect';

const SailViewManagement: React.FC = () => {
  const [form] = Form.useForm();
  const waterSelectRef = useRef(null)
  const [data, setData] = useState<ISailView[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ISailView | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await querySailViews({
        Offset: pagination.current * pagination.pageSize,
        Limit: 10
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
    setModalVisible(true);
  };

  const handleEdit = (record: ISailView) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
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
      const values = await form.validateFields();
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
    });
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
        return waterSelectRef?.current?.getWaterName(record.WaterID)
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
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
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
        <Form form={form} layout="vertical">
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
            <WaterSelect ref={waterSelectRef} />
          </Form.Item>
          <Form.Item
            name="Image"
            label="图片"
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <ImageUpload />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SailViewManagement;
