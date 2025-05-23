import { request } from '@/api/request';
import { IActivityQuestionCreateParams, IActivityQuestionModifyParams, IActivityQuestionQueryParams, IActivityQuestionResponse } from '@/services/patrol/interface';

export const queryActivityQuestions = (params: IActivityQuestionQueryParams) => {
  return request<IActivityQuestionResponse>('post', '/query_exam_question', params);
};

export const createActivityQuestion = (params: IActivityQuestionCreateParams | IActivityQuestionCreateParams[]) => {
  return request<IActivityQuestionResponse>('post', '/create_exam_question', params);
};

export const modifyActivityQuestion = (params: IActivityQuestionModifyParams) => {
  return request<IActivityQuestionResponse>('post', '/modify_exam_question', params);
};

export const deleteActivityQuestion = (id: number) => {
  return request<IActivityQuestionResponse>('post', '/delete_exam_question', { ID: id });
};

export const queryWaterList = () => {
  return request<any>('post', '/query_water_list');
};
