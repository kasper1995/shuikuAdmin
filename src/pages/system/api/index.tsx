import type { MyPageTableOptions } from '@/components/business/page';
import type { SystemApiRecord } from '@/interface/system';
import React, { FC, useEffect } from "react";

import { Button, message, Modal, Select, Space } from "antd";
import { useRef } from 'react';

import { deleteSystemApi, querySystemApi } from '@/api/system';
import MyPage from '@/components/business/page';
import dayjs from "dayjs";
import CreateSystemApi from './add';
import ModifySystemApi from './modify';
import { fetchDictList } from "@/stores/dict";
import { useDispatch, useSelector } from "react-redux";
import { dictRecord } from "@/interface/user/user";
const { Item: SearchItem } = MyPage.MySearch;

const SystemApiPage: FC = () => {
  const dispatch = useDispatch();
  const pageRef = useRef<any>(null);
  const handleReload = () => pageRef.current?.load();
  const dictList = useSelector((state: any) => state.dict.dictList);
  const list: dictRecord[] = dictList['api_module'] || [];
  useEffect(() => {
    dispatch(fetchDictList('api_module'));
  }, [dispatch]);
  const handleDelete = async (record: SystemApiRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个API吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const { Code } = await deleteSystemApi({ Action: record.Action });
          if (Code === 0) {
            message.success('删除成功');
            handleReload();
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const SystemApiTableColumns: MyPageTableOptions<SystemApiRecord> = [
    { title: '编号', dataIndex: 'ID', key: 'ID' },
    { title: '模块', dataIndex: 'Module', key: 'Module' },
    { title: '操作名', dataIndex: 'Action', key: 'Action' },
    { title: '操作中文名', dataIndex: 'ActionCname', key: 'ActionCname' },
    { title: '创建时间', dataIndex: 'CreatedAt', key: 'CreatedAt', render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: '更新时间', dataIndex: 'UpdatedAt', key: 'UpdatedAt', render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <ModifySystemApi record={record} afterOK={handleReload} />
          <Button type="link" danger onClick={() => handleDelete(record)}>
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
            type="select"
            style={{ width: '200px' }}
          >
            {list.map((item) => (
              <Select.Option key={item.Value} value={item.Value}>
                {item.Desc}
              </Select.Option>
            ))}
          </SearchItem>
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
