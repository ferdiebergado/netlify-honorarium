import AuthLayout from '@/components/AuthLayout';
import Layout from '@/components/Layout';
import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const ActivitiesPage = lazy(() => import('./features/activities/ActivitiesPage'));
const ActivityPage = lazy(() => import('./features/activities/ActivityPage'));
const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const NotFoundPage = lazy(() => import('@/components/NotFoundPage'));

export const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'activities/:activityId',
        Component: ActivityPage,
      },
      {
        path: 'activities',
        Component: ActivitiesPage,
      },
    ],
  },
  {
    path: '/login',
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
    ],
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
] satisfies RouteObject[];
