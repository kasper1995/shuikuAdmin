import { queryPatrolCategory } from '@/api/patrol/category';
import { createPatrolQuestion, deletePatrolQuestion, modifyPatrolQuestion, queryPatrolQuestion } from '@/api/patrol/question';
import UrlInput from '@/components/urlInput';
import { PatrolCategory, PatrolQuestion } from '@/interface/patrol/question';
import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import OptionsList from './components/OptionsList';
import CategoryModal from "@/pages/patrol/question/components/CategoryModal";
const QuestionManagement = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PatrolQuestion[]>([]);
  const [categories, setCategories] = useState<PatrolCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PatrolQuestion | null>(null);

  // 查询分类列表
  const fetchCategories = async () => {
    try {
      const res = await queryPatrolCategory();
      if (res.Code === 0) {
        setCategories(res.Data || []);
      }
    } catch (error) {
      message.error('查询分类失败');
    }
  };

  // 查询试题列表
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await queryPatrolQuestion({
        Index: 1,
        PageCount: 10
      });
      if (res.Code === 0) {
        setData(res.Data.List || []);
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '问题',
      dataIndex: 'Title',
      key: 'Title',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      width: 180,
      render: (time: string) => {
        return new Date(time).toLocaleString();
      },
    },
    {
      title: '题目类型',
      dataIndex: 'Type',
      key: 'Type',
      width: 100,
      render: (type: number) => {
        const typeMap = {
          1: '单选题',
          2: '多选题',
          3: '判断题',
          4: '填空题',
        };
        return typeMap[type] || '未知类型';
      },
    },
    {
      title: '试卷',
      dataIndex: 'CateID',
      key: 'CateID',
      width: 120,
      render: (cateId: number) => {
        const category = categories.find(c => c.ID === cateId);
        return category?.NAME || '';
      },
    },
    {
      title: '答案(选择)',
      dataIndex: 'Answer',
      key: 'Answer',
      width: 150,
      ellipsis: true,
    },
    {
      title: '分数',
      dataIndex: 'Point',
      key: 'Point',
      width: 80,
      sorter: (a: PatrolQuestion, b: PatrolQuestion) => a.Point - b.Point,
    },
    {
      title: '排序',
      dataIndex: 'Sort',
      key: 'Sort',
      width: 80,
      sorter: (a: PatrolQuestion, b: PatrolQuestion) => a.Sort - b.Sort,
    },
    {
      title: '正确率',
      dataIndex: 'Relevancy',
      key: 'Relevancy',
      width: 100,
      render: (relevancy: string) => {
        const data = JSON.parse(relevancy || '{}');
        return data ? `${((data?.correct / data?.people_nums) * 100).toFixed(2)}%` : '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_: any, record: PatrolQuestion) => (
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
  const handleEdit = (record: PatrolQuestion) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (ID: number) => {
    try {
      const res = await deletePatrolQuestion(ID);
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
        const res = await modifyPatrolQuestion({
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
        const res = await createPatrolQuestion(values);
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
        <CategoryModal />
        <Button type="primary" onClick={() => {
          setEditingRecord(null);
          form.resetFields();
          setModalVisible(true);
        }}>
          新增试题
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ID"
        scroll={{ x: 1300 }}
      />

      <Modal
        title={editingRecord ? '编辑试题' : '新增试题'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Title"
            label="题目"
            rules={[{ required: true, message: '请输入题目' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="TitleImg"
            label="题目图片"
          >
            <UrlInput text="上传图片" />
          </Form.Item>
          <Form.Item
            name="CateID"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select>
              {categories.map(category => (
                <Select.Option key={category.ID} value={category.ID}>
                  {category.NAME}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Type"
            label="题目类型"
            rules={[{ required: true, message: '请选择题目类型' }]}
          >
            <Select>
              <Select.Option value={1}>单选题</Select.Option>
              <Select.Option value={2}>多选题</Select.Option>
              <Select.Option value={3}>判断题</Select.Option>
              <Select.Option value={4}>填空题</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="Options"
            label="选项"
            rules={[{ required: true, message: '请输入选项' }]}
          >
            <OptionsList
              answer={editingRecord?.Answer || ''}
              onAnswerChange={(value) => form.setFieldValue('Answer', value)}
              type={form.getFieldValue('Type') || 1}
            />
          </Form.Item>
          <Form.Item
            name="Point"
            label="分值"
            rules={[{ required: true, message: '请输入分值' }]}
          >
            <Input type="number" />
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

export default QuestionManagement;
