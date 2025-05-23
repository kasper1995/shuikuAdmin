import { createLimitActivity, deleteLimitActivity, LimitActivity, modifyLimitActivity, queryLimitActivities } from '@/api/activity/limit';
import CustomEditor from '@/components/customEditor';
import UrlUpload from '@/components/urlUpload';
import { encodeHTML } from "@/utils/exportExcel/tool";
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Space, Switch, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import OptionsList from './components/OptionsList';
import RegistrationModal from './components/RegistrationModal';
const { TextArea } = Input;
const { Search } = Input;

const LimitActivityManagement = () => {
  const [data, setData] = useState<LimitActivity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LimitActivity | null>(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [form] = Form.useForm();

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await queryLimitActivities({
        Page: page,
        PageSize: pageSize,
        Title: searchTitle
      });
      if (res.Code === 0) {
        setData(res.Data);
        setTotal(res.Data.length);
      }
    } catch (error) {
      console.error('获取限时活动列表失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchTitle]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: LimitActivity) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      EndTime: record.EndTime ? dayjs(record.EndTime) : undefined,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个限时活动吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteLimitActivity(id);
          if (res.Code === 0) {
            message.success('删除成功');
            fetchData();
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        ...values,
        EndTime: values.EndTime?.format('YYYY-MM-DD HH:mm:ss'),
        Options: typeof values.Options === 'string' ? values.Options : JSON.stringify(values.Options || []),
        PassType: values.PassType ? 1 : 0,
        Content: encodeHTML(values.Content || '')
      };
      if (editingRecord) {
        const res = await modifyLimitActivity({ ...params, ID: editingRecord.ID });
        if (res.Code === 0) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        }
      } else {
        const res = await createLimitActivity(params);
        if (res.Code === 0) {
          message.success('创建成功');
          setModalVisible(false);
          fetchData();
        }
      }
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'ID',
      key: 'ID',
      render: (_, record) => `${record.Prefix}${record.ID}`,
    },
    {
      title: '主标题',
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
      dataIndex: 'Img',
      key: 'Img',
      render: (text: string) => <img src={text} alt="主图" style={{ width: 50, height: 50 }} />,
    },
    {
      title: '报名人数',
      dataIndex: 'People',
      key: 'People',
      width: 100
      // render: (text, record) => (
      //   <Button type="link" onClick={() => {
      //     setSelectedActivityID(record.ID);
      //     setRegistrationModalVisible(true);
      //   }}>
      //     {text}
      //   </Button>
      // ),
    },
    {
      title: '截止时间',
      dataIndex: 'EndTime',
      key: 'EndTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: LimitActivity) => (
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
    <div className="p-6">
      {/*<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>*/}
      {/*  <Search*/}
      {/*    placeholder="搜索主标题"*/}
      {/*    allowClear*/}
      {/*    enterButton*/}
      {/*    style={{ width: 300 }}*/}
      {/*    onSearch={(value) => setSearchTitle(value)}*/}
      {/*  />*/}
      {/*</div>*/}
      <Button type="primary" onClick={handleAdd} style={{marginBottom: 8}}>
        新增限时活动
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="ID"
        loading={loading}
        pagination={{
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => fetchData(page, pageSize),
        }}
      />

      <Modal
        title={editingRecord ? '编辑限时活动' : '新增限时活动'}
        open={modalVisible}
        onOk={handleSubmit}
        destroyOnClose
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Title"
            label="主标题"
            rules={[{ required: true, message: '请输入主标题' }]}
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
            name="Img"
            label="主图"
            rules={[{ required: true, message: '请上传主图' }]}
          >
            <UrlUpload text="请上传主图" />
          </Form.Item>

          <Form.Item
            name="PassType"
            label="是否需要口令"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.PassType !== currentValues.PassType}
          >
            {({ getFieldValue }) =>
              getFieldValue('PassType') ? (
                <Form.Item
                  name="Pass"
                  label="活动口令"
                  rules={[{ required: true, message: '请输入活动口令' }]}
                >
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="Content"
            label="活动内容"
            rules={[{ required: true, message: '请输入活动内容' }]}
          >
            <CustomEditor />
          </Form.Item>

          <Form.Item
            name="Options"
            label="报名选项"
          >
            <OptionsList />
          </Form.Item>

          <Form.Item
            name="Hint"
            label="提示信息"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Prefix"
            label="编号前缀"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="People"
            label="报名人数"
            rules={[{ required: true, message: '请输入报名人数' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="EndTime"
            label="截止时间"
            rules={[{ required: true, message: '请选择截止时间' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal>

      {/*<RegistrationModal*/}
      {/*  activeLimitID={selectedActivityID}*/}
      {/*  visible={registrationModalVisible}*/}
      {/*  onClose={() => setRegistrationModalVisible(false)}*/}
      {/*/>*/}
    </div>
  );
};

export default LimitActivityManagement;
