import type { MyPageTableOptions } from '@/components/business/page';
import type { SystemApiRecord } from '@/interface/system';
import type { FC } from 'react';

import { Button, message, Modal, Space } from "antd";
import { useRef } from 'react';

import { deleteSystemApi, querySystemApi } from '@/api/system';
import MyPage from '@/components/business/page';
import CreateSystemApi from './add';
import ModifySystemApi from './modify';

const { Item: SearchItem } = MyPage.MySearch;

const SystemApiPage: FC = () => {
  const pageRef = useRef<any>(null);
  const handleReload = () => pageRef.current?.load();

  const handleDelete = async (record: SystemApiRecord) => {
    Modal.confirm({
      title: '删除',
      content: `确定删除API【${record.ActionCname}】吗？`,
      onOk: async () => {
        const { Code } = await deleteSystemApi({ ID: record.ID });

        if (Code === 0) {
          message.success({ content: '删除成功' });
          handleReload();
        }
      },
    });
  };

  const SystemApiTableColumns: MyPageTableOptions<SystemApiRecord> = [
    { title: '编号', dataIndex: 'ID', key: 'ID' },
    { title: '模块', dataIndex: 'Module', key: 'Module' },
    { title: '操作名', dataIndex: 'Action', key: 'Action' },
    { title: '操作中文名', dataIndex: 'ActionCname', key: 'ActionCname' },
    { title: '创建时间', dataIndex: 'CreatedAt', key: 'CreatedAt' },
    { title: '更新时间', dataIndex: 'UpdatedAt', key: 'UpdatedAt' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <ModifySystemApi record={record} afterOK={handleReload} />
          <Button size="small" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MyPage
      ref={pageRef}
      pageApi={querySystemApi}
      actionRender={<CreateSystemApi afterOK={handleReload} />}
      searchRender={
        <>
          <SearchItem
            label="模块"
            name="Module"
            type="input"
            style={{ width: '200px' }}
          />
          <SearchItem
            label="操作名"
            name="Action"
            type="input"
            style={{ width: '200px' }}
          />
        </>
      }
      tableOptions={SystemApiTableColumns}
    />
  );
};

export default SystemApiPage; 