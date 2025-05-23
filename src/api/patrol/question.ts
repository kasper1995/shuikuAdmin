import { QuestionModifyParams, QuestionQueryParams } from '@/interface/patrol/question';
import { request } from '../request';

// 查询试题列表
export const queryPatrolQuestion = (params: QuestionQueryParams) => {
  return request('post', '/query_patrol_question', params);
};

// 创建试题
export const createPatrolQuestion = (params: QuestionModifyParams[]) => {
  return request('post', '/create_patrol_question', params);
};

// 修改试题
export const modifyPatrolQuestion = (params: QuestionModifyParams) => {
  return request('post', '/modify_patrol_question', params);
};

// 删除试题
export const deletePatrolQuestion = (ID: number) => {
  return request('post', '/delete_patrol_question', { ID });
};
