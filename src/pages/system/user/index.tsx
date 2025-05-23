import type { MyPageTableOptions } from '@/components/business/page';
import type { SystemGroupRecord } from '@/interface/system';
import { FC, useEffect } from "react";

import { Button, message, Modal, Space, Tag } from "antd";
import React, { useRef } from 'react';

import { deleteSystemUser, querySystemGroup, querySystemUser } from "@/api/system";

import MyPage from '@/components/business/page';
import CreateSystemUser from '@/pages/system/user/add';
import ModifySystemUserPassword from "@/pages/system/user/changePassword";
import ModifySystemUser from '@/pages/system/user/modify';

const { Item: SearchItem } = MyPage.MySearch;

const SystemUserWithSearchPage: FC = () => {
  const pageRef = useRef<any>(null);
  const [systemGroupOptions, setSystemGroupOptions] = React.useState<any>([]);
  const handleReload = () => pageRef.current?.load();

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteSystemUser(id);
          if (res.Code === 0) {
            message.success('删除成功');
            handleReload();
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };
  const getSystemGroup = async () => {
    const { Code, Data } = await querySystemGroup({ GroupName: '', Status: 'active' });
    if (Code === 0) {
      setSystemGroupOptions(Data.map((item: SystemGroupRecord) => ({ label: item.GroupName, value: item.GroupName })))
    } else {
      setSystemGroupOptions([])
    }
  }
  useEffect(() => {
    getSystemGroup();
  }, []);
  const SystemGroupTableColumns: MyPageTableOptions<SystemGroupRecord> = [
    { title: '编号', dataIndex: 'ID', key: 'age' },
    { title: '真实姓名', dataIndex: 'Nick', key: 'Nick' },
    { title: '用户名', dataIndex: 'Username', key: 'Username' },
    { title: '所属分组', dataIndex: 'GroupName', key: 'GroupName' },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      render: text => <Tag color={text === 'active' ? 'green' : 'red'}>{text === 'active' ? '激活' : '禁用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <ModifySystemUser record={record} systemGroupOptions={systemGroupOptions} afterOK={handleReload} />
          <ModifySystemUserPassword record={record} afterOK={handleReload} />
          <Button type="link" danger onClick={() => handleDelete(record.ID)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MyPage
      ref={pageRef}
      pageApi={querySystemUser}
      actionRender={<CreateSystemUser systemGroupOptions={systemGroupOptions} afterOK={handleReload} />}
      searchRender={
        <>
          <SearchItem
            label="用户名"
            name="Username"
            type="input"
            style={{ width: '200px' }}
          />
          <SearchItem
            label="所属分组"
            name="GroupName"
            type="select"
            style={{ width: '200px' }}
            options={systemGroupOptions}
          />
          <SearchItem
            label="状态"
            name="Status"
            type="select"
            style={{ width: '200px' }}
            options={[
              { label: '正常', value: 'active' },
              { label: '禁用', value: 'banned' },
            ]}
          />
        </>
      }
      tableOptions={SystemGroupTableColumns}
    ></MyPage>
  );
};

export default SystemUserWithSearchPage;
