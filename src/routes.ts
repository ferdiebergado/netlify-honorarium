import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import AuthLayout from './components/AuthLayout';
import Layout from './components/Layout';

const ActivitiesPage = lazy(() => import('./features/activities/ActivitiesPage'));
const PayeesPage = lazy(() => import('./features/payees/PayeesPage'));
const PaymentsPage = lazy(() => import('./features/payments/PaymentsPage'));
const ActivityPage = lazy(() => import('./features/activities/ActivityPage'));
const LoginPage = lazy(() => import('@/components/LoginPage'));
const AuthCallback = lazy(() => import('./features/auth/AuthCallback'));
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
  {
    path: '/login',
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: 'success',
        Component: AuthCallback,
      },
    ],
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
] satisfies RouteObject[];
