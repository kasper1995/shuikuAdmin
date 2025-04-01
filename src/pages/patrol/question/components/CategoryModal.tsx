import { createPatrolCategory, deletePatrolCategory, modifyPatrolCategory, queryPatrolCategory } from '@/api/patrol/category';
import { PatrolCategory } from '@/interface/patrol/category';
import { Button, Form, Input, List, Modal, message } from 'antd';
import { useEffect, useState } from 'react';

const CategoryModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<PatrolCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  // 查询分类列表
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await queryPatrolCategory();
      if (res.Code === 0) {
        setCategories(res.Data || []);
      }
    } catch (error) {
      message.error('查询失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  // 处理添加提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res = await createPatrolCategory({
        Name: values.Name,
      });
      if (res.Code === 0) {
        message.success('创建成功');
        form.resetFields();
        fetchCategories();
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理编辑
  const handleEdit = (category: PatrolCategory) => {
    setEditingId(category.ID);
    setEditingName(category.Name);
  };

  // 处理保存编辑
  const handleSaveEdit = async (ID: number) => {
    try {
      const res = await modifyPatrolCategory({
        ID,
        Name: editingName,
      });
      if (res.Code === 0) {
        message.success('修改成功');
        setEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      message.error('修改失败');
    }
  };

  // 处理取消编辑
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // 处理删除
  const handleDelete = async (ID: number) => {
    try {
      const res = await deletePatrolCategory(ID);
      if (res.Code === 0) {
        message.success('删除成功');
        fetchCategories();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (<>
      <Button onClick={() => setVisible(true)} type="primary">
        试卷管理
      </Button>

      <Modal
        title="试卷分类管理"
        open={visible}
        onCancel={() => setVisible(false)}
        width={600}
        footer={null}
      >
        <div className="mb-4">
          <Form form={form} layout="inline">
            <Form.Item
              name="Name"
              rules={[{ required: true, message: '请输入分类名称' }]}
            >
              <Input placeholder="请输入分类名称" style={{ width: 300 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSubmit}>
                添加
              </Button>
            </Form.Item>
          </Form>
        </div>

        <List
          loading={loading}
          dataSource={categories}
          renderItem={(item) => (
            <List.Item
              actions={[
                editingId == item.ID ? (
                  <>
                    <Button
                      type="link"
                      key="save"
                      onClick={() => handleSaveEdit(item.ID)}
                    >
                      保存
                    </Button>
                    <Button
                      type="link"
                      key="cancel"
                      onClick={handleCancelEdit}
                    >
                      取消
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="link"
                      key="edit"
                      onClick={() => handleEdit(item)}
                    >
                      编辑
                    </Button>
                    <Button
                      type="link"
                      danger
                      key="delete"
                      onClick={() => handleDelete(item.ID)}
                    >
                      删除
                    </Button>
                  </>
                ),
              ]}
            >
              <List.Item.Meta
                title={
                  editingId == item.ID ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      style={{ width: 200 }}
                    />
                  ) : (
                    item.Name
                  )
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default CategoryModal;
