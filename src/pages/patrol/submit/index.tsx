import { queryPatrolCategory } from '@/api/patrol/category';
import { querySubmitRecords } from '@/api/patrol/submit';
import { ICate, ISubmitRecord } from '@/services/patrol/interface';
import { Button, DatePicker, Form, Input, message, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const SubmitRecord: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ISubmitRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [cateOptions, setCateOptions] = useState<ICate[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  const fetchCateOptions = async () => {
    try {
      const response = await queryPatrolCategory({});
      if (response.Code === 0) {
        setCateOptions(response.Data);
      }
    } catch (error) {
      message.error('获取试卷列表失败');
    }
  };

  const fetchData = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    try {
      const [startTime, endTime] = values.TimeRange || [];
      const params = {
        Name: values.Name,
        CateID: values.CateID,
        StartTime: startTime ? startTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
        EndTime: endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : undefined,
        Index: (pagination.current - 1) * pagination.pageSize + 1,
        PageCount: pagination.pageSize,
      };

      const response = await querySubmitRecords(params);
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
    fetchCateOptions();
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

  const columns = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '试卷',
      dataIndex: 'CateID',
      key: 'CateID',
      render: (CateID: number) => {
        return cateOptions.find(i => i.ID === CateID)?.Name
      }
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
      title: '成绩',
      dataIndex: 'Score',
      key: 'Score',
      sorter: true,
    },
    {
      title: '答题时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      sorter: true,
      render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
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
        <Form.Item name="CateID" label="试卷">
          <Select
            placeholder="请选择试卷"
            allowClear
            style={{ width: 200 }}
            options={cateOptions.map(cate => ({
              label: cate.Name,
              value: cate.ID,
            }))}
          />
        </Form.Item>
        <Form.Item name="TimeRange" label="提交时间">
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

export default SubmitRecord;
