import type { IPrize, IPrizeQueryParams } from '@/api/activity/prize';

import { Button, DatePicker, Form, Input, message, Modal, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { modifyPrize, queryPrizes } from '@/api/activity/prize';
import { exportExcel } from '@/utils/exportExcel';

const expressCompanyOptions = [
  { value: 'shunfeng', label: '顺丰' },
  { value: 'zhongtong', label: '中通' },
  { value: 'yuantong', label: '圆通' },
  { value: 'shentong', label: '申通' },
  { value: 'yunda', label: '韵达' },
];

const PrizeManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [logisticsForm] = Form.useForm();
  const [data, setData] = useState<IPrize[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IPrize | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
      const params: IPrizeQueryParams = {
        ID: +values.ID || 0,
        MemberID: +values.MemberID || 0,
        GoodsName: values.GoodsName || '',
        Mobile: values.Mobile || '',
        AddressRealname: values.AddressRealname || '',
        AddressPhone: values.AddressPhone || '',
        AddressExpressNo: values.AddressExpressNo || '',
        AddressExpressCompany: values.AddressExpressCompany || '',
        AddressStatus: +values.AddressStatus || 0,
        StartTime: values.timeRange?.[0]?.format('YYYY-MM-DD 00:00:00'),
        EndTime: values.timeRange?.[1]?.format('YYYY-MM-DD 23:59:59'),
        Index: (pagination.current - 1) * pagination.pageSize + 1,
        PageCount: pagination.pageSize,
      };

      const response = await queryPrizes(params);

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
    fetchData(form.getFieldsValue());
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

  const handleLogistics = (record: IPrize) => {
    setSelectedRecord(record);
    logisticsForm.resetFields();
    setModalVisible(true);
  };

  const handleLogisticsSubmit = async () => {
    try {
      const values = await logisticsForm.validateFields();

      if (selectedRecord) {
        const response = await modifyPrize({
          ID: selectedRecord.ID,
          AddressExpressNo: values.AddressExpressNo,
          AddressExpressCompany: values.AddressExpressCompany,
          AddressStatus: 2,
        });

        if (response.Code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData(form.getFieldsValue());
        } else {
          message.error(response.Message || '更新失败');
        }
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleExport = () => {
    const exportData = (selectedRowKeys.length > 0 ? data.filter(item => selectedRowKeys.includes(item.ID)) : data).map((item) => ({
      '编号': item.ID,
      '用户ID': item.MemberID,
      '奖品名称': item.Name,
      '送货状态': item.AddressStatus === 0 ? '未发货' : item.AddressStatus === 1 ? '已发货' : '已收货',
      '兑换积分': item.Point,
      '寄送方式': item.AddressMethod === 1 ? '快递' : '自提',
      '收货联系人': item.AddressRealname,
      '收货联系方式': item.AddressPhone,
      '收货地址': item.AddressAddress,
      '快递单号': item.AddressExpressNo,
      '兑换时间': dayjs(item.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
      '快递公司': expressCompanyOptions.find(i => i.value === item.AddressExpressCompany)?.label || '未知公司',
    }));

    exportExcel({
      data: exportData,
      fileName: '奖品兑换列表',
      sheetName: '兑换记录',
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: '用户ID',
      dataIndex: 'MemberID',
      key: 'MemberID',
    },
    {
      title: '奖品名称',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: '送货状态',
      dataIndex: 'AddressStatus',
      key: 'AddressStatus',
      render: (status: number) => {
        const statusMap: Record<number, string> = {
          0: '未发货',
          1: '已发货',
          2: '已收货',
        };

        return statusMap[status] || '未知状态';
      },
    },
    {
      title: '兑换积分',
      dataIndex: 'Point',
      key: 'Point',
    },
    {
      title: '寄送方式',
      dataIndex: 'AddressMethod',
      key: 'AddressMethod',
      render: (method: number) => (method === 1 ? '快递' : '自提'),
    },
    {
      title: '收货联系人',
      dataIndex: 'AddressRealname',
      key: 'AddressRealname',
    },
    {
      title: '收货联系方式',
      dataIndex: 'AddressPhone',
      key: 'AddressPhone',
    },
    {
      title: '收货地址',
      dataIndex: 'AddressAddress',
      key: 'AddressAddress',
    },
    {
      title: '快递单号',
      dataIndex: 'AddressExpressNo',
      key: 'AddressExpressNo',
    },
    {
      title: '兑换时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '快递公司',
      dataIndex: 'AddressExpressCompany',
      key: 'AddressExpressCompany',
      render: (company: string) => {
        if (!company) return '未知公司';
        return expressCompanyOptions.find(i => i.value === company)?.label || '未知公司';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IPrize) => (
        <Button type="link" onClick={() => handleLogistics(record)}>
          录入快递
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} layout="inline" style={{ marginBottom: 8 }}>
        <Form.Item name="ID" label="编号">
          <Input placeholder="请输入编号" allowClear />
        </Form.Item>
        <Form.Item name="MemberID" label="用户ID">
          <Input placeholder="请输入用户ID" allowClear />
        </Form.Item>
        <Form.Item name="GoodsName" label="奖品名称">
          <Input placeholder="请输入奖品名称" allowClear />
        </Form.Item>
        <Form.Item name="AddressRealname" label="收货联系人">
          <Input placeholder="请输入收货联系人" allowClear />
        </Form.Item>
        <Form.Item name="AddressPhone" label="收货联系方式">
          <Input placeholder="请输入收货联系方式" allowClear />
        </Form.Item>
        <Form.Item name="AddressExpressNo" label="快递单号">
          <Input placeholder="请输入快递单号" allowClear />
        </Form.Item>
        <Form.Item name="AddressExpressCompany" label="快递公司">
          <Select placeholder="请选择快递公司" allowClear>
            <Select.Option value="sunfeng">顺丰</Select.Option>
            <Select.Option value="zhongtong">中通</Select.Option>
            <Select.Option value="yuantong">圆通</Select.Option>
            <Select.Option value="shentong">申通</Select.Option>
            <Select.Option value="yunda">韵达</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="AddressStatus" label="送货状态">
          <Select placeholder="请选择送货状态" allowClear>
            <Select.Option value={0}>未发货</Select.Option>
            <Select.Option value={1}>已发货</Select.Option>
            <Select.Option value={2}>已收货</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="timeRange" label="兑换时间">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={() => handleSearch(form.getFieldsValue())}>
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
        rowKey="ID"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowSelection={rowSelection}
      />

      <Modal
        title="录入快递信息"
        open={modalVisible}
        onOk={handleLogisticsSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={logisticsForm} layout="vertical">
          <Form.Item name="AddressExpressNo" label="快递单号" rules={[{ required: true, message: '请输入快递单号' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="AddressExpressCompany"
            label="快递公司"
            rules={[{ required: true, message: '请选择快递公司' }]}
          >
            <Select>
              <Select.Option value="sunfeng">顺丰</Select.Option>
              <Select.Option value="zhongtong">中通</Select.Option>
              <Select.Option value="yuantong">圆通</Select.Option>
              <Select.Option value="shentong">申通</Select.Option>
              <Select.Option value="yunda">韵达</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PrizeManagement;
