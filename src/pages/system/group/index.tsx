import type { MyPageTableOptions } from '@/components/business/page';
import type { SystemGroupRecord } from '@/interface/system';
import type { FC } from 'react';

import { Button, message, Modal, Space, Tag } from "antd";
import { useEffect, useRef, useState } from 'react';

import { deleteSystemGroup, querySystemGroup, querySystemGroupApiMap } from '@/api/system';
import MyPage from '@/components/business/page';
import CreateSystemGroup from '@/pages/system/group/add';
import ModifySystemGroup from '@/pages/system/group/modify';
import SystemGroupPermisstion from "@/pages/system/group/permission";
import { fetchDictList } from '@/stores/dict';
import { useDispatch } from 'react-redux';
import { fetchApiMap } from "@/stores/apiMap.store";

const { Item: SearchItem } = MyPage.MySearch;

const SystemGroupWithSearchPage: FC = () => {
  const pageRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [apiMap, setApiMap] = useState({});

  const loadApiMap = () => {
    querySystemGroupApiMap({ GroupName: '' }).then(res => {
      if (res.Code === 0) {
        setApiMap(res.Data);
      }
    });
  };

  useEffect(() => {
    dispatch(fetchDictList('api_module'));
    dispatch(fetchApiMap(''));
    loadApiMap();
  }, []);

  const handleReload = () => pageRef.current?.load();

  const handleDelete = async (record: SystemGroupRecord) => {
    Modal.confirm({
      title: '删除',
      content: `确定删除分组【${record.GroupName}】吗？`,
      onOk: async () => {
        const { Code } = await deleteSystemGroup({ GroupName: record.GroupName });

        if (Code === 0) {
          message.success({ content: '删除成功' });
          handleReload();
        }
      },
    });
  };

  const SystemGroupTableColumns: MyPageTableOptions<SystemGroupRecord> = [
    { title: '编号', dataIndex: 'ID', key: 'age' },
    { title: '名称', dataIndex: 'GroupName', key: 'GroupName' },
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
          <ModifySystemGroup record={record} afterOK={handleReload} />
          <SystemGroupPermisstion
            record={record}
            permissionData={apiMap}
            afterOK={loadApiMap}
          />
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
      pageApi={querySystemGroup}
      actionRender={<CreateSystemGroup afterOK={handleReload} />}
      searchRender={
        <>
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
    />
  );
};

export default SystemGroupWithSearchPage;
