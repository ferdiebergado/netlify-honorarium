import { lazy } from "react";
import type { RouteObject } from "react-router";

const Hello = lazy(() => import("@/Hello"));

export const routes = [
  {
    path: "/",
    Component: Hello,
  },
] satisfies RouteObject[];
