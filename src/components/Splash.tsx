export default function Splash() {
  const app = import.meta.env.VITE_APP_TITLE;

  return (
    <main className="bg-background flex h-screen items-center justify-center">
      <h1 className="text-primary text-4xl font-extrabold">{app}</h1>
    </main>
  );
}
