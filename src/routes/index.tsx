import { FC } from "react";
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from "react-router-dom";

import ActivityManagement from '@/pages/activity/participation';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';
import PatrolBannerManagement from '@/pages/patrol/banner';
import IconManagement from '@/pages/patrol/icon';
import ModuleManagement from '@/pages/patrol/module';
import QuestionPage from '@/pages/patrol/question';
import SubmitRecord from '@/pages/patrol/submit';
import VideoPage from '@/pages/patrol/video';

import GoodsManagement from "@/pages/activity/goods";
import LimitActivityManagement from '@/pages/activity/limit';
import LuckyDrawPage from '@/pages/activity/luckyDraw';
import ActivityPioneerManagement from "@/pages/activity/pioneer";
import ActivityPrizeManagement from "@/pages/activity/prize";
import PrizeWinningPage from '@/pages/activity/prizeWinning';
import ActivityQuestionManagement from "@/pages/activity/question";
import BannerManagement from '@/pages/operation/banner';
import QuickSnapPage from "@/pages/operation/quickSnap";
import SailViewManagement from "@/pages/operation/sailViews";
import UserFeedback from "@/pages/operation/userFeedback";
import WechatServicePage from '@/pages/operation/wechatService';
import Statistics from '@/pages/statistics';
import WrapperRouteComponent from './config';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
const SystemGroupPage = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/system/group'));
const SystemUserPage = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/system/user'));
const SystemApiPage = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/system/api'));
const SystemOperationLogPage = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/system/operationLog'));
const ActivityLimitLogPage = lazy(() => import('@/pages/activity/limitLog'));
const ReservoirPage = lazy(() => import(/* webpackChunkName: "reservoir" */ '@/pages/operation/reservoir'));
const ArticlePage = lazy(() => import(/* webpackChunkName: "reservoir" */ '@/pages/operation/article'));
const SystemDictPage = lazy(() => import('@/pages/system/dict'));
const OperationUserQueryPage = lazy(() => import('@/pages/operation/user'));
// const Guide = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/guide'));
// const RoutePermission = lazy(() => import(/* webpackChunkName: "route-permission"*/ '@/pages/permission/route'));
// const FormPage = lazy(() => import(/* webpackChunkName: "form'"*/ '@/pages/components/form'));
// const TablePage = lazy(() => import(/* webpackChunkName: "table'"*/ '@/pages/components/table'));
// const SearchPage = lazy(() => import(/* webpackChunkName: "search'"*/ '@/pages/components/search'));
// const TabsPage = lazy(() => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/tabs'));
// const AsidePage = lazy(() => import(/* webpackChunkName: "aside'"*/ '@/pages/components/aside'));
// const RadioCardsPage = lazy(() => import(/* webpackChunkName: "radio-cards'"*/ '@/pages/components/radio-cards'));
// const BusinessBasicPage = lazy(() => import(/* webpackChunkName: "basic-page" */ '@/pages/business/basic'));
// const BusinessWithSearchPage = lazy(() => import(/* webpackChunkName: "with-search" */ '@/pages/business/with-search'));
// const BusinessWithAsidePage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-aside'));
// const BusinessWithRadioCardsPage = lazy(
//   () => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-radio-cards'),
// );
// const BusinessWithTabsPage = lazy(() => import(/* webpackChunkName: "with-tabs" */ '@/pages/business/with-tabs'));

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'dashboard',
        element: <WrapperRouteComponent element={<Statistics />} titleId="title.dashboard" />,
      },
      {
        path: '/system/group',
        element: <WrapperRouteComponent element={<SystemGroupPage />} titleId="title.documentation" />,
      },
      {
        path: '/system/user',
        element: <WrapperRouteComponent element={<SystemUserPage />} titleId="title.documentation" />,
      },
      {
        path: '/system/api',
        element: <WrapperRouteComponent element={<SystemApiPage />} titleId="title.documentation" />,
      },
      {
        path: '/system/operation_log',
        element: <WrapperRouteComponent element={<SystemOperationLogPage />} titleId="title.documentation" />,
      },
      {
        path: '/system/dict',
        element: <WrapperRouteComponent element={<SystemDictPage />} />,
      },
      {
        path: '/operation/reservoir',
        element: <WrapperRouteComponent element={<ReservoirPage />} titleId="title.operation.reservoir" />,
      },
      {
        path: '/operation/article',
        element: <WrapperRouteComponent element={<ArticlePage />} titleId="title.operation.article" />,
      },
      {
        path: '/operation/banner',
        element: <WrapperRouteComponent element={<BannerManagement />} titleId="title.operation.banner" />,
      },
      {
        path: '/operation/sailViews',
        element: <WrapperRouteComponent element={<SailViewManagement />} titleId="title.operation.sailview" />,
      },
      {
        path: '/operation/quickSnap',
        element: <WrapperRouteComponent element={<QuickSnapPage />} titleId="title.operation.quickSnap" />,
      },
      {
        path: '/operation/userFeedback',
        element: <WrapperRouteComponent element={<UserFeedback />} titleId="title.operation.userFeedBack" />,
      },
      {
        path: '/operation/wechatService',
        element: <WrapperRouteComponent element={<WechatServicePage />} titleId="title.operation.wechatService" />,
      },
      {
        path: '/patrol/question',
        element: <WrapperRouteComponent element={<QuestionPage />} titleId="title.patrol.question" />,
      },
      {
        path: '/patrol/video',
        element: <WrapperRouteComponent element={<VideoPage />} titleId="title.patrol.video" />,
      },
      {
        path: '/patrol/icon',
        element: <WrapperRouteComponent element={<IconManagement />} titleId="title.patrol.icon" />,
      },
      {
        path: '/patrol/module',
        element: <WrapperRouteComponent element={<ModuleManagement />} />,
      },
      {
        path: '/patrol/submit',
        element: <WrapperRouteComponent element={<SubmitRecord />} />,
      },
      {
        path: '/patrol/banner',
        element: <WrapperRouteComponent element={<PatrolBannerManagement />} titleId="title.patrol.banner" />,
      },
      {
        path: '/activity/participant',
        element: <WrapperRouteComponent element={<ActivityManagement />} />,
      },
      {
        path: '/activity/goods',
        element: <WrapperRouteComponent element={<GoodsManagement />} />,
      },
      {
        path: '/activity/question',
        element: <WrapperRouteComponent element={<ActivityQuestionManagement />} />,
      },
      {
        path: '/activity/pioneer',
        element: <WrapperRouteComponent element={<ActivityPioneerManagement />} />,
      },
      {
        path: '/activity/prize',
        element: <WrapperRouteComponent element={<ActivityPrizeManagement />} />,
      },
      {
        path: '/activity/prize_winning',
        element: <WrapperRouteComponent element={<PrizeWinningPage />} />,
      },
      {
        path: '/activity/limit',
        element: <LimitActivityManagement />,
      },
      {
        path: '/operation/user',
        element: <WrapperRouteComponent element={<OperationUserQueryPage />} />,
      },
      {
        path: '/activity/limit_log',
        element: <WrapperRouteComponent element={<ActivityLimitLogPage />} />,
      },
      {
        path: '/activity/lucky_draw',
        element: <WrapperRouteComponent element={<LuckyDrawPage />} titleId="title.activity.luckyDraw" />,
      },
      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
