import ActivityList from './ActivityList';
import CreateActivityForm from './CreateActivityForm';

export default function ActivitiesPage() {
  return (
    <>
      <div className="mt-8 mb-6 flex">
        <div className="flex flex-col px-3">
          <h1 className="text-2xl font-bold">Activities</h1>
          <h2 className="text-muted-foreground">List of Activities</h2>
        </div>
        <div className="flex flex-1 items-end justify-end px-3">
          <CreateActivityForm />
        </div>
      </div>
      <ActivityList />
    </>
  );
}
