import { queryLimitActivities } from '@/api/activity/limit';
import { queryActiveLimitLog } from '@/api/activity/limitLog';
import { LimitActivity, LimitLog } from '@/interface/activity/limitLog';
import { exportExcel } from '@/utils/exportExcel';
import { Button, DatePicker, Empty, Form, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const { RangePicker } = DatePicker;

const LimitActivityLog = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<LimitLog[]>([]);
  const [activities, setActivities] = useState<LimitActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  // 获取限时活动列表
  const fetchActivities = async () => {
    try {
      const res = await queryLimitActivities({
        Page: 1,
        PageSize: 999,
      });
      if (res.Code === 0) {
        setActivities(res.Data);
      }
    } catch (error) {
      message.error('获取限时活动列表失败');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchData = async (values: any = {}, isExport = false) => {
    if (!values.activeLimitID) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const res = await queryActiveLimitLog({
        ActiveLimitID: values.activeLimitID,
        StartTime: values.dateRange?.[0]?.format('YYYY-MM-DD 00:00:00'),
        EndTime: values.dateRange?.[1]?.format('YYYY-MM-DD 23:59:59'),
        Index: isExport ? 1 : pagination.current,
        PageCount: isExport ? 999 : pagination.pageSize,
      });
      if (res.Code === 0) {
        if (isExport) {
          return res.Data.List;
        } else {
          setData(res.Data.List);
          setPagination(prev => ({
            ...prev,
            total: res.Data.Count,
          }));
        }
      } else {
        message.error(res.Message || '查询失败');
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
    setData([]);
  };

  const handleExport = async () => {
    const values = form.getFieldsValue();
    if (!values.activeLimitID) {
      message.warning('请先选择限时活动');
      return;
    }

    const exportData = await fetchData(values, true);
    if (!exportData?.length) {
      message.warning('暂无数据可导出');
      return;
    }

    // 获取当前选中的活动
    const selectedActivity = activities.find(a => a.ID === values.activeLimitID);
    if (!selectedActivity) return;

    // 解析选项配置
    const optionsConfig = JSON.parse(selectedActivity.Options || '[]');
    
    // 构建表头
    const headers = [
      { title: 'ID', dataIndex: 'ID' },
      { title: '用户ID', dataIndex: 'UID' },
      { title: '登记时间', dataIndex: 'CreateTime', render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
      ...optionsConfig.map((option: any) => ({
        title: option.option_name,
        dataIndex: option.option_name,
        render: (_: any, record: any) => {
          const currentRow = JSON.parse(record?.OptionsSelect || '[]').find((j: any) => j.option_name === option.option_name);
          return currentRow?.value;
        }
      }))
    ];

    // 构建导出数据
    const exportList = exportData.map(record => {
      const row: any = {
        'ID': record.ID,
        '用户ID': record.UID,
        '登记时间': dayjs(record.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
      };

      // 添加动态字段
      const optionsSelect = JSON.parse(record.OptionsSelect || '[]');
      optionsSelect.forEach((option: any) => {
        row[option.option_name] = option.value;
      });

      return row;
    });

    // 导出Excel
    exportExcel({
      fileName: `${selectedActivity.Title}-报名记录`,
      data: exportList,
    });
  };

  const columns: ColumnsType<LimitLog> = useMemo(() => {
    if (!data.length) return [];

    const OptionsSelect = JSON.parse(data[0]?.OptionsSelect || '[]');
    const extra = OptionsSelect.map((i) => {
      return {
        title: i.option_name,
        dataIndex: i.option_name,
        key: i.option_name,
        width: 100,
        render: (_, record, index) => {
          const currentRow = JSON.parse(record?.OptionsSelect || '[]').find(j => j.option_name === i.option_name);
          return currentRow?.value
        }
      }
    });

    return [
      {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
        width: 80,
      },
      {
        title: '用户ID',
        dataIndex: 'UID',
        key: 'UID',
        width: 100,
      },
      {
        title: '登记时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        width: 180,
        render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      ...extra
    ];
  }, [data]);

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 8 }}
      >
        <Form.Item name="activeLimitID" label="限时活动">
          <Select
            placeholder="请选择限时活动"
            style={{ width: 200 }}
            allowClear
          >
            {activities.map(activity => (
              <Select.Option key={activity.ID} value={activity.ID}>
                {activity.Title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="dateRange" label="报名时间">
          <RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
            重置
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleExport}>
            导出
          </Button>
        </Form.Item>
      </Form>

      {!form.getFieldValue('activeLimitID') ? (
        <Empty description="请选择限时活动" />
      ) : (
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
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`
            }));
          }}
        />
      )}
    </div>
  );
};

export default LimitActivityLog;
