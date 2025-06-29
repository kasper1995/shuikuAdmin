import { zhCN_account } from './account';
import { zhCN_component } from './component';
import { zhCN_dashboard } from './dashboard';
import { zhCN_documentation } from './documentation';
import { zhCN_globalTips } from './global/tips';
import { zhCN_guide } from './guide';
import { zhCN_notice } from './notice';
import { zhCN_permissionRole } from './permission/role';
import { zhCN_avatorDropMenu } from './user/avatorDropMenu';
import { zhCN_tagsViewDropMenu } from './user/tagsViewDropMenu';
import { zhCN_title } from './user/title';
import { zhCN_operation } from './operation';
import { zhCN_Title } from "@/locales/zh-CN/title";
const zh_CN = {
  ...zhCN_account,
  ...zhCN_avatorDropMenu,
  ...zhCN_tagsViewDropMenu,
  ...zhCN_title,
  ...zhCN_globalTips,
  ...zhCN_permissionRole,
  ...zhCN_dashboard,
  ...zhCN_guide,
  ...zhCN_documentation,
  ...zhCN_notice,
  ...zhCN_component,
  ...zhCN_operation,
  ...zhCN_Title
};

export default zh_CN;
