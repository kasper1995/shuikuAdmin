import { queryLuckyDraw } from '@/api/activity/luckyDraw';
import { LuckyDrawRecord } from '@/interface/activity/luckyDraw';
import { Button, Card, DatePicker, Form, Input, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

const LuckyDrawPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LuckyDrawRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns: ColumnsType<LuckyDrawRecord> = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '用户ID',
      dataIndex: 'MemberID',
      key: 'MemberID',
      width: 100,
    },
    {
      title: '答题分数',
      dataIndex: 'AnswerScore',
      key: 'AnswerScore',
      width: 100,
    },
    {
      title: '奖品ID',
      dataIndex: 'PrizeID',
      key: 'PrizeID',
      width: 100,
    },
    {
      title: '奖品名称',
      dataIndex: 'PrizeName',
      key: 'PrizeName',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const res = await queryLuckyDraw({
        ID: values.ID ? Number(values.ID) : undefined,
        StartTime: values.dateRange?.[0]?.format('YYYY-MM-DD 00:00:00'),
        EndTime: values.dateRange?.[1]?.format('YYYY-MM-DD 23:59:59'),
        Index: (pagination.current - 1) * pagination.pageSize + 1,
        PageCount: pagination.pageSize,
      });
      if (res.Code === 0) {
        setData(res.Data.List);
        setPagination(prev => ({
          ...prev,
          total: res.Data.Count,
        }));
      } else {
        message.error(res.Status || '查询失败');
      }
    } catch (error) {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const values = form.getFieldsValue();
    fetchData(values);
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = async (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    await fetchData(values);
  };

  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  return (
    <div className="p-6">
      <Card>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="ID" label="ID">
            <Input placeholder="请输入ID" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="dateRange" label="创建时间">
            <RangePicker />
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
          loading={loading}
          rowKey="ID"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={(page) => {
            setPagination(prev => ({
              ...prev,
              current: page.current || 1,
              pageSize: page.pageSize || 10,
            }));
          }}
        />
      </Card>
    </div>
  );
};

export default LuckyDrawPage;
