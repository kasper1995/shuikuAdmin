import { createWaterLab, deleteWaterLab, modifyWaterLab, queryWaterLab } from '@/api/operation/water';
import ImageUpload from '@/components/imageUpload';
import { WaterLabQueryParams, WaterLabRecord } from '@/interface/operation/water';
import { Button, Form, Input, Modal, Table, message } from 'antd';
import { useEffect, useState } from 'react';
const ReservoirManagement = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<WaterLabRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WaterLabRecord | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 查询列表
  const fetchData = async (params: WaterLabQueryParams) => {
    setLoading(true);
    try {
      const res = await queryWaterLab({
        ...params,
        Offset: 1 + (params.Limit || 0) * (pagination.current - 1),
      });
      if (res.Code === 0) {
        setData(res.Data.List || []);
        setPagination(pagination => ({
          ...pagination,
          total: res.Data.Count || 0,
        }));
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData({
      Offset: pagination.current,
      Limit: pagination.pageSize,
    });
  }, [pagination.current]);

  // 表格列定义
  const columns = [
    {
      title: '编号',
      dataIndex: 'Code',
      key: 'Code',
    },
    {
      title: '水库名称',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: '排序',
      dataIndex: 'Sort',
      key: 'Sort',
    },
    {
      title: '描述',
      dataIndex: 'Description',
      key: 'Description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WaterLabRecord) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.WaterLabID!)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: WaterLabRecord) => {
    console.log(record);
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (WaterLabID: number) => {
    try {
      const res = await deleteWaterLab(WaterLabID);
      if (res.Code === 0) {
        message.success('删除成功');
        fetchData({
          Offset: 0,
          Limit: pagination.pageSize,
        });
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      let values = await form.validateFields();
      values = {
        ...values,
        Polygons: +values?.Polygons || 0,
        Sort: +values?.Sort || 0,
      }
      if (editingRecord) {
        // 编辑
        const res = await modifyWaterLab({
          ...values,
        });
        if (res.Code === 0) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData({
            Offset: 0,
            Limit: pagination.pageSize,
          });
        }
      } else {
        // 新增
        const res = await createWaterLab(values);
        if (res.Code === 0) {
          message.success('创建成功');
          setModalVisible(false);
          fetchData({
            Name: '',
            Level: '',
            Code: '',
            Description: '',
            Offset: 0,
            Limit: pagination.pageSize,
          });
        }
      }
    } catch (error) {
      console.log(error);
      message.error('操作失败');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <Button type="primary" onClick={() => {
          setEditingRecord(null);
          form.resetFields();
          setModalVisible(true);
        }}>
          新增水库
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="WaterLabID"
        pagination={pagination}
        onChange={(pagination) => setPagination(pagination)}
      />

      <Modal
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        title={editingRecord ? '编辑水库' : '新增水库'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          {editingRecord && <Form.Item
            name="WaterLabID"
            label="水库ID"
            initialValue={editingRecord?.ID}
            rules={[{ required: true, message: '请输入水库ID' }]}
          >
            <Input />
          </Form.Item>}
          <Form.Item
            name="Code"
            label="编号"
            rules={[{ required: true, message: '请输入编号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Name"
            label="水库名称"
            rules={[{ required: true, message: '请输入水库名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Level"
            label="级别"
            rules={[{ required: true, message: '请输入级别' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="LatLng"
            label="经纬度"
            rules={[{ required: true, message: '请输入经纬度' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Cover"
            label="封面图"
            rules={[{ required: true, message: '请上传封面图' }]}
          >
            <ImageUpload text="点击上传封面图" />
</Form.Item>
<Form.Item
  name="Icon"
  label="图标"
  rules={[{ required: true, message: '请上传图标' }]}
>
  <ImageUpload text="点击上传图标" />
</Form.Item>
<Form.Item
  name="HIcon"
  label="高亮图标"
  rules={[{ required: true, message: '请上传高亮图标' }]}
>
  <ImageUpload text="点击上传高亮图标" />
</Form.Item>
          <Form.Item
            name="Sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="VRUrl"
            label="VR链接"
            rules={[{ required: true, message: '请输入VR链接' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Polygons"
            label="区划点"
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReservoirManagement;
