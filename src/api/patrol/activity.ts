import { IActivityParticipantQueryParams, IActivityParticipantResponse } from '@/services/patrol/interface';
import { request } from '@/utils/request';

export const queryActivityParticipants = (params: IActivityParticipantQueryParams) => {
  return request<IActivityParticipantResponse>('/query_activity_participant', {
    method: 'POST',
    data: params,
  });
};

export const queryActivities = () => {
  return request<{ Code: number; Data: any[]; Message: string }>('/query_activity', {
    method: 'POST',
    data: {},
  });
}; 