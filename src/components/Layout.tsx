import { Outlet } from 'react-router';
import Navbar from './Navbar';
import { Toaster } from './ui/sonner';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="m-12">
        <Outlet />
        <Toaster position="top-right" expand richColors />
      </main>
    </>
  );
}
