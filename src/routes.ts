import { lazy } from "react";
import type { RouteObject } from "react-router";

const Layout = lazy(() => import("@/components/Layout"));
const ActivityPage = lazy(
  () => import("@/features/activities/CreateActivityPage")
);

export const routes = [
  {
    Component: Layout,
    children: [
      {
        path: "/activities",
        Component: ActivityPage,
      },
    ],
  },
] satisfies RouteObject[];
