import { createArticle, deleteArticle, modifyArticle, queryArticle } from '@/api/operation/article';
import CustomEditor from '@/components/customEditor';
import UrlUpload from '@/components/urlUpload';
import VideoList from '@/components/videoList';
import { ArticleQueryParams, ArticleRecord } from '@/interface/operation/article';
import { Button, Form, Input, Modal, Select, Table, message, DatePicker, InputNumber, Space } from "antd";
import { useEffect, useState } from 'react';
import { encodeHTML } from "@/utils/exportExcel/tool";
import dayjs from "dayjs";
import { useTreeDict } from "@/hooks/useTreeDict";
import { fetchDictList } from "@/stores/dict";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const ArticleManagement = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState<ArticleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ArticleRecord | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });



  const dictList = useSelector((state: any) => state.dict.dictList);
  console.log(dictList);
  useEffect(() => {
    dispatch(fetchDictList('article_cate'));
  }, [dispatch]);
  const categoryOptions = dictList['article_cate'];

  // 查询列表
  const fetchData = async () => {
    let params = searchForm.getFieldsValue();
    setLoading(true);
    const [StartTime, EndTime] = params.CreatedTime?.map(i => dayjs(i)) || [];
    const [StartUpdateTime, EndUpdateTime] = params.UpdateTime?.map(i => dayjs(i)) || [];
    if((StartTime && EndTime) || (StartUpdateTime && EndUpdateTime)) {
      params = {
        ...params,
        StartTime: StartTime?.format('YYYY-MM-DD 00:00:00'),
        StartUpdateTime: StartUpdateTime?.format('YYYY-MM-DD 00:00:00'),
        EndTime: EndTime?.format('YYYY-MM-DD 23:59:59'),
        EndUpdateTime: EndUpdateTime?.format('YYYY-MM-DD 23:59:59')
      }
      delete params.CreatedTime;
      delete params.UpdateTime;
    }
    try {
      const res = await queryArticle({
        ...params,
        Offset: (pagination.pageSize || 0) * (pagination.current - 1) + 1,
        Limit: pagination.pageSize,
      });
      if (res.Code === 0) {
        setData(res.Data.List || []);
        setPagination({
          ...pagination,
          total: res.Data.Count || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        });
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  // 表格列定义
  const columns = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '副标题',
      dataIndex: 'Subtitle',
      key: 'Subtitle',
    },
    {
      title: '主图',
      dataIndex: 'Image',
      key: 'Image',
      render: (image: string) => (
        <img src={image} alt="文章主图" style={{ maxWidth: 100, maxHeight: 100 }} />
      ),
    },
    {
      title: '类别',
      dataIndex: 'Cate',
      key: 'Cate',
    },
    {
      title: '作者&来源',
      dataIndex: 'Author',
      key: 'Author',
    },
    {
      title: '排序',
width: 80,
      dataIndex: 'Sort',
      key: 'Sort',
      sorter: true,
    },
    {
      title: '发布时间',
      dataIndex: 'CreatedTime',
      key: 'CreatedTime',
    },
    {
      title: '更新时间',
      dataIndex: 'UpdatedTime',
      key: 'UpdatedTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ArticleRecord) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.ID)}>
            删除
          </Button>
        </Space>
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
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteArticle(id);
          if (res.Code === 0) {
            message.success('删除成功');
            fetchData({
              Title: '',
              Cate: '',
              Offset: 0,
              Limit: pagination.pageSize,
            });
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      debugger
      Object.assign(values, {
        Videos: values.Videos || [],
        Imgs: values.Imgs || [],
        Subtitle: values.Subtitle || '',
        Audio: '',
        Content: encodeHTML(values.Content || ''),
        Sort: +values.Sort || 0,
      })
      if (editingRecord) {
        // 编辑
        const res = await modifyArticle({
          ...values,
          ArticleID: editingRecord.ID,
        });
        if (res.Code === 0) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData({
            Title: '',
            Cate: '',
            Offset: (pagination.current - 1) * pagination.pageSize + 1,
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
            Title: '',
            Cate: '',
            Offset: 0,
            Limit: pagination.pageSize,
          });
        }
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleSearch = (values: any) => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };
  console.log(form.getFieldsValue());
  return (
    <div className="p-6">
      <div className="mb-4" style={{ marginBottom: 8 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="Title" label="标题">
            <Input placeholder="请输入标题" allowClear />
          </Form.Item>
          <Form.Item name="Cate" label="类别">
            <Select
              placeholder="请选择类别"
              allowClear
              style={{ width: 200 }}
              options={categoryOptions?.map(item => ({
                label: item.Desc,
                value: item.Value,
              }))}
            />
          </Form.Item>
          <Form.Item name="CreatedTime" label="发布时间">
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item name="UpdateTime" label="更新时间">
            <DatePicker.RangePicker />
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
      </div>

      <div className="mb-4">
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
        rowKey="ID"
        pagination={pagination}
        onChange={(newPagination) => setPagination({
          current: newPagination.current || 1,
          pageSize: newPagination.pageSize || 10,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        })}
      />

      <Modal
        title={editingRecord ? '编辑文章' : '新增文章'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
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
            name="Subtitle"
            label="副标题"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Cate"
            label="类别"
            rules={[{ required: true, message: '请选择类别' }]}
          >
            <Select
              options={categoryOptions?.map(item => ({
                label: item.Desc,
                value: item.Value,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="Author"
            label="作者&来源"
            rules={[{ required: true, message: '请输入作者&来源' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Image"
            label="主图"
            rules={[{ required: true, message: '请上传主图' }]}
          >
            <UrlUpload text="点击上传主图" />
          </Form.Item>
          <Form.Item
            name="Content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <CustomEditor />
          </Form.Item>
          <Form.Item
            name="Intro"
            label="简介"
            rules={[{ required: true, message: '请输入简介' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="Sort"
            label="排序"
            initialValue={1}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="Videos"
            label="视频信息"
          >
            <VideoList name="Videos" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ArticleManagement;
