import { modifyUserFeedback, queryUserFeedback } from '@/api/operation/userFeedback';
import type { UserFeedbackRecord } from '@/interface/operation/userFeedback';
import { Button, Card, DatePicker, Form, Input, message, Modal, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const UserFeedbackPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserFeedbackRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [form] = Form.useForm();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<UserFeedbackRecord | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | undefined>(undefined);
  const [searchForm] = Form.useForm();

  const columns: ColumnsType<UserFeedbackRecord> = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: '反馈内容',
      dataIndex: 'Question',
      key: 'Question',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
    },
    {
      title: '回复信息',
      dataIndex: 'Reply',
      key: 'Reply',
    },
    {
      title: '反馈时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
    },
    {
      title: '回复时间',
      dataIndex: 'ReplyTime',
      key: 'ReplyTime',
    },
    {
      title: '图片一',
      dataIndex: 'Imgs',
      key: 'img1',
      render: (_, record) => record.Imgs[0] ? <img src={record.Imgs[0]} alt="图片一" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : '-',
    },
    {
      title: '图片二',
      dataIndex: 'Imgs',
      key: 'img2',
      render: (_, record) => record.Imgs[1] ? <img src={record.Imgs[1]} alt="图片二" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : '-',
    },
    {
      title: '图片三',
      dataIndex: 'Imgs',
      key: 'img3',
      render: (_, record) => record.Imgs[2] ? <img src={record.Imgs[2]} alt="图片三" style={{ width: 50, height: 50, objectFit: 'cover' }} /> : '-',
    },
    {
      title: '水源区名称',
      dataIndex: 'WaterLabName',
      key: 'WaterLabName',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleReply(record)}>
          回复
        </Button>
      ),
    },
  ];

  const fetchData = async (page: number, size: number, searchParams: any = {}) => {
    setLoading(true);
    try {
      const response = await queryUserFeedback({
        ...searchParams,
        Offset: (page - 1) * size + 1,
        Limit: size,
      });
      if (response.Code === 0) {
        setData(response.Data.List);
        setTotal(response.Data.Count);
      }
    } catch (error) {
      console.error('Failed to fetch user feedback data:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleReply = (record: UserFeedbackRecord) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      Status: record.Status,
      Reply: record.Reply,
    });
    setReplyModalVisible(true);
  };

  const handleReplySubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!currentRecord) return;

      const response = await modifyUserFeedback({
        QuestionID: currentRecord.ID,
        Status: values.Status,
        Reply: values.Reply,
      });

      if (response.Code === 0) {
        message.success('回复成功');
        setReplyModalVisible(false);
        fetchData(currentPage, pageSize);
      } else {
        message.error('回复失败');
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
      message.error('提交失败');
    }
  };

  const handleSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      const searchParams: any = {};

      if (values.CreateTime) {
        searchParams.CreateStartTime = values.CreateTime[0].format('YYYY-MM-DD HH:mm:ss');
        searchParams.CreateEndTime = values.CreateTime[1].format('YYYY-MM-DD HH:mm:ss');
      }

      if (values.Status) {
        searchParams.Status = values.Status;
      }

      setCurrentPage(1);
      fetchData(1, pageSize, searchParams);
    } catch (error) {
      console.error('Search validation failed:', error);
    }
  };

  return (
    <Card title="用户反馈管理">
      <Form
        form={searchForm}
        layout="inline"
        style={{ marginBottom: 16 }}
        onFinish={handleSearch}
      >
        <Form.Item name="Status" label="状态">
          <Select style={{ width: 120 }} allowClear>
            <Select.Option value="无效反馈">无效反馈</Select.Option>
            <Select.Option value="已回复">已回复</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="CreateTime" label="反馈时间">
          <RangePicker showTime />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="ID"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title="回复反馈"
        open={replyModalVisible}
        onOk={handleReplySubmit}
        onCancel={() => setReplyModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select onChange={value => {
              setCurrentStatus(value);
              form.setFieldValue('Reply', undefined);
            }} allowClear>
              <Select.Option value="无效反馈">无效反馈</Select.Option>
              <Select.Option value="已回复">已回复</Select.Option>
            </Select>
          </Form.Item>
          {currentStatus !== '无效反馈' &&<Form.Item
            name="Reply"
            label="回复内容"
            rules={[{ required: true, message: '请输入回复内容' }]}
          >
            <TextArea rows={4} />
          </Form.Item>}
        </Form>
      </Modal>
    </Card>
  );
};

export default UserFeedbackPage;
