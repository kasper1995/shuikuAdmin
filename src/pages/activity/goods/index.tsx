import { createGoods, deleteGoods, modifyGoods, queryGoods } from '@/api/activity/goods';
import UrlUpload from '@/components/urlUpload';
import { IGoods } from '@/services/patrol/interface';
import { Button, Form, Input, InputNumber, message, Modal, Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import CustomEditor from "@/components/customEditor";
import { encodeHTML } from "@/utils/exportExcel/tool";

const GoodsManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState<IGoods[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IGoods | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const params = {
        Name: values.Name,
        Type: values.Type,
        Status: values.Status || -1,
        Index: (pagination.current - 1) * pagination.pageSize + 1 ,
        PageCount: pagination.pageSize,
      };

      const response = await queryGoods(params);
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
    fetchData(searchForm.getFieldsValue());
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(values);
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: IGoods) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteGoods(id);
      if (response.Code === 0) {
        message.success('删除成功');
        fetchData(searchForm.getFieldsValue());
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
      Object.assign(values, {
        Content: encodeHTML(values.Content || ''),
        Price: parseInt(values.Price),
        CurrentPrice: parseInt(values.Price),
        Discount: 1,
      })
      if (editingRecord) {
        const response = await modifyGoods({ ...values, ID: editingRecord.ID });
        if (response.Code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData(searchForm.getFieldsValue());
        } else {
          message.error(response.Message || '更新失败');
        }
      } else {
        const response = await createGoods(values);
        if (response.Code === 0) {
          message.success('添加成功');
          setModalVisible(false);
          fetchData(searchForm.getFieldsValue());
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
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number) => (
        status === 1 ? <Tag color="success">启用</Tag> : <Tag color="error">禁用</Tag>
      ),
    },
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: '商品类型',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: '商品图片',
      dataIndex: 'Image',
      key: 'Image',
      render: (image: string) => (
        <img src={image} alt="商品图片" style={{ maxWidth: 100, maxHeight: 100 }} />
      ),
    },
    {
      title: '兑换次数',
      dataIndex: 'Exchange',
      key: 'Exchange',
    },
    // {
    //   title: '原价',
    //   dataIndex: 'Price',
    //   key: 'Price',
    // },
    // {
    //   title: '现价',
    //   dataIndex: 'CurrentPrice',
    //   key: 'CurrentPrice',
    // },
    // {
    //   title: '折扣',
    //   dataIndex: 'Discount',
    //   key: 'Discount',
    // },
    {
      title: '所需积分',
      dataIndex: 'Point',
      key: 'Point',
    },
    {
      title: '库存',
      dataIndex: 'InStock',
      key: 'InStock',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IGoods) => (
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
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 8 }}
      >
        <Form.Item name="Name" label="商品名称">
          <Input placeholder="请输入商品名称" allowClear />
        </Form.Item>
        <Form.Item name="Type" label="商品类型">
          <Select placeholder="请选择商品类型" allowClear style={{ width: 120 }}>
            <Select.Option value="豪华套餐">豪华套餐</Select.Option>
            <Select.Option value="普通套餐">普通套餐</Select.Option>
            <Select.Option value="单品">单品</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="Status" label="状态">
          <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
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

      <div style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={handleAdd}>
          新增商品
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="ID"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`}}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
      />

      <Modal
        title={editingRecord ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Type"
            label="商品类型"
            rules={[{ required: true, message: '请选择商品类型' }]}
          >
            <Select>
              <Select.Option value="豪华套餐">豪华套餐</Select.Option>
              <Select.Option value="普通套餐">普通套餐</Select.Option>
              <Select.Option value="单品">单品</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="Image"
            label="商品图片"
            rules={[{ required: true, message: '请上传商品图片' }]}
          >
            <UrlUpload text="请上传商品图片" />
          </Form.Item>
          <Form.Item
            name="Exchange"
            label="兑换次数"
            rules={[{ required: true, message: '请输入兑换次数' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          {/*<Form.Item*/}
          {/*  name="Price"*/}
          {/*  label="原价"*/}
          {/*  rules={[{ required: true, message: '请输入原价' }]}*/}
          {/*>*/}
          {/*  <InputNumber min={0} style={{ width: '100%' }} />*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  name="CurrentPrice"*/}
          {/*  label="现价"*/}
          {/*  rules={[{ required: true, message: '请输入现价' }]}*/}
          {/*>*/}
          {/*  <InputNumber min={0} disabled style={{ width: '100%' }} />*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  name="Discount"*/}
          {/*  label="折扣"*/}
          {/*  rules={[{ required: true, message: '请输入折扣' }]}*/}
          {/*>*/}
          {/*  <InputNumber min={0} max={1} defaultValue={1} step={0.01} onChange={v => form.setFieldValue('CurrentPrice', (v * form.getFieldValue('Price')).toPrecision(0))} style={{ width: '100%' }} />*/}
          {/*</Form.Item>*/}
          <Form.Item
            name="Point"
            label="所需积分"
            rules={[{ required: true, message: '请输入所需积分' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="InStock"
            label="库存"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="Content"
            label="商品详情"
            rules={[{ required: true, message: '请输入商品详情' }]}
          >
            <CustomEditor />
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
        </Form>
      </Modal>
    </div>
  );
};

export default GoodsManagement;
