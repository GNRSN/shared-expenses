"use client";

import { use } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";

export function GroupsList(props: {
  groups: Promise<RouterOutputs["groups"]["forUser"]>;
}) {
  const initialData = use(props.groups);
  const { data: groups } = api.groups.forUser.useQuery(undefined, {
    initialData,
  });

  return (
    <>
      {!groups.length ? (
        <p className="text-center text-xl">No groups for user</p>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {groups.map((g) => {
            return <div key={g.groupId}>{g.groupId}</div>;
          })}
        </div>
      )}
    </>
  );
}