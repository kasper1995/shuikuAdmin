import { DictState } from "@/interface/user/user";
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { getDictList } from "@/api/dict.api";
import { createAsyncAction } from "@/stores/utils";

const initialState: DictState = {
  dictList: {},
};

const slice = createSlice({
  name: 'dict',
  initialState,
  reducers: {
    setDictList(state, action: PayloadAction<{ type: string; data: any[] }>) {
      const { type, data } = action.payload;
      state.dictList[type] = data;
    },
  },
});

export const fetchDictList = createAsyncAction<string, boolean>(type => {
  return async dispatch => {
    const { Code, Data } = await getDictList(type);
    if (Code === 0) {
      dispatch(
        slice.actions.setDictList({
          type,
          data: Data[type],
        }),
      );
      return true;
    }
    return false;
  };
});

export const { setDictList } = slice.actions;

export default slice.reducer;
