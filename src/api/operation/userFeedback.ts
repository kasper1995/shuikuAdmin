import { UserFeedbackModifyParams, UserFeedbackQueryParams, UserFeedbackQueryResult } from '@/interface/operation/userFeedback';
import { request } from '../request';

// 查询用户反馈列表
export const queryUserFeedback = (params: UserFeedbackQueryParams) => {
  return request<UserFeedbackQueryResult>('post', '/query_operations_user_feedback', params);
};

// 修改用户反馈
export const modifyUserFeedback = (params: UserFeedbackModifyParams) => {
  return request('post', '/modify_operations_user_feedback', params);
}; 