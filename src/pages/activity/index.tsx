import { deleteActivity, modifyActivity, queryActivities } from '@/api/activity/participation';
import { IActivity } from '@/services/patrol/interface';
import { Button, Form, Input, message, Modal, Select, Switch, Table } from 'antd';
import { useEffect, useState } from 'react';

const ActivityManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
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
        Status: values.Status,
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
      };

      const response = await queryActivities(params);
      if (response.Code === 0) {
        setData(response.Data.Items);
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

  const handleSearch = (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(values);
  };

  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
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

  const handleStatusChange = async (checked: boolean, record: IActivity) => {
    try {
      const response = await modifyActivity({
        ID: record.ID,
        Status: checked ? 1 : 0,
      });
      if (response.Code === 0) {
        message.success('状态更新成功');
        fetchData(form.getFieldsValue());
      } else {
        message.error(response.Message || '状态更新失败');
      }
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个活动吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteActivity(id);
          if (res.Code === 0) {
            message.success('删除成功');
            fetchData(form.getFieldsValue());
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number, record: IActivity) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
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
      sorter: true,
    },
  ];

  return (
    <div>
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 8 }}
      >
        <Form.Item name="Title" label="活动名称">
          <Input placeholder="请输入活动名称" allowClear />
        </Form.Item>
        <Form.Item name="Status" label="状态">
          <Select
            placeholder="请选择状态"
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ]}
          />
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

      <Table
        columns={columns}
        dataSource={data}
        rowKey="ID"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ActivityManagement;
