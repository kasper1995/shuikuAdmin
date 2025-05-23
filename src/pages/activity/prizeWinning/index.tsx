import { modifyPrizeWinning, queryPrizeWinning } from '@/api/activity/prizeWinning';
import { PrizeWinningRecord } from '@/interface/activity/prizeWinning';
import { exportExcel } from '@/utils/exportExcel';
import { Button, Card, DatePicker, Form, Input, Modal, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

const PrizeWinningPage: React.FC = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PrizeWinningRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PrizeWinningRecord | null>(null);

  const columns: ColumnsType<PrizeWinningRecord> = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '抽奖ID',
      dataIndex: 'LuckyID',
      key: 'LuckyID',
      width: 100,
    },
    {
      title: '用户ID',
      dataIndex: 'MemberID',
      key: 'MemberID',
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
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
    },
    {
      title: '收货人',
      dataIndex: 'DeliveryRealname',
      key: 'DeliveryRealname',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'DeliveryPhone',
      key: 'DeliveryPhone',
      width: 120,
    },
    {
      title: '收货地址',
      dataIndex: 'DeliveryAddress',
      key: 'DeliveryAddress',
      width: 200,
    },
    {
      title: '快递单号',
      dataIndex: 'ExpressNo',
      key: 'ExpressNo',
      width: 150,
    },
    {
      title: '快递公司',
      dataIndex: 'ExpressCompany',
      key: 'ExpressCompany',
      width: 120,
    },
    {
      title: '发货状态',
      dataIndex: 'DeliveryStatus',
      key: 'DeliveryStatus',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    },
  ];

  const fetchData = async (values: any = {}, isExport = false) => {
    setLoading(true);
    try {
      const res = await queryPrizeWinning({
        MemberID: values.MemberID ? Number(values.MemberID) : undefined,
        PrizeID: values.PrizeID ? Number(values.PrizeID) : undefined,
        StartTime: values.dateRange?.[0]?.format('YYYY-MM-DD 00:00:00'),
        EndTime: values.dateRange?.[1]?.format('YYYY-MM-DD 23:59:59'),
        Index: isExport ? 1 : (pagination.current - 1) * pagination.pageSize + 1,
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

  const handleEdit = (record: PrizeWinningRecord) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      ExpressNo: record.ExpressNo,
      ExpressCompany: record.ExpressCompany,
      DeliveryStatus: record.DeliveryStatus,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    if (!currentRecord) return;

    try {
      const values = await editForm.validateFields();
      const res = await modifyPrizeWinning({
        ID: currentRecord.ID,
        ExpressNo: values.ExpressNo,
        ExpressCompany: values.ExpressCompany,
        DeliveryStatus: values.DeliveryStatus,
      });

      if (res.Code === 0) {
        message.success('修改成功');
        setEditModalVisible(false);
        const formValues = form.getFieldsValue();
        fetchData(formValues);
      } else {
        message.error(res.Status || '修改失败');
      }
    } catch (error) {
      message.error('修改失败');
    }
  };

  const handleExport = async () => {
    const values = form.getFieldsValue();
    const exportData = await fetchData(values, true);
    if (!exportData?.length) {
      message.warning('暂无数据可导出');
      return;
    }

    const headers = [
      'ID',
      '抽奖ID',
      '用户ID',
      '奖品ID',
      '奖品名称',
      '状态',
      '收货人',
      '联系电话',
      '收货地址',
      '快递单号',
      '快递公司',
      '发货状态',
      '创建时间'
    ];

    const exportList = exportData.map(record => [
      record.ID,
      record.LuckyID,
      record.MemberID,
      record.PrizeID,
      record.PrizeName,
      record.Status,
      record.DeliveryRealname,
      record.DeliveryPhone,
      record.DeliveryAddress,
      record.ExpressNo,
      record.ExpressCompany,
      record.DeliveryStatus,
      dayjs(record.CreateTime).format('YYYY-MM-DD HH:mm:ss')
    ]);

    exportExcel({
      fileName: '抽奖活动中奖记录',
      data: exportList,
      headers,
    });
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
          <Form.Item name="MemberID" label="用户ID">
            <Input placeholder="请输入用户ID" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="PrizeID" label="奖品ID">
            <Input placeholder="请输入奖品ID" style={{ width: 200 }} />
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
            <Button style={{ marginLeft: 8 }} onClick={handleExport}>
              导出
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

        <Modal
          title="编辑收货信息"
          open={editModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setEditModalVisible(false)}
          okText="确定"
          cancelText="取消"
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="ExpressNo"
              label="快递单号"
              rules={[{ required: true, message: '请输入快递单号' }]}
            >
              <Input placeholder="请输入快递单号" />
            </Form.Item>
            <Form.Item
              name="ExpressCompany"
              label="快递公司"
              rules={[{ required: true, message: '请输入快递公司' }]}
            >
              <Input placeholder="请输入快递公司" />
            </Form.Item>
            <Form.Item
              name="DeliveryStatus"
              label="发货状态"
              rules={[{ required: true, message: '请选择发货状态' }]}
            >
              <Input type="number" placeholder="请输入发货状态" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default PrizeWinningPage;
