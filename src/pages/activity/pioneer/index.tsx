import type { IPioneer, IPioneerQueryParams } from '@/api/activity/pioneer';

import { Button, DatePicker, Form, Input, message, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { queryPioneers } from '@/api/activity/pioneer';
import { exportExcel } from "@/utils/exportExcel";
import { maskValue } from '@/utils/mask';

const PioneerManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IPioneer[]>([]);
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
      const params: IPioneerQueryParams = {
        StudentName: values.StudentName,
        GuardianPhone: values.GuardianPhone,
        StudentCard: values.StudentCard,
        StartTime: values.timeRange?.[0]?.format('YYYY-MM-DD 00:00:00'),
        EndTime: values.timeRange?.[1]?.format('YYYY-MM-DD 23:59:59'),
        Index: (pagination.current - 1) * pagination.pageSize + 1,
        PageCount: pagination.pageSize,
      };

      const response = await queryPioneers(params);

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

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'StudentName',
      key: 'StudentName',
    },
    {
      title: '学生性别',
      dataIndex: 'StudentSex',
      key: 'StudentSex',
    },
    {
      title: '学生身份证号',
      dataIndex: 'StudentCard',
      key: 'StudentCard',
      render: (text) => maskValue(text),
    },
    {
      title: '学生所在学校',
      dataIndex: 'StudentSch',
      key: 'StudentSch',
    },
    {
      title: '学生所在班级',
      dataIndex: 'StudentCls',
      key: 'StudentCls',
    },
    {
      title: '监护人姓名',
      dataIndex: 'GuardianName',
      key: 'GuardianName',
    },
    {
      title: '监护人关系',
      dataIndex: 'GuardianRel',
      key: 'GuardianRel',
    },
    {
      title: '监护人电话',
      dataIndex: 'GuardianPhone',
      key: 'GuardianPhone',
      render: (text) => maskValue(text),
    },
    {
      title: '报名时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
  const handleExport = async () => {
    try {
      const res: any = await queryPioneers({Index: 1, PageCount: 999});
      exportExcel({
        data: res.Data.List.map(i => {
          const tmp = []
          columns.forEach((item) => {
            tmp.push(i[item.dataIndex])
          })
          return tmp
        }),
        headers: columns.map(i => i.title),
        fileName: '少先队员列表',
        sheetName: '少先队员信息'
      });
      // const toExcel = exportExcel(initExportData(data));
      // debugger
      // toExcel.saveExcel();

    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div>
      <Form form={form} layout="inline" style={{ marginBottom: 8 }}>
        <Form.Item name="StudentName" label="学生姓名">
          <Input placeholder="请输入学生姓名" allowClear />
        </Form.Item>
        <Form.Item name="GuardianPhone" label="电话">
          <Input placeholder="请输入监护人电话" allowClear />
        </Form.Item>
        <Form.Item name="StudentCard" label="身份证号">
          <Input placeholder="请输入学生身份证号" allowClear />
        </Form.Item>
        <Form.Item name="timeRange" label="报名时间">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={() => handleSearch(form.getFieldsValue())}>
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <div>
        <Button type="primary" onClick={handleExport}>导出</Button>
      </div>
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

export default PioneerManagement;
