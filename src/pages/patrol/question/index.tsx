import { queryPatrolCategory } from '@/api/patrol/category';
import { createPatrolQuestion, deletePatrolQuestion, modifyPatrolQuestion, queryPatrolQuestion } from '@/api/patrol/question';
import UrlUpload from '@/components/urlUpload';
import { PatrolCategory } from '@/interface/patrol/category';
import { PatrolQuestion } from '@/interface/patrol/question';
import CategoryModal from "@/pages/patrol/question/components/CategoryModal";
import { exportExcel } from '@/utils/exportExcel';
import { importExcel } from '@/utils/importExcel';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Select, Space, Table, Upload } from "antd";
import type { ColumnsType } from 'antd/es/table';
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import OptionsList from './components/OptionsList';

const { Dragger } = Upload;

const QuestionManagement = () => {
  const optionsListRef = useRef(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState<PatrolQuestion[]>([]);
  const [categories, setCategories] = useState<PatrolCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [editingRecord, setEditingRecord] = useState<PatrolQuestion | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条` });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const importConfig = {
    headers: [
      "问题",
      "选项数据",
      "答案(选择)",
    ],
    requiredFields: ['Title', 'Options', 'Answer'],
    defaultValues: {
      Type: 1,
      OptionType: 1,
      TitleImg: '',
      Sort: 0,
    },
    fieldMapping: {
      '问题': 'Title',
      '选项数据': 'Options',
      '答案(选择)': 'Answer',
    },
  };

  const handleFileUpload = async (file: File) => {
    const result = await importExcel(file, importConfig);
    try{
      if (result.success) {
        // 转换分类名称为ID
        const questions = result.data.map(question => ({
          ...question,
          Answer: String(question.Answer).split(',').map((item: string) => item.trim()).join(','),
          CateID: +categories.find(c => c.Name === question.CateID)?.ID || 0,
          Type: String(question?.Answer)?.split(',').length > 1 ? 2 : 1,
          Relevancy: '',
          Point: 10
        }));;
        setParsedQuestions(questions);
        setConfirmModalVisible(true);
      } else {
        message.error(result.message || '文件解析失败');
      }
    }catch (e){
      console.log(e);
    }
    return false;
  };

  const handleConfirmUpload = async () => {
    try {
      const response = await createPatrolQuestion(parsedQuestions);
      if (response.Code === 0) {
        message.success('批量导入成功');
        setConfirmModalVisible(false);
        setUploadModalVisible(false);
        fetchData();
      } else {
        message.error(response.Message || '批量导入失败');
      }
    } catch (error) {
      message.error('批量导入失败');
    }
  };

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
  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const res = await queryPatrolQuestion({
        Title: values.Title,
        CateID: values.CateID,
        Type: values.Type,
        Index: (pagination.current - 1) * pagination.pageSize + 1,
        PageCount: pagination.pageSize,
      });
      if (res.Code === 0) {
        setData(res.Data.List || []);
        setPagination(prev => ({ ...prev, total: res.Data.Count }));
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

  useEffect(() => {
    fetchData()
  }, [pagination.current, pagination.pageSize]);

  // 表格列定义
  const columns: ColumnsType<PatrolQuestion> = [
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
      render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
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
        return category?.Name || '';
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
        return data && relevancy ? `${((data?.correct / data?.people_nums) * 100).toFixed(2)}%` : '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: PatrolQuestion) => (
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
      const answers = optionsListRef.current?.getAnswers() || [];
      const isMultipleChoice = answers?.length > 1;
      Object.assign(values, {
        Answer: answers.join(),
        Type: isMultipleChoice ? 2 : 1, // 根据答案数量自动判断题目类型
        Point: +values.Point,
      });
      if (editingRecord?.ID) {
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
        const res = await createPatrolQuestion([values]);
        if (res.Code === 0) {
          message.success('创建成功');
          setModalVisible(false);
          fetchData();
        }
      }
    } catch (error) {
      console.log(error);
      message.error('操作失败');
    }
  };

  const handleSearch = async (values: any) => {
    await fetchData(values);
  };

  const handleReset = () => {
    searchForm.resetFields();
    fetchData();
  };

  const handleExport = () => {
    const exportData = (selectedRowKeys.length > 0
      ? data.filter(item => selectedRowKeys.includes(item.ID))
      : data
    ).map((item) => ({
      '题目': item.Title,
      '类型': item.Type === 1 ? '单选题' : item.Type === 2 ? '多选题' : '判断题',
      '选项': item.Options,
      '答案': item.Answer,
      '难度': item.Relevancy,
      '试卷': item.CateID,
      '创建时间': dayjs(item.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
    }));

    exportExcel({
      data: exportData,
      fileName: '巡查试题列表',
      sheetName: '试题',
    });
  };

  return (
    <div className="p-6">

      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 8 }}
      >
        <Form.Item name="Title" label="题目">
          <Input placeholder="请输入题目" allowClear />
        </Form.Item>
        <Form.Item name="CateID" label="试卷">
          <Select placeholder="请选择试卷" allowClear style={{ width: 200 }}>
            {categories.map(category => (
              <Select.Option key={category.ID} value={category.ID}>
                {category.Name}
              </Select.Option>
            ))}
          </Select>
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

      <div className="mb-4 flex justify-between">
        <Space>
          <CategoryModal />
          <Button type="primary" onClick={() => {
            setEditingRecord(null);
            form.resetFields();
            setModalVisible(true);
          }}>
            新增试题
          </Button>
          <Button type="primary" onClick={() => setUploadModalVisible(true)}>
            上传试题
          </Button>
          <Button type="primary" onClick={handleExport}>
            导出试题
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ID"
        scroll={{ x: 1300 }}
        pagination={pagination}
        onChange={page => setPagination({ ...pagination, ...page })}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />

      <Modal
        title={editingRecord?.ID ? '编辑试题' : '新增试题'}
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
            <UrlUpload text="上传图片" type="image" />
          </Form.Item>
          <Form.Item
            name="CateID"
            label="试卷选择"
          >
            <Select allowClear>
              {categories.map(category => (
                <Select.Option key={category.ID} value={category.ID}>
                  {category.Name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="OptionType"
            label="选项类型"
            rules={[{ required: true, message: '请选择选项类型' }]}
          >
            <Select onChange={value => setEditingRecord(record => ({...record, OptionType: value}))}>
              <Select.Option value={1}>文本</Select.Option>
              <Select.Option value={2}>图片</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="Options"
            label="选项"
            rules={[{ required: true, message: '请输入选项' }]}
          >
            <OptionsList
              answer={editingRecord?.Answer || ''}
              onAnswerChange={(value) => {
                form.setFieldValue('Answer', value)
                setEditingRecord(record => ({...record, Answer: value}))
              }}
              ref={optionsListRef}
              type={editingRecord?.OptionType || 1}
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
            initialValue={1}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="上传试题"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ marginBottom: 8 }}>
          <p style={{ color: 'red' }}>
            注：1.第一行为导入字段中文名称；2.按照字段的排序不可打乱顺序以免出错。
          </p>
          <a href="https://sk.szsybh.cn/static/patrol_quest.xlsx" target="_blank" rel="noopener noreferrer">
            点击下载模板
          </a>
        </div>
        <Upload
          name="file"
          accept=".xlsx,.xls"
          showUploadList={false}
          beforeUpload={handleFileUpload}
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
      </Modal>

      <Modal
        title="确认导入"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfirmModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmUpload}>
            确认导入
          </Button>,
        ]}
        width={800}
      >
        <Table
          columns={[
            {
              title: '问题',
              dataIndex: 'Title',
              key: 'Title',
            },
            {
              title: '选项',
              dataIndex: 'Options',
              key: 'Options',
            },
            {
              title: '答案',
              dataIndex: 'Answer',
              key: 'Answer',
            },
          ]}
          dataSource={parsedQuestions}
          rowKey={(record, index) => index.toString()}
          scroll={{ y: 400 }}
        />
      </Modal>
    </div>
  );
};

export default QuestionManagement;
