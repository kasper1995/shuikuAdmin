import type { FC } from 'react';
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import WrapperRouteComponent from './config';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
const SystemGroupPage = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/system/group'));
const SystemUserPage = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/system/user'));
const SystemApiPage = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/system/api'));
const ReservoirPage = lazy(() => import(/* webpackChunkName: "reservoir" */ '@/pages/operation/reservoir'));
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
        element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />,
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
        path: '/operation/reservoir',
        element: <WrapperRouteComponent element={<ReservoirPage />} titleId="title.operation.reservoir" />,
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
