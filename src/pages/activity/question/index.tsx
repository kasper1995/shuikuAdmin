import { createActivityQuestion, deleteActivityQuestion, modifyActivityQuestion, queryActivityQuestions } from '@/api/activity/question';
import UrlUpload from "@/components/urlUpload";
import WaterSelector, { useWaterLabList } from "@/components/waterSelector/waterSelector";
import { IActivityQuestion } from '@/services/patrol/interface';
import { exportExcel } from '@/utils/exportExcel';
import { importExcel } from '@/utils/importExcel';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Select, Space, Table, Upload } from 'antd';
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import OptionsList from './components/OptionsList';
import { encodeHTML } from "@/utils/exportExcel/tool";

const GradeLevel = {
  1: '水源卫士',
  2: '水源大师',
  3: '水源专家',
}
const ActivityQuestionManagement: React.FC = () => {
  const optionListRef = useRef(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState<IActivityQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [editingRecord, setEditingRecord] = useState<IActivityQuestion | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`
  });

  const { options: waterList, loading: waterLoading } = useWaterLabList();

  const getWaterIdByName = (name: string) => {
    const water = waterList.find(w => w.label === name);
    return water ? water.value : '';
  };

  const importConfig = {
    headers: [
      "问题",
      "选项数据",
      "答案(选择)",
      "关联水库(关联多个用英文逗号连接)",
      "等级"
    ],
    requiredFields: ['Title', 'Options', 'Answer', 'WaterID', 'Grade'],
    defaultValues: {
      Type: 1,
      Point: 1,
      IsAnswer: 1,
      OptionType: 1,
      TitleImg: '',
    },
    fieldMapping: {
      '问题': 'Title',
      '选项数据': 'Options',
      '答案(选择)': 'Answer',
      '关联水库(关联多个用英文逗号连接)': 'WaterID',
      '等级': 'Grade',
    },
  };

  const handleFileUpload = async (file: File) => {
    try{
      const result = await importExcel(file, importConfig);
      if (result.success) {
        // 转换水库名称为ID
        const questions = result.data.map(question => ({
          ...question,
          Answer: String(question.Answer),
          WaterID: String(question.WaterID)?.split(',').map(name => getWaterIdByName(String(name).trim())).join(','),
          Grade: Object.values(GradeLevel).indexOf(question.Grade) + 1,
          IsAnswer: 0
        }));
        setParsedQuestions(questions);
        setConfirmModalVisible(true);
      } else {
        message.error(result.message || '文件解析失败');
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  };

  const handleConfirmUpload = async () => {
    try {
      const response = await createActivityQuestion(parsedQuestions);
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

  const fetchData = async (values: any = {}) => {
    setLoading(true);
    try {
      const params = {
        ...values,
        Index: (pagination.current - 1) * pagination.pageSize + 1,
        PageCount: pagination.pageSize,
      };

      const response = await queryActivityQuestions(params);
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
    fetchData(searchForm.getFieldsValue());
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(values);
  };

  const handleReset = () => {
    searchForm.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: IActivityQuestion) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteActivityQuestion(id);
      if (response.Code === 0) {
        message.success('删除成功');
        fetchData();
      } else {
        message.error(response.Message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const answers = optionListRef.current?.getAnswers() || [];
      const isMultipleChoice = answers.length > 1;

      Object.assign(values, {
        TitleImg: values.TitleImg || '',
        OptionType: values.OptionType, // 选项类型：1文本 2图片
        Type: isMultipleChoice ? 2 : 1, // 题目类型：1单选 2多选
        Answer: answers.join(','),
        IsAnswer: Number(values.IsAnswer),
        WaterID: String(values.WaterID),
      });
      if (editingRecord?.ID) {
        const response = await modifyActivityQuestion({ ...values, ID: editingRecord.ID });
        if (response.Code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(response.Message || '更新失败');
        }
      } else {
        const response = await createActivityQuestion([values]);
        if (response.Code === 0) {
          message.success('添加成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(response.Message || '添加失败');
        }
      }
    } catch (error) {
      console.log(error);
      message.error('操作失败');
    }
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

  const handleExport = () => {
    const exportData = data.map((item) => ({
      '题目': item.Title,
      '类型': item.Type === 1 ? '单选题' : item.Type === 2 ? '多选题' : '判断题',
      '选项': item.Options,
      '答案': item.Answer,
      '难度': GradeLevel[item.Grade] || item.Grade,
      '水库': item.WaterID,
      '创建时间': dayjs(item.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
    }));

    exportExcel({
      data: exportData,
      fileName: '活动试题列表',
      sheetName: '试题',
    });
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      width: 80,
    },
    {
      title: '题目',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '题目类型',
      dataIndex: 'Type',
      key: 'Type',
      render: (type: number) => (
        type === 1 ? '单选题' : type === 2 ? '多选题' : '判断题'
      ),
    },
    {
      title: '选项',
      dataIndex: 'Options',
      key: 'Options',
      width: 450,
      render: (options: string) => options.split(',').join('、'),
    },
    {
      title: '答案',
      dataIndex: 'Answer',
      key: 'Answer',
    },
    {
      title: '分值',
      dataIndex: 'Point',
      key: 'Point',
    },
    {
      title: '水库',
      dataIndex: 'WaterID',
      key: 'WaterID',
      render: (waterID: string) => {
        const waterNames = waterList
          .filter(water => waterID.split(',').includes(String(water.value)))
          .map(water => water.label);
        return waterNames.join(', ');
      }
    },
    {
      title: '难度',
      dataIndex: 'Grade',
      key: 'Grade',
      render: (grade: number) => GradeLevel[grade] || grade,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IActivityQuestion) => (
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

  return (
    <div>
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 8 }}
      >
        <Form.Item name="Title" label="题目">
          <Input placeholder="请输入题目" allowClear />
        </Form.Item>
        <Form.Item name="Grade" label="题目等级">
          <Select placeholder="请选择题目等级" allowClear style={{ width: 120 }}>
            {Object.values(GradeLevel).map((level, index) => (<Select.Option value={index + 1}>{level}</Select.Option>))}
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

      <div style={{ marginBottom: 8 }}>
        <Space>
          <Button type="primary" onClick={handleAdd}>
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
        rowKey="ID"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
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
            <Input />
          </Form.Item>
          <Form.Item name="TitleImg" label="题目图片">
            <UrlUpload text="请上传题目图片" />
          </Form.Item>
          <Form.Item
            name="OptionType"
            label="选项类型"
            rules={[{ required: true, message: '请选择选项类型' }]}
          >
            <Select onChange={value => setEditingRecord({ ...editingRecord, OptionType: value })}>
              <Select.Option value={1}>文本</Select.Option>
              <Select.Option value={2}>图片</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="Options"
            label="选项"
            rules={[{ required: true, message: '请输入选项' }]}
          >
            <OptionsList ref={optionListRef} type={editingRecord?.OptionType} answer={form.getFieldValue('Answer')}/>
          </Form.Item>
          <Form.Item
            name="Point"
            label="分值"
            rules={[{ required: true, message: '请输入分值' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="WaterID"
            label="水库"
            rules={[{ required: true, message: '请选择水库' }]}
          >
            <WaterSelector />
          </Form.Item>
          <Form.Item
            name="Grade"
            label="难度"
            rules={[{ required: true, message: '请输入难度' }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="IsAnswer"
            label="是否绑定活动"
            rules={[{ required: true, message: '请选择是否绑定活动' }]}
          >
            <Select>
              <Select.Option value={'1'}>是</Select.Option>
              <Select.Option value={'0'}>否</Select.Option>
            </Select>
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
            注：1.第一行为导入字段中文名称；2.按照字段的排序不可打乱顺序以免出错；3.关联多个水库请用英文逗号连接。
          </p>
          <a href="https://sk.szsybh.cn/static/quest.xlsx" target="_blank" rel="noopener noreferrer">
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
            {
              title: '关联水库',
              dataIndex: 'WaterID',
              key: 'WaterID',
              render: (waterID: string) => {
                const waterNames = waterList
                  .filter(water => waterID.split(',').includes(String(water.value)))
                  .map(water => water.label);
                return waterNames.join(', ');
              }
            },
            {
              title: '等级',
              dataIndex: 'Grade',
              key: 'Grade',
              render: (grade: number) => GradeLevel[grade] || grade,
            },
          ]}
          dataSource={parsedQuestions}
          rowKey={(record, index) => index.toString()}
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>
    </div>
  );
};

export default ActivityQuestionManagement;
