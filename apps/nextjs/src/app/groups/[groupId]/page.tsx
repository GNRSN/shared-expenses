import { Suspense } from "react";

import { auth } from "@@/auth";

import { api } from "~/trpc/server";
import { GroupCard } from "../_components/GroupCard";

export const runtime = "edge";

export default async function GroupsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const session = await auth();
  if (!session) return <div>You need to log in to display this page</div>;
  const { groupId } = await params;
  const group = await api.groups.getGroup({ groupId });
  if (!group)
    return <div>Group does not exist or you do not have access to it</div>;

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">Loading...</div>
          }
        >
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            {group.title}
          </h1>

          <div className="w-full max-w-2xl">
            <GroupCard group={group} />
          </div>
        </Suspense>
      </div>
    </main>
  );
}
