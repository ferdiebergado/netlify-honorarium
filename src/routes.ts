import PrivateLayout from '@/components/PrivateLayout';
import PublicLayout from '@/components/PublicLayout';
import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const ActivitiesPage = lazy(() => import('./features/activities/ActivitiesPage'));
const ActivityPage = lazy(() => import('./features/activities/ActivityPage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const Dashboard = lazy(() => import('@/components/Dashboard'));
const NotFoundPage = lazy(() => import('@/components/NotFoundPage'));

export const routes = [
  {
    path: '/',
    Component: PrivateLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'activities',
        Component: ActivitiesPage,
      },
      {
        path: 'activities/:activityId',
        Component: ActivityPage,
      },
    ],
  },
  {
    path: '/login',
    Component: PublicLayout,
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
