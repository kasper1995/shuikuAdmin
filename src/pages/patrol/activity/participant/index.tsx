import { queryActivities, queryActivityParticipants } from '@/api/patrol/activity';
import { IActivity, IActivityParticipant } from '@/services/patrol/interface';
import { Button, DatePicker, Form, Input, message, Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

const ActivityParticipant: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IActivityParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [activityOptions, setActivityOptions] = useState<IActivity[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchActivityOptions = async () => {
    try {
      const response = await queryActivities();
      if (response.Code === 0) {
        setActivityOptions(response.Data);
      }
    } catch (error) {
      message.error('获取活动列表失败');
    }
  };

  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const [startTime, endTime] = values.TimeRange || [];
      const params = {
        Name: values.Name,
        ActivityID: values.ActivityID,
        Status: values.Status,
        StartTime: startTime ? startTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
        EndTime: endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
        Index: pagination.current,
        PageCount: pagination.pageSize,
      };

      const response = await queryActivityParticipants(params);
      if (response.Code === 0) {
        setData(response.Data.Items);
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
    fetchActivityOptions();
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
    });
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '活动',
      dataIndex: 'ActivityID',
      key: 'ActivityID',
      render: (ActivityID: number) => {
        return activityOptions.find(i => i.ID === ActivityID)?.Name;
      },
    },
    {
      title: '姓名',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: '联系方式',
      dataIndex: 'Phone',
      key: 'Phone',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number) => (
        status === 1 ? <Tag color="success">已参与</Tag> : <Tag color="error">未参与</Tag>
      ),
    },
    {
      title: '报名时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
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
        <Form.Item name="Name" label="姓名">
          <Input placeholder="请输入姓名" allowClear />
        </Form.Item>
        <Form.Item name="ActivityID" label="活动">
          <Select
            placeholder="请选择活动"
            allowClear
            style={{ width: 200 }}
            options={activityOptions.map(activity => ({
              label: activity.Name,
              value: activity.ID,
            }))}
          />
        </Form.Item>
        <Form.Item name="Status" label="状态">
          <Select
            placeholder="请选择状态"
            allowClear
            style={{ width: 120 }}
            options={[
              { label: '已参与', value: 1 },
              { label: '未参与', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item name="TimeRange" label="报名时间">
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['开始时间', '结束时间']}
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

export default ActivityParticipant;
