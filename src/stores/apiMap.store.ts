import { modifySystemGroupApiMap, querySystemApi } from "@/api/system";
import { SystemApiMapRecord, SystemApiMapState } from '@/interface/system';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncAction } from './utils';

const initialState: SystemApiMapState = {
  apiMap: [],
  loading: false,
};

const apiMapSlice = createSlice({
  name: 'apiMap',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setApiMap(state, action: PayloadAction<SystemApiMapRecord[]>) {
      state.apiMap = action.payload;
    },
  },
});

// 异步 action: 获取 API 映射
export const fetchApiMap = createAsyncAction<string, boolean>(groupName => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      const { Code, Data } = await querySystemApi({ GroupName: '', Status: 'active' });
      if (Code === 0) {
        dispatch(setApiMap(Data));
        return true;
      }
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
});

// 异步 action: 修改 API 映射
export const updateApiMap = createAsyncAction<
  { groupName: string; actions: string[] },
  boolean
>(params => {
  return async dispatch => {
    dispatch(setLoading(true));
    try {
      const { Code } = await modifySystemGroupApiMap({
        GroupName: params.groupName,
        Actions: params.actions,
      });
      if (Code === 0) {
        // 更新成功后重新获取最新数据
        dispatch(fetchApiMap(''));
        return true;
      }
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
});

export const { setLoading, setApiMap } = apiMapSlice.actions;

export default apiMapSlice.reducer;
