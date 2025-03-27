import { combineReducers } from '@reduxjs/toolkit';

import dictReducer from './dict';
import globalReducer from './global.store';
import tagsViewReducer from './tags-view.store';
import userReducer from './user.store';
import apiMapReducer from "@/stores/apiMap.store";
const rootReducer = combineReducers({
  user: userReducer,
  tagsView: tagsViewReducer,
  global: globalReducer,
  dict: dictReducer,
  apiMap: apiMapReducer,
});

export default rootReducer;
