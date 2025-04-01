import { createArticle, deleteArticle, modifyArticle, queryArticle } from '@/api/operation/article';
import CustomEditor from '@/components/customEditor';
import ImageUpload from '@/components/imageUpload';
import { ArticleQueryParams, ArticleRecord } from '@/interface/operation/article';
import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import { useEffect, useState } from 'react';

const ArticleManagement = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ArticleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ArticleRecord | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 查询列表
  const fetchData = async (params: ArticleQueryParams) => {
    setLoading(true);
    try {
      const res = await queryArticle(params);
      if (res.Code === 0) {
        setData(res.Data.List || []);
        setPagination({
          ...pagination,
          total: res.Data.Total || 0,
        });
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData({
      ArticleID: 0,
      Title: '',
      Author: '',
      Status: -1,
      Offset: 0,
      Limit: pagination.pageSize,
    });
  }, [pagination.current, pagination.pageSize]);

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '作者',
      dataIndex: 'Author',
      key: 'Author',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: (status: number) => (
        <span>{status === 1 ? '已发布' : '草稿'}</span>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'PublishTime',
      key: 'PublishTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ArticleRecord) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.ArticleID!)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: ArticleRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (ArticleID: number) => {
    try {
      const res = await deleteArticle(ArticleID);
      if (res.Code === 0) {
        message.success('删除成功');
        await fetchData({
          ArticleID: 0,
          Title: '',
          Author: '',
          Status: -1,
          Offset: 0,
          Limit: pagination.pageSize,
        });
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
        const res = await modifyArticle({
          ...values,
          ArticleID: editingRecord.ArticleID!,
        });
        if (res.Code === 0) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData({
            Limit: pagination.pageSize,
          });
        }
      } else {
        // 新增
        const res = await createArticle(values);
        if (res.Code === 0) {
          message.success('创建成功');
          setModalVisible(false);
          fetchData({
            ArticleID: 0,
            Title: '',
            Author: '',
            Status: -1,
            Offset: 0,
            Limit: pagination.pageSize,
          });
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
          新增文章
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ArticleID"
        pagination={pagination}
        onChange={(pagination) => setPagination(pagination)}
      />

      <Modal
        title={editingRecord ? '编辑文章' : '新增文章'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
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
            name="Author"
            label="作者"
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value={0}>草稿</Select.Option>
              <Select.Option value={1}>已发布</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
          className='"custom-editor-wrapper"'
            name="Image"
            label="封面图"
            rules={[{ required: true, message: '请上传封面图' }]}
          >
            <ImageUpload text="点击上传封面图" />
          </Form.Item>
          <Form.Item
            name="Content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <CustomEditor />
          </Form.Item>
          <Form.Item
            name="Description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={4} />
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

export default ArticleManagement;
