"use client";

import { use } from "react";

import type { RouterOutputs } from "@@/api";

import { api } from "~/trpc/react";
import { GroupCardMinimal } from "./GroupCard";

export function GroupsList(props: {
  groups: Promise<RouterOutputs["groups"]["getForCurrentUser"]>;
}) {
  const initialData = use(props.groups);
  const { data: groupsForUser } = api.groups.getForCurrentUser.useQuery(
    undefined,
    {
      initialData,
    },
  );

  return (
    <>
      {!groupsForUser.length ? (
        <p className="text-center text-xl">No groups for user</p>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {groupsForUser.map(({ group }) => (
            <GroupCardMinimal key={group.id} group={group} />
          ))}
        </div>
      )}
    </>
  );
}
