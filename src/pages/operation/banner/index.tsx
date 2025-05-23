import { createBanner, deleteBanner, modifyBanner, queryBanner } from '@/api/operation/banner';
import { queryStyle } from '@/api/operation/style';
import UrlUpload from "@/components/urlUpload";
import { Style } from '@/interface/operation/style';
import { ISailView } from '@/services/operation/interface';
import { Button, Form, Input, InputNumber, message, Modal, Select, Space, Switch, Table, Tag } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
const { Option } = Select;

const SailViewManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const waterSelectRef = useRef(null)
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
  const [styles, setStyles] = useState<Style[]>([]);

  const fetchData = useCallback(async () => {
    const values = searchForm.getFieldsValue();
    setLoading(true);
    try {
      const response = await queryBanner({
        Groups: values.Groups,
        Status: values.Status,
        StyleID: values.StyleID,
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
  }, [pagination.current, pagination.pageSize]);

  const fetchStyles = async () => {
    try {
      const res = await queryStyle();
      if (res.Code === 0) {
        setStyles(res.Data || []);
      }
    } catch (error) {
      message.error('获取皮肤列表失败');
    }
  };

  useEffect(() => {
    fetchData();
    fetchStyles();
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
      const response = await deleteBanner(id);
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
      Object.assign(values, { Status: values.Status ? 1 : 0 });
      if (editingRecord) {
        const response = await modifyBanner({ ...values, BannerID: editingRecord.ID });
        if (response.Code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(response.Message || '更新失败');
        }
      } else {
        const response = await createBanner(values);
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
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: '分组',
      dataIndex: 'Groups',
      key: 'Groups',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number) => (status === 1 ? <Tag color="success">启用</Tag> : <Tag color="error">禁用</Tag>),
    },
    {
      title: '皮肤',
      dataIndex: 'StyleID',
      key: 'StyleID',
      render: _ => {
        const style = styles.find(item => item.ID === _);
        return style ? style.Title : '未知皮肤';
      }
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
      title: '排序',
      width: 80,
      dataIndex: 'Sort',
      key: 'Sort',
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
          form={searchForm}
          layout="inline"
        >
          <Form.Item name="Groups" label="分组">
            <Input placeholder="请输入分组" allowClear />
          </Form.Item>
          <Form.Item name="Status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="StyleID" label="皮肤选择">
            <Select placeholder="请选择皮肤">
              {styles.map(style => (
                <Select.Option key={style.ID} value={style.ID}>
                  {style.Title}
                </Select.Option>
              ))}
            </Select>
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
        <Button type="primary" onClick={handleAdd} style={{ margin: '8px 0' }}>
          新增轮播图
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
        title={editingRecord ? '编辑轮播图' : '新增轮播图'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Groups"
            label="轮播图分组"
            rules={[{ required: true, message: '请输入轮播图分组' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="StyleID"
            label="皮肤选择"
            rules={[{ required: true, message: '请选择皮肤' }]}
          >
            <Select placeholder="请选择皮肤">
              {styles.map(style => (
                <Select.Option key={style.ID} value={style.ID}>
                  {style.Title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Image"
            label="图片"
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <UrlUpload text="请输入图片" />
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

export default SailViewManagement;
