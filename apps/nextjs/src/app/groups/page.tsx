import { Suspense } from "react";

import { api } from "~/trpc/server";
import { CreateGroupForm } from "./_components/CreateGroupForm";
import { GroupsList } from "./_components/GroupsList";

export const runtime = "edge";

export default function GroupsPage() {
  const groups = api.groups.getForCurrentUser();

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Groups
        </h1>

        <CreateGroupForm />

        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">Loading...</div>
            }
          >
            <GroupsList groups={groups} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
