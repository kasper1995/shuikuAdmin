import { dictRecord } from '@/interface/user/user';
import type { TreeSelectProps } from 'antd';
import { xor } from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SystemApiRecord } from "@/interface/system";

interface TreeNode {
  title: string;
  value: string;
  key: string;
  children: TreeNode[];
}

export const useTreeDict = (type: string = 'api_module', permissionData: SystemApiRecord[]) => {
  const dictList = useSelector((state: any) => state.dict.dictList);
  const { apiMap, loading } = useSelector((state: any) => state.apiMap);
  const treeData = useMemo(() => {
    const list: dictRecord[] = dictList[type] || [];
    const map = new Map<string, TreeNode>();
    const result: TreeNode[] = [];
    if(list.length === 0) return [];
    const typeList = xor(list.map(item => item.Item))
    // debugger
    // // 第一次遍历，创建所有节点
    typeList.forEach(item => {
        // 找到当前类型的所有记录
        const typeRecords = list.filter(i => i.Item === item);

        // 为每个类型创建一个父节点
        if (typeRecords.length > 0) {
          const parentNode: TreeNode = {
            title: item,
            value: item,
            key: item,
            children: []
          };
          map.set(item, parentNode);
        }

        // 添加该类型下的所有子节点
        typeRecords.forEach(i => {
          const childNode: TreeNode = {
            title: i.Desc,
            value: i.Value,
            key: i.Value,
            children: []
          };

          const parentNode = map.get(item);
          if (parentNode && parentNode.children) {
            result.push(childNode);
          }
        });
      });
    if(apiMap.length === 0) return result;
    apiMap.forEach((item: SystemApiRecord) => {
      result.forEach(k => {
        if(k.key === item.Module){
          k.children?.push({
            title: item.ActionCname,
            value: item.Action,
            key: item.Action
          })
        }
      })
    })
    console.log(result);
    return result;
  }, [dictList, type, permissionData, apiMap]);

  const treeSelectProps: Partial<TreeSelectProps> = {
    treeData,
    treeCheckable: true,
    showCheckedStrategy: 'SHOW_CHILD',
    placeholder: '请选择模块',
    style: { width: '100%', height: 'auto' },
    // maxTagCount: 'responsive'
  };

  return {
    treeData,
    treeSelectProps
  };
};
