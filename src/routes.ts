import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const Layout = lazy(() => import('@/components/Layout'));
const ActivityPage = lazy(() => import('@/features/activities/ActivitiesPage'));
const PayeesPage = lazy(() => import('@/features/payees/PayeesPage.tsx'));
const PaymentsPage = lazy(() => import('@/features/payments/PaymentsPage.tsx'));

export const routes = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'activities',
        Component: ActivityPage,
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
