"use client";

import { use } from "react";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";

export function GroupsList(props: {
  groups: Promise<RouterOutputs["groups"]["getForCurrentUser"]>;
}) {
  const initialData = use(props.groups);
  const { data: groups } = api.groups.getForCurrentUser.useQuery(undefined, {
    initialData,
  });

  return (
    <>
      {!groups.length ? (
        <p className="text-center text-xl">No groups for user</p>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {groups.map((g) => {
            return (
              <div key={g.groupId}>
                <div className="font-bold">{g.group.title}</div>

                <div>
                  {g.group.userToGroup.map((utg) => {
                    return (
                      <div key={utg.userId}>
                        • {utg.user.name}
                        {utg.userId === g.group.owner && " (Owner)"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
