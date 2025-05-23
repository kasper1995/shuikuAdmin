// 航拍全景图接口
export interface ISailView {
  ID: number;
  Title: string;
  Image: string;
  WaterID: number;
  WaterName?: string; // 水库名称
  CreateTime: string;
  UpdateTime: string;
}

export interface ISailViewQueryParams {
  WaterID?: number;
  Title?: string;
  PageIndex: number;
  PageSize: number;
}

export interface ISailViewResponse {
  Total: number;
  Items: ISailView[];
}

// 图标管理接口
export interface IIcon {
  ID: number;
  Title: string;
  Image: string;
  Status: number;
  Sort: number;
  Href: string;
  Path: string;
  CreateTime: string;
  UpdateTime: string;
}

export interface IIconQueryParams {
  Title?: string;
  Status?: number;
  PageIndex: number;
  PageSize: number;
}

export interface IIconResponse {
  Total: number;
  Items: IIcon[];
}

// 模块管理接口
export interface IModule {
  ID: number;
  Title: string;
  Image: string;
  Status: number;
  Sort: number;
  Href: string;
  CreateTime: string;
  UpdateTime: string;
}

export interface IModuleQueryParams {
  Title?: string;
  Status?: number;
  PageIndex: number;
  PageSize: number;
}

export interface IModuleResponse {
  Total: number;
  Items: IModule[];
}

export interface ISubmitRecord {
  ID: number;
  Name: string;
  User: string;
  Phone: string;
  CateID: number;
  CateName: string;
  Score: number;
  SubmitTime: string;
}

export interface ISubmitRecordQueryParams {
  Name?: string;
  CateID?: number;
  StartTime?: string;
  EndTime?: string;
  Index: number;
  PageCount: number;
}

export interface ISubmitRecordResponse {
  Total: number;
  Items: ISubmitRecord[];
}

export interface ICate {
  ID: number;
  Name: string;
  Status: number;
  Sort: number;
  CreateTime: string;
  UpdateTime: string;
}

export interface IActivityParticipant {
  ID: number;
  Name: string;
  Phone: string;
  ActivityID: number;
  ActivityName: string;
  Status: number;
  CreateTime: string;
  UpdateTime: string;
}

export interface IActivityParticipantQueryParams {
  Name?: string;
  ActivityID?: number;
  Status?: number;
  StartTime?: string;
  EndTime?: string;
  Index: number;
  PageCount: number;
}

export interface IActivityParticipantResponse {
  Total: number;
  Items: IActivityParticipant[];
}

export interface IActivity {
  ID: number;
  Title: string;
  Img: string;
  Href: string;
  Sort: number;
  Status: number;
}

export interface IActivityQueryParams {
  Title?: string;
  Status?: number;
  PageIndex: number;
  PageSize: number;
}

export interface IActivityResponse {
  Total: number;
  Items: IActivity[];
}

export interface IActivityModifyParams {
  ID: number;
  Status: number;
}

export interface IGoods {
  ID: number;
  Name: string;
  Type: string;
  Image: string;
  Exchange: number;
  Price: number;
  CurrentPrice: number;
  Discount: number;
  Point: number;
  Content: string;
  InStock: number;
  Status: number;
}

export interface IGoodsQueryParams {
  Name?: string;
  Type?: string;
  Status?: number;
  PageIndex: number;
  PageSize: number;
}

export interface IGoodsResponse {
  Code: number;
  Message: string;
  Data: {
    Total: number;
    Items: IGoods[];
  };
}

export interface IGoodsCreateParams extends Omit<IGoods, 'ID'> {}
export interface IGoodsModifyParams extends IGoods {}

export interface IActivityQuestion {
  ID: number;
  ExamID: number;
  Title: string;
  Type: number;
  Options: string;
  Answer: string;
  Point: number;
  CreateTime: string;
  WaterID: string;
  Grade: number;
  Relevancy: string;
  IsAnswer: number;
  TitleImg: string;
  OptionType: number;
}

export interface IActivityQuestionQueryParams {
  Title?: string;
  Type?: number;
  WaterID?: string;
  PageIndex: number;
  PageSize: number;
}

export interface IActivityQuestionResponse {
  Code: number;
  Message: string;
  Data: {
    List: IActivityQuestion[];
    Count: number;
  };
}

export interface IActivityQuestionCreateParams {
  Title: string;
  Type: number;
  Options: string;
  Answer: string;
  Point: number;
  WaterID: string;
  Grade: number;
  IsAnswer: number;
  TitleImg: string;
  OptionType: number;
}

export interface IActivityQuestionModifyParams extends IActivityQuestion {}
