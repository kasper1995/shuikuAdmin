import { axiosResultData } from '@/interface';
import { dictRecord } from '@/interface/user/user';
import { request } from './request';

/** 获取字典列表 */
export const getDictList = (type: string) => 
  request<axiosResultData<dictRecord>>('post', `/query_system_dict`, {Item: type}); 