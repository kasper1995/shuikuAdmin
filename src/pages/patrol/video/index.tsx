import { createPatrolVideo, deletePatrolVideo, modifyPatrolVideo, queryPatrolVideo } from '@/api/patrol/video';
import { uploadFile } from '@/api/upload';
import { PatrolVideo } from '@/interface/patrol/video';
import { Button, Form, Input, Modal, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import UrlInput from '@/components/urlInput';

const VideoManagement = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PatrolVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PatrolVideo | null>(null);

  // 查询列表
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryPatrolVideo();
      if (res.Code === 0) {
        setData(res.Data || []);
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 处理文件上传
  const handleUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const res = await uploadFile(file);
          if (res) {
            form.setFieldValue('URL', res);
            message.success('上传成功');
          }
        } catch (error) {
          message.error('上传失败');
        }
      }
    };
  };

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '视频地址',
      dataIndex: 'URL',
      key: 'URL',
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: '排序',
      dataIndex: 'Sort',
      key: 'Sort',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PatrolVideo) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.ID)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: PatrolVideo) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (ID: number) => {
    try {
      const res = await deletePatrolVideo(ID);
      if (res.Code === 0) {
        message.success('删除成功');
        fetchData();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        // 编辑
        const res = await modifyPatrolVideo({
          ...values,
          ID: editingRecord.ID,
        });
        if (res.Code === 0) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        }
      } else {
        // 新增
        const res = await createPatrolVideo(values);
        if (res.Code === 0) {
          message.success('创建成功');
          setModalVisible(false);
          fetchData();
        }
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <Button type="primary" onClick={() => {
          setEditingRecord(null);
          form.resetFields();
          setModalVisible(true);
        }}>
          新增视频
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ID"
      />

      <Modal
        title={editingRecord ? '编辑视频' : '新增视频'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="URL"
            label="视频地址"
            rules={[{ required: true, message: '请输入视频地址' }]}
          >
            <UrlInput text="上传视频"/>
          </Form.Item>
          <Form.Item
            name="Sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VideoManagement;
