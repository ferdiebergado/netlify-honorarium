import { Outlet } from "react-router";
import { Toaster } from "./ui/sonner";

export default function Layout() {
  return (
    <main className="m-8">
      <Outlet />
      <Toaster position="top-right" expand richColors />
    </main>
  );
}
