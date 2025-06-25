import { queryActiveLimitLog } from '@/api/activity/limitLog';
import { LimitLog } from '@/interface/activity/limitLog';
import { maskValue } from '@/utils/mask';
import { Button, DatePicker, Form, Modal, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from "react";

const { RangePicker } = DatePicker;

interface RegistrationModalProps {
  activeLimitID: number;
  visible: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ activeLimitID, visible, onClose }: RegistrationModalProps) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<LimitLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const res = await queryActiveLimitLog({
        ActiveLimitID: activeLimitID,
        StartTime: values.dateRange?.[0]?.format('YYYY-MM-DD 00:00:00'),
        EndTime: values.dateRange?.[1]?.format('YYYY-MM-DD 23:59:59'),
        Index: pagination.current,
        PageCount: pagination.pageSize,
      });
      if (res.Code === 0) {
        setData(res.Data.List);
        setPagination(prev => ({
          ...prev,
          total: res.Data.Count,
        }));
      } else {
        message.error(res.Message || '查询失败');
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible, pagination.current, pagination.pageSize]);

  const handleSearch = async (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    await fetchData(values);
  };

  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const columns: ColumnsType<LimitLog> = useMemo(() => {
    const OptionsSelect = JSON.parse(data[0]?.OptionsSelect || '[]');
    const extra = OptionsSelect.map(i => ({
      title: i.option_name,
      dataIndex: i.option_name,
      key: i.option_name,
      width: 100,
      render: (value) => {
        if (typeof value === 'string' && (/身份证|电话|联系方式|手机号/.test(i.option_name))) {
          return maskValue(value);
        }
        return value;
      }
    }))
    let oringin = [
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
      // {
      //   title: '报名信息',
      //   dataIndex: 'OptionsSelect',
      //   key: 'OptionsSelect',
      //   render: (text: string) => {
      //     try {
      //       const options = JSON.parse(text) as Array<{
      //         option_name: string;
      //         value: string | number;
      //       }>;
      //       return options.map(opt => `${opt.option_name}: ${opt.value}`).join('，');
      //     } catch (error) {
      //       return text;
      //     }
      //   },
      // },
      // {
      //   title: '报名人数',
      //   dataIndex: 'Number',
      //   key: 'Number',
      //   width: 100,
      // },
      {
        title: '报名时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        width: 180,
        render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
    return oringin.concat(...extra)
  }, [data]);

  return (
    <Modal
      title="报名记录"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 8 }}
      >
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
    </Modal>
  );
};

export default RegistrationModal;
