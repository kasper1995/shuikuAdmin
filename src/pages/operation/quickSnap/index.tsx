import { deleteQuickSnap, modifyQuickSnap, queryQuickSnap } from '@/api/operation/quickSnap';
import type { QuickSnapRecord } from '@/interface/operation/quickSnap';
import { Button, Card, Descriptions, Image, message, Modal, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const QuickSnapPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QuickSnapRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<QuickSnapRecord | null>(null);

  const areaMap = {
    0: '罗湖',
    1: '福田',
    2: '南山',
    3: '宝安',
    4: '龙岗',
    5: '盐田',
    6: '龙华',
    7: '坪山',
    8: '光明'
  };

  const statusMap = {
    0: { text: '待审核', color: 'warning' },
    1: { text: '审核通过', color: 'success' },
    2: { text: '审核未通过', color: 'error' },
    // 3: { text: '处理中', color: 'processing' }
  };

  const columns: ColumnsType<QuickSnapRecord> = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: '区域',
      dataIndex: 'AreaID',
      key: 'AreaID',
      render: (areaId: number) => areaMap[areaId as keyof typeof areaMap] || '未知',
    },
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '详细地址',
      dataIndex: 'Address',
      key: 'Address',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number) => (
        <span style={{ color: statusMap[status as keyof typeof statusMap].color }}>
          {statusMap[status as keyof typeof statusMap].text}
        </span>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await queryQuickSnap({
        Offset: (page - 1) * size + 1,
        Limit: size,
      });
      if (response.Code === 0) {
        setData(response.Data.List);
        setTotal(response.Data.Count);
      }
    } catch (error) {
      console.error('Failed to fetch quick snap data:', error);
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

  const handleEdit = (record: QuickSnapRecord) => {
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record: QuickSnapRecord) => {
    setCurrentRecord(record);
    setDeleteModalVisible(true);
  };

  const handleStatusChange = async (status: number) => {
    if (!currentRecord) return;

    try {
      const response = await modifyQuickSnap({
        ID: currentRecord.ID,
        Status: status,
      });

      if (response.Code === 0) {
        message.success('状态更新成功');
        setEditModalVisible(false);
        fetchData(currentPage, pageSize);
      } else {
        message.error('状态更新失败');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      message.error('状态更新失败');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentRecord) return;

    try {
      const response = await deleteQuickSnap({
        ID: currentRecord.ID,
      });

      if (response.Code === 0) {
        message.success('删除成功');
        setDeleteModalVisible(false);
        fetchData(currentPage, pageSize);
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      message.error('删除失败');
    }
  };

  return (
    <Card title="随手拍管理">
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
        title="编辑随手拍"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="pending" onClick={() => handleStatusChange(0)}>
            未审核
          </Button>,
          // <Button key="processing" type="primary" onClick={() => handleStatusChange(3)}>
          //   处理中
          // </Button>,
          <Button key="approved" type="primary" onClick={() => handleStatusChange(1)}>
            已处理
          </Button>,
          <Button key="rejected" danger onClick={() => handleStatusChange(2)}>
            未通过
          </Button>,
        ]}
        width={900}
      >
        {currentRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="姓名">{currentRecord.Name}</Descriptions.Item>
            <Descriptions.Item label="手机号">{currentRecord.Phone}</Descriptions.Item>
            <Descriptions.Item label="纬度">{currentRecord.Latitude}</Descriptions.Item>
            <Descriptions.Item label="经度">{currentRecord.Latitude}</Descriptions.Item>
            <Descriptions.Item label="身份证号">{currentRecord.IDCard}</Descriptions.Item>
            <Descriptions.Item label="提交时间">{currentRecord.CreateTime}</Descriptions.Item>
            <Descriptions.Item label="标题" span={2}>{currentRecord.Title}</Descriptions.Item>
            <Descriptions.Item label="详情" span={2}>{currentRecord.Remark}</Descriptions.Item>
            <Descriptions.Item label="图片" span={2}>
              <Image
                src={currentRecord.Dir}
                alt="随手拍图片"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要删除这条随手拍记录吗？此操作不可恢复。</p>
      </Modal>
    </Card>
  );
};

export default QuickSnapPage;
