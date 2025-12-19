import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const Layout = lazy(() => import('@/components/Layout'));
const ActivityPage = lazy(() => import('@/features/activities/ActivitiesPage'));

export const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'activities',
        children: [
          {
            index: true,
            Component: ActivityPage,
          },
        ],
      },
    ],
  },
] satisfies RouteObject[];
