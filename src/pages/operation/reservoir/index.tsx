import type { WaterLabQueryParams, WaterLabRecord } from '@/interface/operation/water';

import { Button, Form, Input, InputNumber, message, Modal, Space, Table } from "antd";
import { useEffect, useState } from 'react';

import { createWaterLab, deleteWaterLab, modifyWaterLab, queryWaterLab } from '@/api/operation/water';
import UrlUpload from '@/components/urlUpload';

const ReservoirManagement = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState<WaterLabRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WaterLabRecord | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  // 查询列表
  const fetchData = async (params: WaterLabQueryParams) => {
    setLoading(true);

    try {
      const res = await queryWaterLab({
        ...params,
        Limit: pagination.pageSize,
        Offset: (pagination.pageSize || 0) * (pagination.current - 1) + 1,
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
width: 80,
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
          Offset: 1,
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
      };

      if (editingRecord) {
        // 编辑
        const res = await modifyWaterLab({
          ...values,
          WaterLabID: editingRecord?.ID || 0,
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
        <Form form={searchForm} layout="inline">
          <Form.Item name="Name" label="水库名称">
            <Input placeholder="请输入水库名称" />
          </Form.Item>
          <Button type="primary" onClick={() => fetchData({ Name: searchForm.getFieldValue('Name') })}>
            查询
          </Button>
          <Button onClick={() => {
            searchForm.resetFields();
            fetchData({
              Offset: 1,
              Limit: pagination.pageSize,
            });
          }}>重置</Button>
        </Form>
      </div>
      <Button
        type="primary"
        onClick={() => {
          setEditingRecord(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ margin: '8px 0' }}
      >
        新增水库
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="WaterLabID"
        pagination={pagination}
        onChange={page => setPagination({...pagination, ...page})}
      />

      <Modal
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        title={editingRecord ? '编辑水库' : '新增水库'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          {/*{editingRecord && (*/}
          {/*  <Form.Item*/}
          {/*    name="WaterLabID"*/}
          {/*    label="水库ID"*/}
          {/*    initialValue={editingRecord?.ID}*/}
          {/*    rules={[{ required: true, message: '请输入水库ID' }]}*/}
          {/*  >*/}
          {/*    <Input />*/}
          {/*  </Form.Item>*/}
          {/*)}*/}
          <Form.Item name="Name" label="名称" rules={[{ required: true, message: '请输入水库名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Cover" label="封面图" rules={[{ required: true, message: '请上传封面图' }]}>
            <UrlUpload text="点击上传封面图" />
          </Form.Item>
          <Form.Item name="HIcon" label="高亮图标" rules={[{ required: true, message: '请上传高亮图标' }]}>
            <UrlUpload text="点击上传高亮图标" />
          </Form.Item>
          <Form.Item name="Icon" label="图标" rules={[{ required: true, message: '请上传图标' }]}>
            <UrlUpload text="点击上传图标" />
          </Form.Item>
          <Form.Item name="Sort" label="排序" initialValue={1}>
            <InputNumber />
          </Form.Item>
          {/*<Form.Item name="Level" label="级别" rules={[{ required: true, message: '请输入级别' }]}>*/}
          {/*  <Input />*/}
          {/*</Form.Item>*/}
          <Form.Item name="Description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <Input.TextArea />
          </Form.Item>
          {/*<Form.Item name="LatLng" label="经纬度" rules={[{ required: true, message: '请输入经纬度' }]}>*/}
          {/*  <Input />*/}
          {/*</Form.Item>*/}

          <Form.Item name="VRUrl" label="VR链接" rules={[{ required: true, message: '请输入VR链接' }]}>
            <Input />
          </Form.Item>
          {/*<Form.Item name="Polygons" label="区划点">*/}
          {/*  <Input type="number" />*/}
          {/*</Form.Item>*/}
        </Form>
      </Modal>
    </div>
  );
};

export default ReservoirManagement;
