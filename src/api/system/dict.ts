import { request } from '@/api/request';
import { CreateSystemDictParams, SystemDictQueryParams, SystemDictQueryResult } from '@/interface/system/dict';

export const querySystemDict = (params: SystemDictQueryParams) => 
  request<SystemDictQueryResult>('post', `/query_system_dict`, params); 

export const createSystemDict = (params: CreateSystemDictParams) => {
  return request<SystemDictQueryResult>('post', `/create_system_dict`, params); 
}; 