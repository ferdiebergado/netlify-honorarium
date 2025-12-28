import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const Layout = lazy(() => import('@/components/Layout'));
const ActivitiesPage = lazy(() => import('@/features/activities/ActivitiesPage'));
const PayeesPage = lazy(() => import('@/features/payees/PayeesPage.tsx'));
const PaymentsPage = lazy(() => import('@/features/payments/PaymentsPage.tsx'));
const ActivityPage = lazy(() => import('@/features/activities/ActivityPage.tsx'));

export const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'activities/:activityId',
        Component: ActivityPage,
      },
      {
        path: 'activities',
        Component: ActivitiesPage,
      },
      {
        path: 'payees',
        Component: PayeesPage,
      },
      {
        path: 'payments',
        Component: PaymentsPage,
      },
    ],
  },
] satisfies RouteObject[];
