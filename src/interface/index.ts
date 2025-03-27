export interface Locales<T = any> {
  /** Chinese */
  zh_CN: T;
  /** English */
  en_US: T;
}

export type Language = keyof Locales;

export interface PageData<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}

export interface axiosResultData<T> {
  Code: number;
  Data: T;
  RequestID: string;
  Status: 'Success' | 'Fail';
}

export interface axiosResultsData<T> {
  Code: number;
  Data: T[];
  RequestID: string;
  Status: 'Success' | 'Fail';
}
