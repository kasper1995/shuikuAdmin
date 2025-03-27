import { axiosResultData, axiosResultsData } from "@/interface";
import { SystemGroupRecord, SystemUserRecord } from "@/interface/system";
import { request } from './request';

/** 创建系统分组 */
export const createSystemGroup = (data: { GroupName: string }) =>
  request<axiosResultData<SystemGroupRecord>>('post', '/create_system_group', data);

/** 查询系统分组 */
export const querySystemGroup = (data: { GroupName: string, Status: 'active' | 'banned' }) => request<axiosResultsData<SystemGroupRecord>>('post', '/query_system_group', data);

/** 修改系统分组 */
export const modifySystemGroup = (data: { GroupName: string, Status: 'active' | 'banned' }) => request<axiosResultData<SystemGroupRecord>>('post', '/modify_system_group', data);

/** 删除系统分组 */
export const deleteSystemGroup = (data: { GroupName: string }) =>
  request<axiosResultData<SystemGroupRecord>>('post', '/delete_system_group', data);

/** 创建系统分组 */
export const createSystemApi = (data: { GroupName: string }) =>
  request<axiosResultData<SystemGroupRecord>>('post', '/create_system_api', data);

/** 查询系统分组 */
export const querySystemApi = (data: { GroupName: string, Status: 'active' | 'banned' }) => request<axiosResultsData<SystemGroupRecord>>('post', '/query_system_api', data);

/** 修改系统分组 */
export const modifySystemApi = (data: { GroupName: string, Status: 'active' | 'banned' }) => request<axiosResultData<SystemGroupRecord>>('post', '/modify_system_api', data);

/** 删除系统分组 */
export const deleteSystemApi = (data: { GroupName: string }) =>
  request<axiosResultData<SystemGroupRecord>>('post', '/delete_system_api', data);

/** 查询系统分组与API接口映射 */
export const querySystemGroupApiMap = (data: { GroupName: string }) =>
  request<axiosResultData<SystemGroupRecord>>('post', '/query_system_group_api_map', data);

/** 修改系统分组与API接口映射 */
export const modifySystemGroupApiMap = (data: { GroupName: string, Actions: string[] }) =>
  request<axiosResultData<SystemGroupRecord>>('post', '/modify_system_group_api_map', data);

/** 创建用户 */
export const createSystemUser = (data: { GroupName: string }) =>
  request<axiosResultData<SystemUserRecord>>('post', '/create_system_user', data);

/** 查询用户 */
export const querySystemUser = (data: { GroupName: string, Status: 'active' | 'banned' }) => request<axiosResultsData<SystemUserRecord>>('post', '/query_system_user', data);

/** 修改用户 */
export const modifySystemUser = (data: { GroupName: string, Status: 'active' | 'banned' }) => request<axiosResultData<SystemUserRecord>>('post', '/modify_system_user', data);

/** 删除用户 */
export const deleteSystemUser = (data: { GroupName: string }) =>
  request<axiosResultData<SystemUserRecord>>('post', '/delete_system_user', data);
